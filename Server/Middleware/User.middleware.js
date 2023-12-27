const { check } = require('express-validator');

const UserValidation = (req, res, next) => {
    const validation = [
        check('name').optional().notEmpty().withMessage('name is required'),
        check('email').isEmail().notEmpty().withMessage('Invalid email'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ]
    next(validation)
}

module.exports = UserValidation