var express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/hotel', require('./routes/routes'));
app.use('/images', express.static(__dirname + '/public/images'));

app.listen(port, console.log('Server started on port ' + port));