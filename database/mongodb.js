const mongoose = require('mongoose');

const { DB_HOST, DB_NAME } = process.env;
const MONGODB_URI = `${DB_HOST}/${DB_NAME}`;

mongoose.connect(MONGODB_URI).then(() => console.log(`[MONGODB] [${DB_NAME}] Se conectó a la base de datos.`))
.catch(error => console.log(error));
