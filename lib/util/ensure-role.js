const tokenService = require('./token-service');

module.exports = function(requiredRole) {
    return (req, res, next) => {
        const token = req.get('Token');

        const role = (tokenService.verify(token)).role;

        try{
            if(role !== requiredRole) {
                next({
                    status: 403,
                    error: `Requires ${requiredRole} role`
                });
            }
        }

        catch(err){
            next();
        }
    };
};