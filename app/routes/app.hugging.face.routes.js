const auth = require("../middleware/auth");

const huggingFaceController = require('../controllers/chat-hugging-face/hugging-face.controller');

const error = require("./error/error.routes");
const errorTimeOut = require("./error/error.timeout.routes");
const { huggingFaceChatValidator } = require("../validation/common.validation");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
*/
module.exports = async(app) => {
    const router = require("express").Router();
    /**
     * @swagger
     * paths:
     *   /api/chat/v1/huggingFaceChat:
     *     post:
     *       summary: chat.
     *       responses:
     *         200:
     *           description: Initiates conversation.            
     */
    router.post('/huggingFaceChat',huggingFaceChatValidator,huggingFaceController.ChatHuggingFace);

    app.use("/api/chat/v1",router);
    app.use(error.errorHandler);
    app.use(errorTimeOut.errorTimeOutHandler);	
};
