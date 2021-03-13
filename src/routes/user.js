/**
 * This file contains all the routes related to Authentication operations
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    ErrorCodes:
 *      type: string
 *      additionalProperties:
 *        type: number
 *      examples:
 *        WRONG_PASSWORD: 4000
 *        USER_NOT_IN_DATABASE: 4001
 *        VALIDATION_ERROR: 4002
 *        ACCOUNT_LOCK_OUT: 4003
 *        ACCESS_FAILED_LIMIT_REACHED: 4004
 *        DATABASE_CONFLICT: 4005
 *        MISSING_AUTH_TOKEN: 4006
 *        JWT_FORGED: 4007
 *        UNAUTHORIZED_ROUTE: 4008
 *        MAILJET_UNAVAILABLE: 4009
 *        TOKEN_NOT_GENERATED: 4010
 *        TOKEN_EXPIRED: 4011
 *        RESOURCE_NOT_IN_DATABASE: 4012
 *        RESOURCE_OWNERSHIP_MISMATCH: 4013
 *        UNKNOWN_ERROR: 5000
 *    LoginRequest:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          description: User's e-mail address
 *          example: hugonfonseca@hotmail.com
 *        password:
 *          type: string
 *          description: User's password
 *          example: 123456789
 *    LoginResponse:
 *      type: object
 *      properties:
 *        statusCode:
 *          type: number
 *          description: HTTP status code
 *          example: 200
 *        message:
 *          type: string
 *          description: 'Post login message'
 *          example: 'Logged in successfully'
 *        data:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              description: name of current user
 *            email:
 *              type: string
 *              description: email of current user
 *            active:
 *              type: boolean
 *              description: account is activated
 *            authToken:
 *              type: string
 *              description: authentication token
 *    CheckPasswordResetResponse:
 *      type: object
 *      properties:
 *        statusCode:
 *          type: number
 *          description: HTTP status code
 *          example: 200
 *        message:
 *          type: string
 *          description: 'Post message'
 *          example: 'Token is active'
 *        data:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              description: name of current user
 *            email:
 *              type: string
 *              description: email of current user
 *    RegisterRequest:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - birthDate
 *        - sex
 *        - phone
 *        - city
 *        - state
 *      properties:
 *        name:
 *          type: string
 *          description: User's display name
 *          example: Hugo Fonseca
 *        email:
 *          type: string
 *          description: User's e-mail address
 *          example: email@email.com
 *        password:
 *          type: string
 *          description: User's password
 *          example: 12345678
 *        birthDate:
 *          type: date
 *          description: User's birth date. Time component is ignored.
 *          example: "1992-10-08T00:00:00.000Z"
 *        sex:
 *          type: string
 *          description: User's sex
 *          example: 'Male'
 *        phone:
 *          type: object
 *          properties:
 *            type:
 *              type: string
 *              description: User's phone type
 *              example: 'Mobile'
 *            number:
 *              type: string
 *              description: User's phone number
 *              example: '+55 (55) 99999-9999'
 *        city:
 *          type: string
 *          description: User's city
 *          example: 'Brasilia'
 *        state:
 *          type: string
 *          description: User's state
 *          example: 'DF'
 *    RegisterResponse:
 *      type: object
 *      properties:
 *        statusCode:
 *          type: number
 *          description: HTTP status code
 *          example: 200
 *        data:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              description: id of newly created user
 *    SendEmailRequest:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 *          description: User's e-mail address
 *          example: email@email.com
 *        sandboxMode:
 *          type: boolean
 *          description: Enable sandbox mode. All operations are done, but e-mails are not sent.
 *          example: false
 *    PasswordResetRequest:
 *      type: object
 *      required:
 *        - password
 *      properties:
 *        password:
 *          type: string
 *          description: User's e-mail address
 *          example: 123456789
 *        sandboxMode:
 *          type: boolean
 *          description: Enable sandbox mode. All operations are done, but e-mails are not sent.
 *          example: false
 *    ErrorResponse:
 *      type: object
 *      required:
 *        - statusCode
 *        - errorCode
 *      properties:
 *        statusCode:
 *          type: number
 *          description: HTTP status code
 *        errorCode:
 *          type: number
 *          description: application error code. See ErrorCodes enum.
 *        message:
 *          type: string
 *          description: optional application error description
 *        error:
 *          type: object
 *          description: optional error specific details
 */

/**
 * @swagger
 *   tags:
 *     name: Authentication
 *     description: Routes to authentication operations
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

/**
 * @swagger
 * /api/users/login:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Autenticate an existing user
 *    description: Get an authentication token using e-mail and password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/LoginRequest'
 *    responses:
 *       200:
 *          description: Login successfull.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/LoginResponse'
 *       401:
 *          description: Login unsuccessfull. See ErrorResponse schema for details.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *          description: User is not in database
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', celebrate(loginValidation, { abortEarly: false }), UsersController.login);

/**
 * @swagger
 * /api/users/register:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Register new user
 *    description: Create a new user in database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterRequest'
 *    responses:
 *       201:
 *          description: User successfully registered
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/RegisterResponse'
 *       409:
 *          description: User already registered with e-mail
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', celebrate(registerValidation, { abortEarly: false }), UsersController.create);

/**
 * @swagger
 * /api/users/password/reset:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Request a password recovery e-mail
 *    description: Generate a password recovery token and send a e-mail
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SendEmailRequest'
 *    responses:
 *       200:
 *          description: E-mail sent successfully
 *       401:
 *          description: User account is locked
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *          description: User is not in database
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       503:
 *          description: SMTP server unavailable
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/password/reset', celebrate(emailRequestValidation, { abortEarly: false }), UsersController.sendRecoverEmail);

// Checks reset password token
/**
 * @swagger
 * /api/users/password/reset/:token:
 *  get:
 *    tags:
 *      - Authentication
 *    summary: Checks reset password token
 *    description: Used to check reset password token
 *    parameters:
 *      - in: params
 *        name: token
 *        schema:
 *          type: string
 *          example: Paste password reset token here
 *        required: true
 *        description: Reset password token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SendEmailRequest'
 *    responses:
 *       200:
 *          description: Token is active
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CheckPasswordResetResponse'
 *       403:
 *          description: Token is expired or already used
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *          description: Requested token was not emitted or active
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/password/reset/:token', celebrate(tokenForgeryCheckValidation, { abortEarly: false }), UsersController.checkPasswordResetToken);

// Reset user password
/**
 * @swagger
 * /api/users/password/reset/:token:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Resets the user's password
 *    description: Resets the password using emitted token
 *    parameters:
 *      - in: params
 *        name: token
 *        schema:
 *          type: string
 *          example: Paste password reset token here
 *        required: true
 *        description: Reset password token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PasswordResetRequest'
 *    responses:
 *       200:
 *          description: Password successfully reset
 *       403:
 *          description: Token is expired or was already used
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *          description: Requested token was not emitted or active
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/password/reset/:token', celebrate(tokenForgeryCheckValidation, { abortEarly: false }), celebrate(resetPasswordValidation, { abortEarly: false }), UsersController.resetPassword);

// Send account activation e-mail
/**
 * @swagger
 * /api/users/activate:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Send account activation e-mail
 *    description: Send an activation e-mail with account activation token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/SendEmailRequest'
 *    responses:
 *      409:
 *          description: User is not in database
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *      401:
 *          description: User account is locked
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *      200:
 *          description: E-mail sent successfully
 *      503:
 *          description: SMTP server unavailable
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/activate', celebrate(emailRequestValidation, { abortEarly: false }), UsersController.sendAccountActivationEmail);

// Activate account
/**
 * @swagger
 * /api/users/activate/:token:
 *  get:
 *    tags:
 *      - Authentication
 *    summary: Activate an account
 *    description: Activate an account using e-mail token
 *    parameters:
 *      - in: params
 *        name: token
 *        schema:
 *          type: string
 *          example: Paste activation token here
 *        required: true
 *        description: Account activation token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              sandboxMode:
 *                type: boolean
 *                description: Enable sandbox mode. All operations are done, but e-mails are not sent.
 *                example: false
 *    responses:
 *      200:
 *          description: Account successfully activated
 *      403:
 *          description: Token is expired or was already used
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *      409:
 *          description: Requested token was not emitted or active
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *      500:
 *          description: Internal server error. Please, consider opening a report to development team.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/activate/:token', celebrate(tokenForgeryCheckValidation, { abortEarly: false }), UsersController.activateAccount);

module.exports = router;
