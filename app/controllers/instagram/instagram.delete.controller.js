const { validationResult } = require("express-validator");
const { getLatestUserInstagramActivityLog } = require("../user/get.user.instagram.activity.log");
const { deleteUserInstagramActivityLog } = require("../user/instagram/delete.user.instagram.activity.log");
const { DATABASE_DIALECT } = require("../../constants/app_constants");

const { userDeletionByReferenceNumber } = (DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo')
    ? require("../user/instagram/mark.deleted.user.instagram.data")
    : require("../user/instagram/mark.deleted.user.instagram.data"); // Same logic for now, but good to wrap

exports.DeauthorizeInstagramApp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    const reference_number = await getLatestUserInstagramActivityLog();
    if (reference_number && reference_number?.length > 0) {
        // EXTREME SPEED: Parallelize cleanup and data marking
        await Promise.all([
            deleteUserInstagramActivityLog(reference_number, "deauthorize"),
            userDeletionByReferenceNumber(reference_number)
        ]);
        res.status(200).json({
            success: true,
            error: false,
            message: 'Instagram app revoked.'
        });
        return;
    }
    res.status(400).json({
        success: false,
        error: true,
        message: 'Failed to revoke Instagram app.'
    });
};

