const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use('/', require('./routes/routes'));

app.listen(3100, console.log('Server started on port 3100'));