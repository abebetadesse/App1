import { body } from 'express-validator';

const validateFieldCreation = [
  body('fieldName')
    .notEmpty()
    .withMessage('Field name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Field name must be between 2 and 50 characters'),
  
  body('fieldType')
    .isIn(['text', 'number', 'select', 'textarea', 'date', 'boolean', 'file'])
    .withMessage('Invalid field type'),
  
  body('fieldLabel')
    .notEmpty()
    .withMessage('Field label is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Field label must be between 2 and 100 characters'),
  
  body('section')
    .notEmpty()
    .withMessage('Section is required'),
  
  body('hierarchy')
    .isInt({ min: 0 })
    .withMessage('Hierarchy must be a positive integer')
];

export {
validateFieldCreation
};