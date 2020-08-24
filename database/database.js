const mongoose = require('mongoose');

const { DB_HOST, DB_NAME } = process.env;
const MONGODB_URI = DB_HOST + DB_NAME;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(db => console.log(`[MONGODB] [${DB_NAME}] Se ha contectado a la base de datos`))
.catch(err => console.log(err));