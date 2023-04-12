const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,{ useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error',(err) => {
  console.log(err);
});

db.once('open',() => {
  console.log("DataBase successFully Connected");
});