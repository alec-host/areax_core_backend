/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication, Sign Up, Sign In, Sign Out
 */
/**
 * @swagger
 * /signUp:
 *   post:
 *     summary: Manual sign up
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               referral_code:
 *                 type: string
 *               device_fingerprint:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up successfully
 */
/**
 * @swagger
 * /googleSignUp:
 *   post:
 *     summary: Google sign up
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *               referral_code:
 *                 type: string
 *               device_fingerprint:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed up via Google
 */
/**
 * @swagger
 * /googleSignIn:
 *   post:
 *     summary: Google sign in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in via Google
 */
/**
 * @swagger
 * /signIn:
 *   post:
 *     summary: Manual sign in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in
 */
/**
 * @swagger
 * /signOut:
 *   post:
 *     summary: Sign out
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed out
 */
/**
 * @swagger
 * /signedInStatus:
 *   post:
 *     summary: Check signed in status
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               reference_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Signed in status (1 or 0)
 */
/**
 * @swagger
 * /refreshAccessToken:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               reference_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: New tokens generated
 */
/**
 * @swagger
 * /rotateRefreshToken:
 *   post:
 *     summary: Rotate refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               reference_number:
 *                 type: string
 *               old_refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token rotated
 */
/**
 * @swagger
 * /changePassword:
 *   post:
 *     summary: Change password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               reference_number:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 */
/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     summary: Reset forgotten password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               reference_number:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: "(Note: Requires prior OTP validation usually) Password reset"
 */
/**
 * @swagger
 * /deleteUserAccount:
 *   post:
 *     summary: Delete user account
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               reference_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: User purged
 */
/**
 * @swagger
 * /testUserAuthentication:
 *   post:
 *     summary: Test user authentication
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auth check result
 */
