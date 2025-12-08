/**
 * @swagger
 * tags:
 *   name: Misc
 *   description: Miscellaneous operations (Health, Logs, Tiers, Referral)
 */
/**
 * @swagger
 * /ping:
 *   post:
 *     summary: Health Check
 *     tags: [Misc]
 *     responses:
 *       200:
 *         description: Pong
 */
/**
 * @swagger
 * /logSystemError:
 *   post:
 *     summary: Log System Error
 *     tags: [Misc]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Error logged
 */
/**
 * @swagger
 * /logUserActivity:
 *   post:
 *     summary: Log User Activity
 *     tags: [Misc]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Activity logged
 */
/**
 * @swagger
 * /userLogs:
 *   get:
 *     summary: Get Logs
 *     tags: [Misc]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *       - in: query 
 *         name: search
 *     responses:
 *       200:
 *         description: Logs retrieved
 */
/**
 * @swagger
 * /createSubscriptionTier:
 *   post:
 *     summary: Create Subscription Tier
 *     tags: [Misc]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference_number: { type: string }
 *               name: { type: string }
 *     responses:
 *       200:
 *         description: Tier created
 */
/**
 * @swagger
 * /updateSubscriptionTier:
 *   patch:
 *     summary: Update Subscription Tier
 *     tags: [Misc]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference_number: { type: string }
 *     responses:
 *       200:
 *         description: Tier updated
 */
/**
 * @swagger
 * /getSubscriptionTier:
 *   get:
 *     summary: Get Subscription Tiers
 *     tags: [Misc]
 *     responses:
 *       200:
 *         description: List of tiers
 */
/**
 * @swagger
 * /deleteSubscriptionTier/{reference_number}:
 *   delete:
 *     summary: Soft Delete Subscription Tier
 *     tags: [Misc]
 *     parameters:
 *       - in: path
 *         name: reference_number
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tier deleted
 */
/**
 * @swagger
 * /addSubscriptionPlan:
 *   patch:
 *     summary: Add/Modify Subscription Plan
 *     tags: [Misc]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference_number: { type: string }
 *               tier_reference_number: { type: string }
 *     responses:
 *       200:
 *         description: Plan updated
 */
/**
 * @swagger
 * /getSubscriptionPlanList:
 *   get:
 *     summary: Get Subscription Plan List
 *     tags: [Misc]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: List of plans
 */
/**
 * @swagger
 * /getSubscriptionPlan:
 *   post:
 *     summary: Get Subscription Plan Details
 *     tags: [Misc]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference_number: { type: string }
 *               name: { type: string }
 *               tier_reference_number: { type: string }
 *               payment_plan: { type: string, enum: [y, m] }
 *     responses:
 *       200:
 *         description: Plan details
 */
/**
 * @swagger
 * /getMqMessage:
 *   get:
 *     summary: Get Message from RabbitMQ
 *     tags: [Misc]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: Message retrieved
 */
/**
 * @swagger
 * /getReferralCode:
 *   get:
 *     summary: Generate Referral Code
 *     tags: [Misc]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: Referral code
 */
/**
 * @swagger
 * /processReferralCode:
 *   post:
 *     summary: Process Referral Code
 *     tags: [Misc]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *               referral_code: { type: string }
 *               device_fingerprint: { type: string }
 *     responses:
 *       200:
 *         description: Referral processed
 */
/**
 * @swagger
 * /gmailExist:
 *   post:
 *     summary: Check Gmail Existence (Referral)
 *     tags: [Misc]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Check result
 */
