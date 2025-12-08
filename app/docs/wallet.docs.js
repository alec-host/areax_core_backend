/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Blockchain and Wallet Operations
 */
/**
 * @swagger
 * /createBlockchainWallet:
 *   post:
 *     summary: Create Blockchain Wallet
 *     tags: [Wallet]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *               wallet_address: { type: string }
 *               private_key: { type: string }
 *     responses:
 *       200:
 *         description: Wallet created
 */
/**
 * @swagger
 * /addBlockchainTokenId:
 *   post:
 *     summary: Add Blockchain Token ID
 *     tags: [Wallet]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *               token_id: { type: string }
 *     responses:
 *       200:
 *         description: Token ID added
 */
/**
 * @swagger
 * /getBlockchainTokenId:
 *   get:
 *     summary: Get Blockchain Token ID
 *     tags: [Wallet]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: Token ID retrieved
 */
/**
 * @swagger
 * /getWalletDetails:
 *   get:
 *     summary: Get Wallet Details
 *     tags: [Wallet]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *     responses:
 *       200:
 *         description: Wallet details
 */
/**
 * @swagger
 * /getWalletTransactions:
 *   get:
 *     summary: Get Wallet Transactions
 *     tags: [Wallet]
 *     parameters:
 *       - in: query 
 *         name: email
 *       - in: query 
 *         name: reference_number
 *       - in: query 
 *         name: page
 *       - in: query 
 *         name: limit
 *     responses:
 *       200:
 *         description: Transactions list
 */
/**
 * @swagger
 * /depositPoints:
 *   post:
 *     summary: Deposit Points
 *     tags: [Wallet]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               reference_number: { type: string }
 *               amount: { type: string }
 *     responses:
 *       200:
 *         description: Points deposited
 */
/**
 * @swagger
 * /withdrawPoints:
 *   post:
 *     summary: Withdraw Points
 *     tags: [Wallet]
 *     responses:
 *       200:
 *         description: Points withdrawn
 */
