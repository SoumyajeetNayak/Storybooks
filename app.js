const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const {truncate, stripTags, formatDate, select, editIcon} = require('./helpers/hbs');

const cookieParser = require('cookie-parser');
const session = require('express-session');

//Load  model
require('./Model/user');
require('./Model/story');

require('./config/passport')(passport)

const index = require('./Routes/index');
const auth = require('./Routes/auth');
const stories = require('./Routes/stories');


mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
}).then(() => {
    console.log('connected to mongo DB');
}).catch(err => console.log(err.message));

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
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

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);





const PORT =    process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serever started on port ${5000}`);
});