/**
 * @swagger
 * tags:
 *   name: Social
 *   description: Instagram and TikTok Integrations
 */
/**
 * @swagger
 * /auth/instagram:
 *   post:
 *     summary: Authorize Instagram
 *     tags: [Social]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *               client_type: { type: string }
 *     responses:
 *       200:
 *         description: Instagram authorized
 */
/**
 * @swagger
 * /auth/instagram/callback:
 *   get:
 *     summary: Instagram Auth Callback
 *     tags: [Social]
 *     parameters:
 *       - in: query 
 *         name: code
 *       - in: query 
 *         name: status
 *     responses:
 *       200:
 *         description: Callback processed
 */
/**
 * @swagger
 * /revoke/instagram:
 *   post:
 *     summary: Revoke Instagram Access
 *     tags: [Social]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: Access revoked
 */
/**
 * @swagger
 * /media/instagram/callback:
 *   get:
 *     summary: Get Instagram Media (Callback)
 *     tags: [Social]
 *     responses:
 *       200:
 *         description: Media retrieved
 */
/**
 * @swagger
 * /deauthorize/instagram:
 *   post:
 *     summary: Deauthorize Instagram App
 *     tags: [Social]
 *     responses:
 *       200:
 *         description: Deauthorized
 */
/**
 * @swagger
 * /delete/instagram:
 *   post:
 *     summary: Delete Instagram App Data
 *     tags: [Social]
 *     responses:
 *       200:
 *         description: Data deleted
 */
/**
 * @swagger
 * /instagramUserId:
 *   get:
 *     summary: Get Instagram User ID
 *     tags: [Social]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: User ID
 */
/**
 * @swagger
 * /instagramProfileStats:
 *   get:
 *     summary: Get Instagram Profile Stats
 *     tags: [Social]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: Profile stats
 */
/**
 * @swagger
 * /instagramTokenExist:
 *   post:
 *     summary: Check if Instagram Token Exists
 *     tags: [Social]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: Token status
 */
/**
 * @swagger
 * /instagramMediaRecord:
 *   get:
 *     summary: Get Instagram Media Record
 *     tags: [Social]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: Media records
 */
/**
 * @swagger
 * /getInstagramBasicInfo:
 *   get:
 *     summary: Get Instagram Basic Info
 *     tags: [Social]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: Basic info
 */
/**
 * @swagger
 * /auth/tiktok:
 *   post:
 *     summary: Authorize TikTok
 *     tags: [Social]
 *     responses:
 *       200:
 *         description: TikTok authorized
 */
/**
 * @swagger
 * /auth/tiktok/callback:
 *   post:
 *     summary: TikTok Auth Callback
 *     tags: [Social]
 *     responses:
 *       200:
 *         description: Access token generated
 */
/**
 * @swagger
 * /tiktokUserProfile:
 *   get:
 *     summary: Get TikTok User Profile
 *     tags: [Social]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: Profile details
 */
/**
 * @swagger
 * /tiktokToken:
 *   get:
 *     summary: Get TikTok Token
 *     tags: [Social]
 *     parameters:
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: Token
 */
/**
 * @swagger
 * /revoke/tiktok:
 *   post:
 *     summary: Revoke TikTok Access
 *     tags: [Social]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: Revoked
 */
/**
 * @swagger
 * /tiktokMediaRecord:
 *   get:
 *     summary: Get TikTok Media Record
 *     tags: [Social]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: Media records
 */
/**
 * @swagger
 * /tiktokTokenExist:
 *   post:
 *     summary: Check if TikTok Token Exists
 *     tags: [Social]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: Token status
 */
