const { check } = require('express-validator');

 

const CreateProduct = [
    check('title').notEmpty().withMessage('Title is required'),
    check('desc').notEmpty().withMessage('Description is required'),
    check('price').notEmpty().isNumeric().withMessage('Price must be a numeric value'),
    check('category').notEmpty().withMessage('Category is required'),
    check('features').isArray().withMessage('Features must be an array')
]

const updateProduct = [
    check('title').optional().notEmpty().withMessage('Title is required'),
    check('desc').optional().notEmpty().withMessage('Description is required'),
    check('price').optional().isNumeric().withMessage('Price must be a numeric value'),
    check('category').optional().notEmpty().withMessage('Category is required'),
    check('features').optional().isArray().withMessage('Features must be an array'),
  ]


module.exports = {
    CreateProduct,
    updateProduct,data
}