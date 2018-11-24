const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

require('./config/passport')(passport)

const auth = require('./Routes/auth');

const app = express();

app.get('/', (req, res) => {
    res.send('It is working');
});

app.use('/auth', auth);

const PORT =    process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serever started on port ${5000}`);
});