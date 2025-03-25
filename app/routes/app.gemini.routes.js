const auth = require("../middleware/auth");
const uploadFile = require('../middleware/upload.storage');
const instagramCaptionController = require('../controllers/chat-gemini/gemini.ig.caption.controller');

const error = require("./error/error.routes");
const errorTimeOut = require("./error/error.timeout.routes");
const { formDataValidator } = require("../validation/common.validation");

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
     *   /api/chat-gemini/v1/captionGenerator:
     *     post:
     *       summary: Upload an image.
     *       responses:
     *         200:
     *           description: Generate IG captions.            
    */
    router.post('/captionGenerator',auth,uploadFile.single('image'),formDataValidator,instagramCaptionController.GeminiInstagramCaptionGenerator);

    app.use("/api/chat-gemini/v1",router);
    app.use(error.errorHandler);
    app.use(errorTimeOut.errorTimeOutHandler);
};
