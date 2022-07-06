const express =require('express'),
// cookieParser = require('cookie-parser'),
bodyParser = require('body-parser')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());
app.use(require('./src/routes/authRoutes'));
app.use(require('./src/routes/fileRoutes'));

app.listen(5000);