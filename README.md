# Educador Físico - NodeJS server
![Build, test and deploy to Azure - educadorfisico](https://github.com/Hugo-NF/educador-fisico-backend/workflows/Build,%20test%20and%20deploy%20to%20Azure%20-%20educadorfisico/badge.svg)
![CI](https://github.com/Hugo-NF/educador-fisico-backend/workflows/CI/badge.svg)
![Language Count](https://img.shields.io/github/languages/count/Hugo-NF/educador-fisico-backend)
![Repo size](https://img.shields.io/github/repo-size/Hugo-NF/educador-fisico-backend)
[![Commit History](https://img.shields.io/github/last-commit/Hugo-NF/educador-fisico-backend)](https://github.com/Hugo-NF/educador-fisico-backend/commits/master)
[![Open Issues](https://img.shields.io/github/issues/Hugo-NF/educador-fisico-backend)](https://github.com/Hugo-NF/educador-fisico-backend/issues)

Node.JS API project

### Scripts
- npm start: Run the server with node
- npm run development: Run the server with nodemon
- npm test: Run all tests with jest
    - You can use (npm test -- file.spec.js to run a single test file)
- npm seed: Seed the database with initial data

## Environment
### .env Variables
- PORT - network port which the server should listen
- DB_CONN_STRING - MongoDB connection string to Microsoft Azure Cosmos DB
- TESTDB_CONN_STRING - MongoDB connection string to local MongoDB docker image - used as test database
- JWT_SECRET - JWT decoding secret key
- MAILJET_EMAIL - Mailjet sender e-mail
- MAILJET_PUBLIC_KEY - Mailjet API public key
- MAILJET_PRIVATE_KEY - Mailjet API private key

### Testing
1. Setup Database: Mongo container (or install the MongoDB itself)
    - Run: ```sudo docker run --name mongotests -p 27017:27017 -d mongo```
    - Restart: ```sudo docker container restart [ID | Name]```
    - Docker PS: ```sudo docker ps -a```