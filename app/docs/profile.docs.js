/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User Profile Management
 */
/**
 * @swagger
 * /updateUserProfile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Profile]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *               phone: { type: string }
 *               country_code: { type: string }
 *               country: { type: string }
 *               city: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */
/**
 * @swagger
 * /uploadUserProfilePicture:
 *   post:
 *     summary: Upload profile picture
 *     tags: [Profile]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image: { type: string, format: binary }
 *               email: { type: string }
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: Profile picture uploaded
 */
/**
 * @swagger
 * /uploadGuardian:
 *   post:
 *     summary: Upload Spirit Animal / Guardian picture
 *     tags: [Profile]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image: { type: string, format: binary }
 *               email: { type: string }
 *               reference_number: { type: string }
 *               gaurdian_name: { type: string }
 *     responses:
 *       200:
 *         description: Guardian uploaded
 */
/**
 * @swagger
 * /uploadWallpaper:
 *   post:
 *     summary: Upload Wallpaper picture
 *     tags: [Profile]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image: { type: string, format: binary }
 *               email: { type: string }
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: Wallpaper uploaded
 */
/**
 * @swagger
 * /getUserProfile:
 *   get:
 *     summary: Get User Profile
 *     tags: [Profile]
 *     parameters:
 *       - in: query
 *         name: email
 *       - in: query
 *         name: reference_number
 *     responses:
 *       200:
 *         description: User profile details
 */
/**
 * @swagger
 * /addPhoneNumber:
 *   post:
 *     summary: Add phone number to profile
 *     tags: [Profile]
 *     requestBody:
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
 *         description: Phone added
 */
/**
 * @swagger
 * /verifyPhoneNumber:
 *   post:
 *     summary: Verify phone number
 *     tags: [Profile]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: string }
 *               email: { type: string }
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: Phone verified
 */
/**
 * @swagger
 * /privacyStatus:
 *   post:
 *     summary: Change profile privacy status
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Privacy status updated
 */
/**
 * @swagger
 * /updateUserLocation:
 *   post:
 *     summary: Update User Location
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Location updated
 */
/**
 * @swagger
 * /getUsersLocation:
 *   get:
 *     summary: Get Users Location
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Locations retrieved
 */
/**
 * @swagger
 * /uploadImage:
 *   post:
 *     summary: Generic Image Upload
 *     tags: [Profile]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images: { type: array, items: { type: string, format: binary } }
 *               email: { type: string }
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: Images uploaded
 */
/**
 * @swagger
 * /uploadToBucket:
 *   post:
 *     summary: Upload file to S3 Bucket
 *     tags: [Profile]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *               filename: { type: string }
 *               filetype: { type: string }
 *     responses:
 *       200:
 *         description: File uploaded
 */

