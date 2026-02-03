const { validationResult } = require("express-validator");
const { DATABASE_DIALECT } = require("../../constants/app_constants");
const { getInstagramToken, instagramMedia } = require("../../services/INSTAGRAM");
const { getLatestUserInstagramActivityLog } = require("../user/get.user.instagram.activity.log");
const { deleteUserInstagramActivityLog } = require("../user/instagram/delete.user.instagram.activity.log");

const idService = (DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo')
    ? require("../user/instagram/get.pg.instagram.id.by.reference.no")
    : require("../user/instagram/get.mongo.instagram.id.by.reference.no");

exports.GetInstagramMedia = async (req, res) => {
    const code = req.query.code;
    const error = req.query.error;
    const error_reason = req.query.error_reason;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    if (error && error_reason === 'user_denied') {
        res.status(403).send({
            success: false,
            error: true,
            message: 'Access denied. Please try again later.'
        });
        return;
    }

    try {
        // EXTREME SPEED: Overlap IG token exchange and activity log retrieval
        const [tokenResponse, reference_number] = await Promise.all([
            getInstagramToken(code, "authorize_media"),
            getLatestUserInstagramActivityLog()
        ]);

        if (!tokenResponse[0]) {
            res.status(400).json({
                success: false,
                error: true,
                message: tokenResponse[1]
            });
            return;
        }

        if (reference_number && reference_number?.length > 0) {
            // Both PG and Mongo versions of getInstagramIdByReferenceNo return the ID string directly
            const userInstagramID = await idService.getInstagramIdByReferenceNo(reference_number);

            if (!userInstagramID) {
                res.status(404).json({ success: false, error: true, message: "Instagram ID not found for this reference." });
                return;
            }

            const media = await instagramMedia(userInstagramID, tokenResponse[1]);

            // EXTREME SPEED: Fire cleanup in background
            deleteUserInstagramActivityLog(reference_number, "authorize_media").catch(e => console.error("Activity Log Cleanup Error:", e));

            res.status(200).json({
                success: true,
                error: false,
                data: media[1],
                message: 'Media information'
            });
            return;
        }
        res.status(404).json({
            success: false,
            error: true,
            message: "Reference number not found."
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: true,
            message: e?.message || 'Something wrong has happened'
        });
    }
};

