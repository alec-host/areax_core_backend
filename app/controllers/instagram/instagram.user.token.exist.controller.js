const { validationResult } = require("express-validator");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
const { instagramProfile, refreshLongLivedAccessToken } = require("../../services/INSTAGRAM");

const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { DATABASE_DIALECT } = require("../../constants/app_constants");

const isSQL = DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo';

const { instagramTokenExistByReferenceNo } = isSQL
    ? require("../user/instagram/get.pg.instagram.token.exist.by.reference.no")
    : require("../user/instagram/get.mongo.instagram.token.exist.by.reference.no");

const { saveInstagramUserToken, updateInstagramUserToken } = isSQL
    ? require("../user/instagram/store.pg.instagram.token")
    : require("../user/instagram/store.mongo.instagram.token");

const { calculateInstagramTokenExpiry } = isSQL
    ? require("../user/instagram/calculate.pg.instagram.token.expiry.date")
    : require("../user/instagram/calculate.mongo.instagram.token.expiry.date");

const { saveInstagramUserData, modifyInstagramUserData } = isSQL
    ? require("../user/instagram/store.pg.instagram.data")
    : require("../user/instagram/store.mongo.instagram.data");

const { getUserInstagramProfileByReferenceNo } = isSQL
    ? require("../user/instagram/get.pg.instagram.profile.by.reference.no")
    : require("../user/instagram/get.mongo.instagram.profile.by.reference.no");

const { deleteInstagramUserToken } = isSQL
    ? require("../user/instagram/delete.pg.instagram.token")
    : require("../user/instagram/delete.mongo.instagram.token");

const { deleteInstagramProfileData } = isSQL
    ? require("../user/instagram/delete.pg.instagram.profile.data")
    : require("../user/instagram/delete.mongo.instagram.profile.data");

const { getInstagramAccessTokenByReferenceNo } = isSQL
    ? require("../user/instagram/get.pg.instagram.access.token.by.reference.no")
    : require("../user/instagram/get.mongo.instagram.access.token.by.reference.no");

exports.InstagramTokenExist = async (req, res) => {
    const { email, reference_number } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    try {
        // EXTREME SPEED: Prepare all infrastructure and checks in parallel
        const [email_found, reference_number_found, tokenExist, client, accessToken, dateDifferenceInDays] = await Promise.all([
            findUserCountByEmail(email),
            findUserCountByReferenceNumber(reference_number),
            instagramTokenExistByReferenceNo(reference_number),
            connectToRedis(),
            getInstagramAccessTokenByReferenceNo(reference_number),
            calculateInstagramTokenExpiry(reference_number)
        ]);

        if (email_found === 0) {
            if (client) await closeRedisConnection(client);
            return res.status(404).json({ success: false, error: true, message: 'Email not found.' });
        }
        if (reference_number_found === 0) {
            if (client) await closeRedisConnection(client);
            return res.status(400).json({
                success: false,
                error: true,
                message: 'Reference number must be checked.'
            });
        }

        if (client) {
            if (accessToken) {
                await client.set(reference_number, accessToken);
            }
            if (dateDifferenceInDays) {
                const longLivedToken = await client.get(reference_number);
                if (longLivedToken) {
                    if (dateDifferenceInDays >= 40) {
                        await deleteInstagramUserToken(reference_number);
                        await deleteInstagramProfileData(reference_number);
                        return res.status(401).json({ success: false, error: true, message: "To continue using your Instagram account on Project W, please sign-in to Instagram." });
                    }
                    if (dateDifferenceInDays >= 20) {
                        const created_at = Date.now();
                        const newLongLivedToken = await refreshLongLivedAccessToken(longLivedToken);
                        if (!newLongLivedToken) {
                            return res.status(400).json({ success: false, error: true, message: "Failed to generate a new access token." });
                        }
                        const profile = await instagramProfile(newLongLivedToken);
                        if (!profile[0]) {
                            return res.status(400).json({ success: false, error: true, message: "Error fetching Instagram user profile." });
                        }
                        const { id, user_id, username, name, account_type, profile_picture_url, followers_count, follows_count, media_count } = profile[1];
                        const payload = { reference_number, id, user_id, username, name, account_type, profile_picture_url, followers_count, follows_count, media_count, created_at };
                        await modifyInstagramUserData(reference_number, payload);
                        await updateInstagramUserToken(reference_number, { reference_number: reference_number, access_token: longLivedToken, long_lived_token: newLongLivedToken, created_at: created_at });

                        client.set(reference_number, newLongLivedToken);
                    }
                    await instagramProfile(longLivedToken);
                }
            }
        }

        await closeRedisConnection(client);

        if (tokenExist > 0) {
            res.status(200).json({
                success: true,
                error: false,
                token_exist: tokenExist,
                message: 'Token has been found'
            });
            return;
        }
        res.status(404).json({
            success: false,
            error: true,
            token_exist: 0,
            message: 'Token not found'
        });
    } catch (error) {
        const error_response = error?.message || error?.response || error?.response?.data || 'Something wrong has happened'
        res.status(500).json({
            success: false,
            error: true,
            message: `${error_response}`
        });
    }
};

