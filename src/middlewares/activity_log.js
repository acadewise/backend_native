const { internalServerError } = require('../helper/response_utility');
const activityLogDao = require('../modules/activity_log/actvityLogDao');


module.exports = createActivityLogs = function (type, activity) {
    return async (req, res, next) => {
        try {
            const admin = req.adminData
            const role = admin.role

            if (type && activity) {
                const payload = {
                    admin_type: role.id,
                    module_type: type,
                    activity,
                    created_by: admin.id
                }
                activityLogDao.create(payload)
                next();
            } else {
                next();
            }
        } catch (error) {
            return internalServerError(req, res, error);
        }
    }
}

