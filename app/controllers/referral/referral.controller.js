const { validationResult } = require('express-validator');
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { findUserByEmailAndRef } = require("../user/find.user.by.email.and.ref");
const { countActiveReferralInvites } = require("../user/referral.count.active");
const { createReferralInvite } = require("../user/referral.create");
const { findReferralByCode } = require("../user/referral.find.by.code");
const { updateReferralStatusById } = require("../user/referral.update.status");
const { getReferralInvitesByReferrerId } = require("../user/referral.get.list");
const { getReferralSummaryByReferrerId } = require("../user/referral.get.summary.js");
const { getInviteeDetailsByCode } = require("../user/referral.get.invitee");
const { getAllReferrals } = require("../user/referral.get.all");
const { findActiveInviteByContact } = require("../user/referral.find.active.by.contact");
const { generateReferralCode } = require("../../utils/generate.referral.code");
const { processUserReferral } = require("../user/process.referral.code");
const { isValidGmail } = require("../../utils/is.valid.gmail");
const { db } = require("../../models");

module.exports.GenerateReferralCode = async (req, res) => {
    const { email, reference_number, invitee_name, invitee_email, invitee_mobile_number } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }

    // 1. Mandatory User Existence Checks - Optimized happy path
    let user = await findUserByEmailAndRef(email, reference_number);
    if (!user) {
        const email_found = await findUserCountByEmail(email);
        if (email_found === 0) {
            return res.status(404).json({ success: false, error: true, message: "Email not found." });
        }
        const reference_number_found = await findUserCountByReferenceNumber(reference_number);
        if (reference_number_found === 0) {
            return res.status(404).json({ success: false, error: true, message: "Reference number not found." });
        }
        return res.status(404).json({ success: false, error: true, message: "User not found with provided email and reference number." });
    }

    const transaction = await db.sequelize.transaction();
    try {
        // 2. Parallelize active invite checks
        const [existingInvite, activeInvites] = await Promise.all([
            findActiveInviteByContact(invitee_email, invitee_mobile_number, transaction),
            countActiveReferralInvites(user._id, transaction)
        ]);

        if (existingInvite) {
            await transaction.rollback();
            const isSameReferrer = existingInvite.referrer_reference_number === user.reference_number;
            return res.status(400).json({
                success: false,
                error: true,
                message: isSameReferrer
                    ? "You’ve already sent an active invite to this contact."
                    : "This contact has already been invited by another user."
            });
        }

        if (activeInvites >= 5) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                error: true,
                message: "You’ve reached your referral limit. Only 5 active invites are allowed."
            });
        }

        // 3. Generate unique referral code
        let unique = false;
        let code = '';
        while (!unique) {
            code = generateReferralCode();
            const exist = await findReferralByCode(code, transaction);
            if (!exist) unique = true;
        }

        // 4. Create unique referral record
        await createReferralInvite({
            referrer_id: user._id,
            referrer_reference_number: user.reference_number,
            referral_code: code,
            invitee_name: invitee_name || null,
            invitee_email: invitee_email || null,
            invitee_mobile_number: invitee_mobile_number || null,
            status: 'invited'
        }, transaction);

        await transaction.commit();

        res.json({
            success: true,
            error: false,
            referral_code: code,
            message: 'Your referral code has been successfully generated.'
        });
    } catch (e) {
        await transaction.rollback();
        res.status(500).json({ success: false, error: true, message: e?.message || 'Something wrong has happened' });
    }
};

module.exports.WithdrawInvite = async (req, res) => {
    const { email, reference_number, referral_code } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }

    // 1. Mandatory User Existence Checks - Optimized happy path
    const user = await findUserByEmailAndRef(email, reference_number);
    if (!user) {
        const email_found = await findUserCountByEmail(email);
        if (email_found === 0) {
            return res.status(404).json({ success: false, error: true, message: "Email not found." });
        }
        const reference_number_found = await findUserCountByReferenceNumber(reference_number);
        if (reference_number_found === 0) {
            return res.status(404).json({ success: false, error: true, message: "Reference number not found." });
        }
        return res.status(404).json({ success: false, error: true, message: "User not found with provided email and reference number." });
    }

    const transaction = await db.sequelize.transaction();
    try {
        const referral = await findReferralByCode(referral_code, transaction);

        if (!referral || referral.referrer_id !== user._id) {
            await transaction.rollback();
            return res.status(404).json({ success: false, error: true, message: "Invite not found." });
        }

        if (referral.status === 'withdrawn') {
            await transaction.rollback();
            return res.status(400).json({ success: false, error: true, message: "Invite is already withdrawn." });
        }

        await updateReferralStatusById(referral._id, 'withdrawn', transaction);

        await transaction.commit();
        res.json({ success: true, error: false, message: "Invite has been withdrawn." });
    } catch (e) {
        await transaction.rollback();
        res.status(500).json({ success: false, error: true, message: e?.message || 'Something wrong has happened' });
    }
};

module.exports.GetUserInvites = async (req, res) => {
    const { email, reference_number } = req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }

    try {
        // 1. Mandatory User Existence Checks - Optimized happy path
        const user = await findUserByEmailAndRef(email, reference_number);
        if (!user) {
            const email_found = await findUserCountByEmail(email);
            if (email_found === 0) {
                return res.status(404).json({ success: false, error: true, message: "Email not found." });
            }
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if (reference_number_found === 0) {
                return res.status(404).json({ success: false, error: true, message: "Reference number not found." });
            }
            return res.status(404).json({ success: false, error: true, message: "User not found with provided email and reference number." });
        }
        const invites = await getReferralInvitesByReferrerId(user._id);

        res.json({
            success: true,
            error: false,
            data: invites
        });
    } catch (e) {
        res.status(500).json({ success: false, error: true, message: e?.message || 'Something wrong has happened' });
    }
};

module.exports.TrackAppDownload = async (req, res) => {
    const { referral_code } = req.body;
    if (!referral_code) {
        return res.status(400).json({ success: false, error: true, message: "Referral code is required." });
    }

    try {
        const referral = await findReferralByCode(referral_code);
        if (!referral) {
            return res.status(404).json({ success: false, error: true, message: "Invalid referral code." });
        }

        if (referral.status === 'invited') {
            await updateReferralStatusById(referral._id, 'downloaded');
        }

        res.json({ success: true, error: false, message: "App download tracked." });
    } catch (e) {
        res.status(500).json({ success: false, error: true, message: e?.message || 'Something wrong has happened' });
    }
};

module.exports.ProcessReferralCode = async (req, res) => {
    const { email, reference_number, referral_code, device_fingerprint } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }

    try {
        // 1. Mandatory User Existence Checks - Optimized happy path
        const user = await findUserByEmailAndRef(email, reference_number);
        if (!user) {
            const email_found = await findUserCountByEmail(email);
            if (email_found === 0) {
                return res.status(404).json({ success: false, error: true, message: "Email not found." });
            }
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if (reference_number_found === 0) {
                return res.status(404).json({ success: false, error: true, message: "Reference number not found." });
            }
            return res.status(404).json({ success: false, error: true, message: "User not found with provided email and reference number." });
        }

        const [ok, response] = await processUserReferral({ email, reference_number, referral_code, device_fingerprint });
        if (!ok) return res.status(400).json({ success: false, error: true, message: response });
        res.status(200).json({ success: true, error: false, message: response });
    } catch (e) {
        res.status(500).json({ success: false, error: true, message: e?.message || 'Something wrong has happened' });
    }
};

module.exports.ShowReferralCodeOnGoogleSignUp = async (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }
    try {
        const isEmailValid = isValidGmail(email);
        if (!isEmailValid) return res.status(400).json({ success: false, error: true, message: "Not a valid gmail." });

        const email_found = await findUserCountByEmail(email);
        res.status(200).json({
            success: true,
            error: false,
            email_exist: email_found === 1,
            message: email_found === 1 ? "Email already exists." : "Email does not exist."
        });
    } catch (e) {
        res.status(500).json({ success: false, error: true, message: e?.message || 'Something wrong has happened' });
    }
};

module.exports.GetReferralSummary = async (req, res) => {
    const { email, reference_number } = req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }

    try {
        // 1. Mandatory User Existence Checks - Optimized happy path
        const user = await findUserByEmailAndRef(email, reference_number);
        if (!user) {
            const email_found = await findUserCountByEmail(email);
            if (email_found === 0) {
                return res.status(404).json({ success: false, error: true, message: "Email not found." });
            }
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if (reference_number_found === 0) {
                return res.status(404).json({ success: false, error: true, message: "Reference number not found." });
            }
            return res.status(404).json({ success: false, error: true, message: "User not found with provided email and reference number." });
        }

        const summary = await getReferralSummaryByReferrerId(user._id);

        res.json({
            success: true,
            error: false,
            data: summary
        });
    } catch (e) {
        res.status(500).json({ success: false, error: true, message: e?.message || 'Something wrong has happened' });
    }
};


module.exports.GetInviteeByCode = async (req, res) => {
    const { code } = req.params;
    const { email, reference_number } = req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: true, message: errors.array() });
    }

    try {
        // 1. Mandatory User Existence Checks - Optimized happy path
        const user = await findUserByEmailAndRef(email, reference_number);
        if (!user) {
            const email_found = await findUserCountByEmail(email);
            if (email_found === 0) {
                return res.status(404).json({ success: false, error: true, message: "Email not found." });
            }
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if (reference_number_found === 0) {
                return res.status(404).json({ success: false, error: true, message: "Reference number not found." });
            }
            return res.status(404).json({ success: false, error: true, message: "User not found with provided email and reference number." });
        }

        const result = await getInviteeDetailsByCode(code);
        if (!result) {
            return res.status(404).json({ success: false, error: true, message: "Invalid referral code." });
        }

        const { referral, user_record } = result;

        res.json({
            success: true,
            error: false,
            data: {
                invitee_name: referral.invitee_name,
                invitee_email: referral.invitee_email,
                invitee_mobile_number: referral.invitee_mobile_number,
                status: referral.status,
                user_details: user_record
            }
        });
    } catch (e) {
        res.status(500).json({ success: false, error: true, message: e?.message || 'Something wrong has happened' });
    }
};

module.exports.GetAllReferralsAdmin = async (req, res) => {
    const { page, limit } = req.query;

    try {
        const data = await getAllReferrals(page, limit);

        res.json({
            success: true,
            error: false,
            data: data,
            message: "Referral list retrieved successfully."
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: true,
            message: e?.message || 'Something wrong has happened'
        });
    }
};

