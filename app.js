const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');


const cookieParser = require('cookie-parser');
const session = require('express-session');

//Load user model
require('./Model/user');

require('./config/passport')(passport)

const index = require('./Routes/index');
const auth = require('./Routes/auth');


mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
}).then(() => {
    console.log('connected to mongo DB');
}).catch(err => console.log(err.message));

const app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Set Globar Vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});


app.use('/', index);
app.use('/auth', auth);





const PORT =    process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serever started on port ${5000}`);
});