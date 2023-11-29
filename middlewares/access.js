module.exports = {
    checkRole: (requiredRoles) => {
        return (req, res, next) => {
            const userRole = req.user.typeRole;
            if (requiredRoles.includes(userRole)) {
                // Người dùng có quyền truy cập
                next();
            } else {
                res.status(403).json({ message: 'Không có quyền truy cập.' });
            }
        };
    }
};
