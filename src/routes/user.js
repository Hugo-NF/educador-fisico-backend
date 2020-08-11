/**
 * This file contains all the routes related to the user entity
 *
 */

const router = require('express').Router();
const { celebrate } = require('celebrate');

// Importing Controllers
const UsersController = require('../controllers/UsersController');

// Importing Validations
const {
  loginValidation,
  registerValidation,
  emailRequestValidation,
  tokenForgeryCheckValidation,
  resetPasswordValidation,
} = require('../validations/authValidations');

// Login existing user
/**
 * @swagger
 * /api/users/login:
 *  post:
 *    tags:
 *      - login
 *    summary: Log in an existing user
 *    description: Used to log in an existing user
 *    parameters:
 *      - in: body
 *        name: email
 *        schema:
 *          type: string
 *          example: teste1@gmail.com
 *        required: true
 *        description: user email
 *      - in: body
 *        name: password
 *        schema:
 *          type: string
 *          example: 123654789
 *        required: true
 *        description: user password
 *    responses:
 *      '409':
 *          description: User is not in database
 *      '401':
 *          description: user account is locked
 *      '200':
 *          description: user successfully logged in
 *      '500':
 *          description: login unavailable
 */
router.post('/login', celebrate(loginValidation, { abortEarly: false }), UsersController.login);

// Register new user
/**
 * @swagger
 * /api/users/register:
 *  post:
 *    tags:
 *      - login
 *    summary: Register new user
 *    description: Used to register a new user
 *    parameters:
 *      - in: body
 *        name: name
 *        schema:
 *          type: string
 *          example: Joaozinho
 *        required: true
 *        description: user name
 *      - in: body
 *        name: email
 *        schema:
 *          type: string
 *          example: teste1@gmail.com
 *        required: true
 *        description: user email
 *      - in: body
 *        name: password
 *        schema:
 *          type: string
 *          example: 123654789
 *        required: true
 *        description: user password
 *      - in: body
 *        name: birthDate
 *        schema:
 *          type: date
 *          example: 2020-08-10T00:28Z
 *        required: true
 *        description: user birth date
 *      - in: body
 *        name: sex
 *        schema:
 *          type: string
 *          example: male
 *        required: true
 *        description: user sex
 *      - in: body
 *        name: phone
 *        schema:
 *          type: json
 *          example: 
 *            type: mobile
 *            number: +55 (99) 98765-4321
 *            confirmed: false
 *        required: true
 *        description: user phone
 *      - in: body
 *        name: city
 *        schema:
 *          type: string
 *          example: Taguatinga
 *        required: true
 *        description: user city
 *      - in: body
 *        name: state
 *        schema:
 *          type: string
 *          example: DF
 *        required: true
 *        description: user state
 *    responses:
 *      '200':
 *          description: user successfully registered
 *      '409':
 *          description: User info uniqueness conflict
 *      '500':
 *          description: Could not register a new user
 */
router.post('/register', celebrate(registerValidation, { abortEarly: false }), UsersController.create);

// Send password recovery e-mail
/**
 * @swagger
 * /api/users/password/reset:
 *  post:
 *    tags:
 *      - login
 *    summary: Send password recovery e-mail
 *    description: Used to send password recovery e-mail
 *    parameters:
 *      - in: body
 *        name: email
 *        schema:
 *          type: string
 *          example: teste1@gmail.com
 *        required: true
 *        description: user email
 *      - in: body
 *        name: sandboxMode
 *        schema:
 *          type: boolean
 *          example: false
 *          default: false
 *        required: true
 *        description: used to send e-mail or not
 *    responses:
 *      '409':
 *          description: User is not in database
 *      '401':
 *          description: user account is locked
 *      '200':
 *          description: E-mail sent successfully
 *      '503':
 *          description: Could not send e-mail
 */
router.post('/password/reset', celebrate(emailRequestValidation, { abortEarly: false }), UsersController.sendRecoverEmail);

// Checks reset password token
/**
 * @swagger
 * /api/users/password/reset/:token:
 *  get:
 *    tags:
 *      - login
 *    summary: Checks reset password token
 *    description: Used to check reset password token
 *    parameters:
 *      - in: params
 *        name: token
 *        schema:
 *          type: string
 *          example: place the token here
 *        required: true
 *        description: Token
 *    responses:
 *      '409':
 *          description: Requested token was not emitted or active
 *      '403':
 *          description: Token is expired or already used
 *      '200':
 *          description: Token is active
 */
router.get('/password/reset/:token', celebrate(tokenForgeryCheckValidation, { abortEarly: false }), UsersController.checkPasswordResetToken);

// Reset user password
/**
 * @swagger
 * /api/users/password/reset/:token:
 *  post:
 *    tags:
 *      - login
 *    summary: resets the password token
 *    description: Used to reset password token
 *    parameters:
 *      - in: params
 *        name: token
 *        schema:
 *          type: string
 *          example: place the token here
 *        required: true
 *        description: Token
 *      - in: body
 *        name: password
 *        schema:
 *          type: string
 *          example: 123654789
 *        required: true
 *        description: user password
 *      - in: body
 *        name: sandboxMode
 *        schema:
 *          type: boolean
 *          example: false
 *          default: false
 *        required: true
 *        description: used to send e-mail or not
 *    responses:
 *      '409':
 *          description: Requested token was not emitted or active
 *      '403':
 *          description: Token is expired or was already used
 *      '200':
 *          description: Password successfully reset
 *      '500':
 *          description: An unknown error occured. Open server logs for depuration
 */
router.post('/password/reset/:token', celebrate(tokenForgeryCheckValidation, { abortEarly: false }), celebrate(resetPasswordValidation, { abortEarly: false }), UsersController.resetPassword);

// Send account activation e-mail
/**
 * @swagger
 * /api/users/activate:
 *  post:
 *    tags:
 *      - login
 *    summary: Send account activation e-mail
 *    description: Used to send account activation e-mail
 *    parameters:
 *      - in: body
 *        name: email
 *        schema:
 *          type: string
 *          example: teste1@gmail.com
 *        required: true
 *        description: user email
 *      - in: body
 *        name: sandboxMode
 *        schema:
 *          type: boolean
 *          example: false
 *          default: false
 *        required: true
 *        description: used to send e-mail or not
 *    responses:
 *      '409':
 *          description: User is not in database
 *      '401':
 *          description: This account is locked
 *      '200':
 *          description: E-mail sent successfully
 *      '503':
 *          description: Could not send e-mail
 */
router.post('/activate', celebrate(emailRequestValidation, { abortEarly: false }), UsersController.sendAccountActivationEmail);

// Activate account
/**
 * @swagger
 * /api/users/activate/:token:
 *  get:
 *    tags:
 *      - login
 *    summary: Activate account
 *    description: Used to activate an account
 *    parameters:
 *      - in: params
 *        name: token
 *        schema:
 *          type: string
 *          example: place the token here
 *        required: true
 *        description: Token
 *      - in: body
 *        name: sandboxMode
 *        schema:
 *          type: boolean
 *          example: false
 *          default: false
 *        required: true
 *        description: used to send e-mail or not
 *    responses:
 *      '409':
 *          description: Requested token was not emitted or active
 *      '403':
 *          description: Token is expired or was already used
 *      '200':
 *          description: Account successfully activated
 *      '500':
 *          description: An unknown error occured. Open server logs for depuration
 */
router.get('/activate/:token', celebrate(tokenForgeryCheckValidation, { abortEarly: false }), UsersController.activateAccount);

module.exports = router;
