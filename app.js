//确保.env在根目录下，否则需要指定路径require('dotenv').config({ path: './path/to/your/env/file' });
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/database/db');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});


app.use('/api', require('./src/routes/Routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

