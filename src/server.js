const dotenv = require('dotenv').config();
const application = require('./app');

let port = process.env.PORT;
application.listen(port, () => console.log(`Server up and running on port ${port}`));