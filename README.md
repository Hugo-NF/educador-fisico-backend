# Educador Físico - NodeJS server
[![Actions Status](https://github.com/Hugo-NF/educador-fisico-backend/workflows/Build%20and%20deploy%20Node.js%20app%20to%20Azure%20Web%20App%20-%20educadorfisico/badge.svg)](https://github.com/Hugo-NF/educador-fisico-backend/actions)

Training and exercise manager between students and instructors.
This project is intended to help people that can not afford a gym membership, but want to stay healthy,
 exercising from home and receiving assistance of professional trainers.

## Environments
### .env Variables
1. PORT - network port which the server should listen
2. COSMOSDB_CONN_STRING - MongoDB connection string to Microsoft Azure Cosmos DB
3. TESTDB_CONN_STRING - MongoDB connection string to local MongoDB docker image - used as test database
4. JWT_SECRET - JWT decoding secret key
5. JWT_LIFESPAN - Determines JWT expiresIn field
6. MAILJET_EMAIL - Mailjet sender e-mail
7. MAILJET_PUBLIC_KEY - Mailjet API public key
8. MAILJET_PRIVATE_KEY - Mailjet API private key

### Testing
1. Database: Mongo container
    - Run: ```sudo docker run --name mongotests -p 27017:27017 -d mongo```
    - Restart: ```sudo docker container restart [ID | Name]```
    - Docker PS: ```sudo docker ps -a```
