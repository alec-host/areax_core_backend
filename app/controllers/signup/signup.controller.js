const { v4: uuidv4 } = require('uuid');
const { findUserCountByEmail } = require('../user/find.user.count.by.email');
const { sendGridEmailOtp } = require('../../services/NODEMAILER');
const { saveMailOtp } = require('../otp/save.mail.otp');

const { generateRandomOtp } = require('../../utils/generate.otp');
const { accessToken, refreshToken } = require('../../services/JWT');
const { encrypt } = require('../../services/CRYPTO');
const { validateEmail } = require('../../validation/validate.email');
const { createUser } = require('../user/create.user');
const { validationResult } = require('express-validator');

exports.UserSignUp = async (req, res) => {
    const { username, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        // EXTREME SPEED: Run validation, encryption, and existence check in parallel
        const [isEmailValid, hashedPassword, found_email] = await Promise.all([
            validateEmail(email),
            encrypt(password),
            findUserCountByEmail(email)
        ]);

        if (!isEmailValid) {
            res.status(400).json({ success: false, error: true, message: 'Invalid email.' });
            return;
        }

        if (found_email !== 0) {
            res.status(200).json({ success: false, error: true, message: 'Email already exists' });
            return;
        }

        const google_user_id = 0;
        const reference_number = 'AXR_' + uuidv4();
        const profile_picture_url = null;
        const access_token = accessToken({ email: email });
        const refresh_token = refreshToken({ email: email });
        const newUser = { reference_number, google_user_id, username, email, profile_picture_url, access_token, refresh_token, password: hashedPassword };

        const otpCode = generateRandomOtp();
        const response = await sendGridEmailOtp(email, otpCode);

        if (response[0]) {
            // EXTREME SPEED: Save OTP and create user in parallel
            const [otpSave, createResp] = await Promise.all([
                saveMailOtp({ phone: 0, email: email, message: response[2] }),
                createUser(newUser)
            ]);

            if (createResp[0]) {
                const createdUser = createResp[2];
                // Format user data to array for consistency
                const profileData = [createdUser.toJSON ? createdUser.toJSON() : createdUser];

                res.status(201).json({
                    success: true,
                    error: false,
                    data: profileData,
                    access_token: access_token,
                    refresh_token: reference_number,
                    message: createResp[1]
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: true,
                    message: createResp[1]
                });
            }
        } else {
            res.status(400).json({
                success: false,
                error: true,
                message: response[1] || 'Invalid token'
            });
        }
    } catch (e) {
        console.error('UserSignUp Error:', e);
        res.status(400).json({
            success: false,
            error: true,
            message: "Something wrong has happened."
        });
    }
};
