/* eslint-disable new-cap */
// Importing the npm packages
const appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');

const {
  colorize, combine, timestamp, printf,
} = format;

const logOutputFormatter = printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`);

// The following JSON defines custom settings for each transport (file, console, HTTP)
const options = {
  file: {
    level: 'info',
    // Lowest level of logging to be included
    // Available levels:
    // 0. error, 1. warning, 2. info, 3. verbose, 4. debug, 5. silly

    filename: `${appRoot}/logs/server.log`,
    // Name of the output file

    handleExceptions: true,
    // Catch and log any unhandled exceptions

    json: false,
    // Save in JSON format

    maxsize: 10485760,
    // 10MB

    maxFiles: 5,

    colors: {
      ERROR: 'red', WARNING: 'yellow', INFO: 'blue', VERBOSE: 'GREEN',
    },
    colorize: false,
    // Uses colors for each level of log
    // WARNING: enabling this option will print ANSI escape characters,
    // so it's not useful for writing to files.

    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logOutputFormatter),
    // Defines the line formatting
    // WARNING: enabling this option conflicts with JSON format, choose one
  },

  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colors: {
      ERROR: 'red', WARNING: 'yellow', INFO: 'blue', VERBOSE: 'GREEN',
    },
    colorize: true,
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), colorize(), logOutputFormatter),
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = new createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write(message) {
    // use 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

// Logger becomes visible to other modules that uses require('this file')
module.exports = logger;
