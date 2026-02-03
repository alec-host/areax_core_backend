const { validationResult } = require("express-validator");

const { DATABASE_DIALECT } = require("../../constants/app_constants");
const { Op } = require("sequelize");

const logService = (DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo')
    ? require('../user/combine.error.activity.log.pg')
    : require('../user/combine.error.activity.log');

module.exports.CombinedActivityErrorLogs = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let searchCriteria;
            const isSQL = DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo';

            if (isSQL) {
                const searchOp = (DATABASE_DIALECT === 'postgres') ? Op.iLike : Op.like;
                searchCriteria = search && search.trim()
                    ? {
                        [Op.or]: [
                            { reference_number: { [searchOp]: `%${search}%` } },
                            { email: { [searchOp]: `%${search}%` } }
                        ]
                    }
                    : {};
            } else {
                searchCriteria = search && search.trim()
                    ? {
                        $or: [
                            { reference_number: { $regex: `^${search}$`, $options: 'i' } },
                            { email: { $regex: `^${search}$`, $options: 'i' } }
                        ]
                    }
                    : {};
            }

            const payload = { page, limit, search: searchCriteria };
            const combinedResults = await logService.combinedErrorActivityData(payload);
            res.status(200).json({
                success: true,
                error: false,
                data: combinedResults,
                message: 'Activity and error logs.'
            });
        } catch (e) {
            if (e) {
                res.status(500).json({
                    success: false,
                    error: true,
                    message: e?.message || e?.response?.message || 'Something wrong has happened'
                });
            }
        }
    } else {
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};

