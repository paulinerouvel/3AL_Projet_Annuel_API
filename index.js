'use strict';

//tous les imports :
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const routerBuilder = require('./routes');

//on lance express
const app = express();

app.use(morgan('dev'));

routerBuilder.build(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}...`));
