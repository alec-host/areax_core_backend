const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { modifyUserByEmail } = require("../user/modify.user.by.email");

exports.SignOut = async (req, res) => {
    const { email } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }
    try {
        // EXTREME SPEED: Trigger existence check and signout update in parallel
        const [email_found, signout] = await Promise.all([
            findUserCountByEmail(email),
            modifyUserByEmail(email, { is_online: 0 })
        ]);

        if (email_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: "Email not found."
            });
            return;
        }

        if (signout) {
            res.status(200).json({
                success: true,
                error: false,
                message: 'Sign out was successful.'
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            error: true,
            message: e?.response?.message || e?.message || 'Something wrong has happened'
        });
    }
};

