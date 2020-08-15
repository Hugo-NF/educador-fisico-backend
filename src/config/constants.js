module.exports = {
  APP_NAME: 'Treino para Todos', // Name of the APP, used to e-mailing
  REACTAPP_HOST: 'http://treinoparatodos.azurewebsites.net', // Address of our frontend application, used in the buttons/links of our e-mails
  JWT_LIFESPAN: '30d', // Maximum amount of time before any user is requested to login again
  RESET_PASSWORD_EXPIRATION: 120, // Expiration time of the tokens to password reset
  ACCOUNT_ACTIVATION_EXPIRATION: 120, // Expiration time of the tokens to activate account
};
