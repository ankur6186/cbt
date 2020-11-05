const cors = require('cors');
const exp = require('express');
const bp = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const { connect } = require('mongoose');
const session = require('express-session');
const { success, error } = require('consola');
const expressLayouts = require('express-ejs-layouts');

// Bring in the app constants
const { DB, PORT } = require('./config');

// Initialize the application
const app = exp();
app.set('view engine', 'ejs');

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(expressLayouts);
app.use(passport.initialize());
app.use(exp.urlencoded({ extended: false}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.locals_msg = req.flash('error_msg');
    next();
})

require("./middlewares/passport")(passport);

// User Router Middleware
app.use("/", require("./routes/users"));

// Connection with DB
const startApp = async () => {
    try {
        // Connection With DB
        await connect(DB, {
            useFindAndModify: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
  
        success({
            message: `Successfully connected with the Database \n${DB}`,
            badge: true
        });
  
        // Start Listenting for the server on PORT
        app.listen(PORT, () =>
            success({ 
                message: `Server started on PORT ${PORT}`, 
                badge: true })
        );
    } 
    catch (err) {
        error({
            message: `Unable to connect with Database \n${err}`,
            badge: true
        });
    }
};
startApp();