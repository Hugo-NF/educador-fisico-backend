# Educador Físico - NodeJS server
[![Actions Status](https://github.com/Hugo-NF/educador-fisico-backend/workflows/Build%20and%20deploy%20Node.js%20app%20to%20Azure%20Web%20App%20-%20educadorfisico/badge.svg)](https://github.com/Hugo-NF/educador-fisico-backend/actions) 
![Language Count](https://img.shields.io/github/languages/count/Hugo-NF/educador-fisico-backend)
![Repo size](https://img.shields.io/github/repo-size/Hugo-NF/educador-fisico-backend)
[![Commit History](https://img.shields.io/github/last-commit/Hugo-NF/educador-fisico-backend)](https://github.com/Hugo-NF/educador-fisico-backend/commits/master)
[![Open Issues](https://img.shields.io/github/issues/Hugo-NF/educador-fisico-backend)](https://github.com/Hugo-NF/educador-fisico-backend/issues)

Training and exercise manager between students and instructors.
This project is intended to help people that can not afford a gym membership, but want to stay healthy,
 exercising from home and receiving assistance of professional trainers.

## Environments
### .env Variables
- APP_NAME - Commercial application name
- REACTAPP_HOST = Url of the web application
- PORT - network port which the server should listen
- COSMOSDB_CONN_STRING - MongoDB connection string to Microsoft Azure Cosmos DB
- TESTDB_CONN_STRING - MongoDB connection string to local MongoDB docker image - used as test database
- JWT_SECRET - JWT decoding secret key
- JWT_LIFESPAN - Determines JWT expiresIn field
- MAILJET_EMAIL - Mailjet sender e-mail
- MAILJET_PUBLIC_KEY - Mailjet API public key
- MAILJET_PRIVATE_KEY - Mailjet API private key

### Testing
1. Database: Mongo container
    - Run: ```sudo docker run --name mongotests -p 27017:27017 -d mongo```
    - Restart: ```sudo docker container restart [ID | Name]```
    - Docker PS: ```sudo docker ps -a```
