const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { instagramProfile, refreshLongLivedAccessToken } = require("../../services/INSTAGRAM");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
const { DATABASE_DIALECT } = require('../../constants/app_constants');

const isSQL = DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo';

const calculateService = isSQL
    ? require("../user/instagram/calculate.pg.instagram.token.expiry.date")
    : require("../user/instagram/calculate.mongo.instagram.token.expiry.date");

const dataService = isSQL
    ? require("../user/instagram/store.pg.instagram.data")
    : require("../user/instagram/store.mongo.instagram.data");

const tokenService = isSQL
    ? require("../user/instagram/store.pg.instagram.token")
    : require("../user/instagram/store.mongo.instagram.token");

const profileService = isSQL
    ? require("../user/instagram/get.pg.instagram.profile.by.reference.no")
    : require("../user/instagram/get.mongo.instagram.profile.by.reference.no");

const tokenDeleteService = isSQL
    ? require("../user/instagram/delete.pg.instagram.token")
    : require("../user/instagram/delete.mongo.instagram.token");

const profileDeleteService = isSQL
    ? require("../user/instagram/delete.pg.instagram.profile.data")
    : require("../user/instagram/delete.mongo.instagram.profile.data");

exports.GetInstagramBasicInfo = async (req, res) => {
    const errors = validationResult(req);
    const email = req.query.email;
    const reference_number = req.query.reference_number;

    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    try {
        // EXTREME SPEED: Overlap existence checks and Redis connection
        const [email_found, reference_number_found, client] = await Promise.all([
            findUserCountByEmail(email),
            findUserCountByReferenceNumber(reference_number),
            connectToRedis()
        ]);

        if (email_found === 0) {
            if (client) await closeRedisConnection(client);
            res.status(404).json({
                success: false,
                error: true,
                message: "Email not found."
            });
            return;
        }
        if (reference_number_found === 0) {
            if (client) await closeRedisConnection(client);
            res.status(404).json({
                success: false,
                error: true,
                message: "Reference number not found."
            });
            return;
        }

        if (client) {
            // EXTREME SPEED: Parallelize token expiry check and Redis retrieval
            const [dateDifferenceInDays, longLivedToken] = await Promise.all([
                calculateService.calculateInstagramTokenExpiry(reference_number),
                client.get(reference_number)
            ]);

            if (dateDifferenceInDays === null) {
                await closeRedisConnection(client);
                res.status(401).json({
                    success: false,
                    error: true,
                    message: "To continue using your Instagram account on Project W, please sign-in to Instagram."
                });
                return;
            }

            if (longLivedToken) {
                if (dateDifferenceInDays >= 40) {
                    await Promise.all([
                        tokenDeleteService.deleteInstagramUserToken(reference_number),
                        profileDeleteService.deleteInstagramProfileData(reference_number)
                    ]);
                    await closeRedisConnection(client);
                    res.status(401).json({
                        success: false,
                        error: true,
                        message: "To continue using your Instagram account on Project W, please sign-in to Instagram."
                    });
                    return;
                }
                if (dateDifferenceInDays >= 20) {
                    const created_at = Date.now();
                    const newLongLivedToken = await refreshLongLivedAccessToken(longLivedToken);
                    const profile = await instagramProfile(newLongLivedToken);
                    const { id, user_id, username, name, account_type, profile_picture_url, followers_count, follows_count, media_count } = profile[1];
                    const payload = { reference_number, id, user_id, username, name, account_type, profile_picture_url, followers_count, follows_count, media_count, created_at };

                    await Promise.all([
                        dataService.modifyInstagramUserData(reference_number, payload),
                        tokenService.updateInstagramUserToken(reference_number, { reference_number: reference_number, access_token: longLivedToken, long_lived_token: newLongLivedToken, created_at: created_at }),
                        client.set(reference_number, newLongLivedToken)
                    ]);

                    await closeRedisConnection(client);
                    // Continue to fetch basic info below
                } else {
                    await instagramProfile(longLivedToken);
                    await closeRedisConnection(client);
                }
            } else {
                await closeRedisConnection(client);
            }
        }

        const instagramBasicInfo = await profileService.getUserInstagramProfileByReferenceNo(reference_number);
        if (instagramBasicInfo === null) {
            res.status(404).json({
                success: false,
                error: true,
                data: [],
                message: "To proceed allow Project W-IG App to access your data."
            });
            return;
        }
        res.status(200).json({
            success: true,
            error: false,
            data: instagramBasicInfo,
            message: "Instagram basic business information."
        });
    } catch (e) {
        const error_msg = e?.message || e?.response?.message || 'Something wrong has happened';
        res.status(500).json({
            success: false,
            error: true,
            message: `ERROR: ${error_msg}`
        });
    }
};

