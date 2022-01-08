var express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use('/', require('./routes/routes'));
app.use('/images', express.static(__dirname + '/public/images'));

const port = process.env.PORT || '5000';
app.listen(port, console.log('Server started on ports ' + port));