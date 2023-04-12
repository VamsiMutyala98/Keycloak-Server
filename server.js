require('dotenv').config();
var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const routes = require('./routes');
const globalErrorHandler = require('./controller/error.controller');

require('./connection/connection');

const corsOptions ={
  origin: [process.env.UI_ORIGIN, process.env.STAGING_ORIGIN, process.env.PROD_ORIGIN], 
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

// routes
app.use('/api', routes);

// global error handler
app.use(globalErrorHandler);


app.listen(process.env.SERVER_PORT, function () {
   var host = process.env.SERVER_HOST;
   var port = process.env.SERVER_PORT;
   console.log("Server http://%s:%s", host, port);
})