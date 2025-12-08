/**
 * @swagger
 * tags:
 *   name: OTP
 *   description: One Time Password management
 */
/**
 * @swagger
 * /confirmEmail:
 *   post:
 *     summary: Confirm Email with OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *               otp: { type: string }
 *     responses:
 *       200:
 *         description: Email confirmed
 */
/**
 * @swagger
 * /confirmWhatsAppPhoneNumber:
 *   post:
 *     summary: Confirm WhatsApp Phone Number with OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string }
 *               reference_number: { type: string }
 *               otp: { type: string }
 *     responses:
 *       200:
 *         description: WhatsApp Phone confirmed
 */
/**
 * @swagger
 * /requestEmailOtp:
 *   post:
 *     summary: Request Email OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: OTP sent to email
 */
/**
 * @swagger
 * /requestWhatsAppOtp:
 *   post:
 *     summary: Request WhatsApp OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string }
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: OTP sent to WhatsApp
 */
/**
 * @swagger
 * /forgotPasswordEmailOtp:
 *   post:
 *     summary: Request Forgot Password OTP
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: OTP sent
 */
