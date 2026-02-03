const { validationResult } = require("express-validator");
const { getLatestUserInstagramActivityLog } = require("../user/get.user.instagram.activity.log");
const { deleteUserInstagramActivityLog } = require("../user/instagram/delete.user.instagram.activity.log");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
const { DATABASE_DIALECT } = require("../../constants/app_constants");
const { APPLICATION_BASE_URL, MEMORY_QUEUE_NAME, RABBITMQ_QUEUE_LOGS } = require("../../constants/app_constants");

const isSQL = DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo';

const { saveInstagramUserToken } = isSQL
   ? require("../user/instagram/store.pg.instagram.token")
   : require("../user/instagram/store.mongo.instagram.token");

const { saveInstagramUserData } = isSQL
   ? require("../user/instagram/store.pg.instagram.data")
   : require("../user/instagram/store.mongo.instagram.data");

const { getUserEmailByReferenceNumber } = require("../user/get.user.email.by.reference.no");
const { getInstagramToken, instagramProfile, getLongLivedAccessToken } = require("../../services/INSTAGRAM");
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");

module.exports.GetInstagramProfile = async (req, res) => {
   const { code, state, error, error_reason, error_description, message } = req.query;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, error: true, message: errors.array() });
   }
   if (error && error_reason === 'user_denied') {
      return res.status(403).send({ success: false, error: true, message: 'Access denied. Please try again later.' });
   }
   if (error && error_description) {
      return res.status(400).send({ success: false, error: true, message: error_description });
   }
   if (message) {
      return res.status(400).send({ success: false, error: true, message: message });
   }
   if (!code) {
      return res.status(400).send({ success: false, error: true, message: 'Authorization code missing. Please link your Instagram account.' });
   }
   if (!state) {
      return res.status(400).send({ success: false, error: true, message: 'State value missing.' });
   }

   try {
      // EXTREME SPEED: Overlap token exchange and activity log retrieval
      const [tokenResponse, userData] = await Promise.all([
         getInstagramToken(code, "authorize"),
         getLatestUserInstagramActivityLog("ig", state)
      ]);

      if (!userData) {
         return res.status(400).send({ success: false, error: true, message: 'Something wrong has happened. Please try later' });
      }

      const { reference_number, client_type } = userData;
      if (!client_type || (client_type !== "web" && client_type !== "mobile")) {
         return res.status(400).json({ success: false, error: true, message: 'Missing client_type i.e. { web or mobile }.' });
      }

      if (tokenResponse[0] === true) {
         // EXTREME SPEED: Parallelize email check, profile fetch, and long-lived token exchange
         const [email, profile, longLivedToken] = await Promise.all([
            getUserEmailByReferenceNumber(reference_number),
            instagramProfile(tokenResponse[1]),
            getLongLivedAccessToken(tokenResponse[1])
         ]);

         if (profile[0] === true) {
            //-.get profile data.    
            const { id, user_id, username, name, account_type, profile_picture_url, followers_count, follows_count, media_count } = profile[1];
            const payload = { reference_number, id, user_id, username, name, account_type, profile_picture_url, followers_count, follows_count, media_count };

            // EXTREME SPEED: Save data, handle logs, and cache in parallel
            const message = 'Your Instagram profile information has been shared with Project W-IG.';
            const payload2 = {
               channel_name: 'activity_log',
               email: email,
               reference_number: reference_number,
               activity_name: 'Instagram login was successful.'
            };

            const parallelTasks = [
               saveInstagramUserData(payload, reference_number),
               sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(payload2)).catch(e => console.error("RabbitMQ Log Error:", e)),
               deleteUserInstagramActivityLog(reference_number, "authorize"),
               deleteUserInstagramActivityLog(reference_number, "deauthorize")
            ];

            if (longLivedToken) {
               parallelTasks.push(saveInstagramUserToken({ reference_number: reference_number, access_token: tokenResponse[1], long_lived_token: longLivedToken }));

               // Cache handling
               parallelTasks.push((async () => {
                  const client = await connectToRedis();
                  if (client) {
                     await client.set(reference_number, longLivedToken);
                     await closeRedisConnection(client);
                  }
               })());
            }

            await Promise.all(parallelTasks);

            if (client_type === "mobile") {
               res.status(200).json({
                  success: true,
                  error: false,
                  message: message
               });
               return;
            }
            res.redirect(`${APPLICATION_BASE_URL}/instagram?message=${message}`);
            return;
         }

         // Handle case where profile fetch failed but token response was true (unlikely but structure requires it)
         if (client_type === "mobile") {
            const messageMobile = `Error retrieving Instagram profile. ${profile[1]}`;
            const payloadMobile = {
               channel_name: "error_log",
               email: email,
               reference_number: reference_number,
               error_code: 400,
               error_message: messageMobile
            };
            sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(payloadMobile)).catch(e => console.error("RabbitMQ Log Error:", e));
            res.status(400).json({
               success: false,
               error: true,
               data: profile[1],
               message: messageMobile
            });
            return;
         }
         res.redirect(303, `${APPLICATION_BASE_URL}/instagram?message=${profile[1]}`);
         return;
      }

      const messageLast = `ERROR: ${tokenResponse[1]}`;
      const payloadLast = {
         channel_name: "error_log",
         email: "unknown", // Reference number might be available but tokenResponse[1] is error
         reference_number: reference_number || "unknown",
         error_code: 400,
         error_message: messageLast
      };
      sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(payloadLast)).catch(e => console.error("RabbitMQ Log Error:", e));
      res.status(400).json({
         success: false,
         error: true,
         message: messageLast
      });
   } catch (e) {
      res.status(500).json({
         success: false,
         error: true,
         message: e?.message || 'Something wrong has happened'
      });
   }
};

