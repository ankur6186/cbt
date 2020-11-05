const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const { SECRET } = require('../config');

// Description to register the User(Seller, Transport, Buyer)
const userRegister = async(userDets, role, res) => {
    try {
        // Validate Email
        let emailNotRegistered = await validateEmail(userDets.email);
        if (!emailNotRegistered) {
            return res.status(400).json({
                message: "Email is already registered.",
                success: false
            });
        }

        // Get the hashed password
        const password = await bcrypt.hash(userDets.password, 12);
        // Create a new user
        const newUser = new User({
            ...userDets,
            password,
            role
        });

        var str1 = '/login/';
        var addr = str1.concat(role);
        await newUser.save()
            .then(user => {
                res.redirect(addr);
            })
        ;
    } catch (err) {
        // Implement logger function (winston)
        console.log(err);
        return res.status(500).json({
            message: "Unable to create account",
            success: false
        });
    }
};

// Description to login the User(Seller, Transport, Buyer)
const userLogin = async (userCreds, role, res) => {
    let { email, password } = userCreds;

    const user = await User.findOne({ email });
    if(!user){
        return res.status(404).json({
            message: "Email is not found, Invalid login credentials.",
            success: false
        });
    }
    if(user.role != role){
        return res.status(403).json({
            message: "Please make sure you are logging in from the right portal.",
            success: false
        });
    }
    // User is existing, check for password now
    let isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
        // Sign in the token and issue it to the user.
        let token = jwt.sign({
            user_id: user._id,
            role: user.role,
            email: user.email
        },
            SECRET,
            { expiresIn: "7 days"}
        );

        let result = {
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 168
        };
        var str1 = '/dashboard/';
        var addr = str1.concat(role);
        res.redirect(addr);
    }
    else{
        return res.status(403).json({
            message: "Incorrect password",
            success: false
        });
    }
};

const validateEmail = async email => {
    let emailid = await User.findOne({ email });
    return emailid ? false : true;
};

// Description of Passport Middleware
const userAuth = passport.authenticate('jwt', { session: false });

// Description of Check Role Middleware
const checkRole = roles => (req, res, next) => 
    !roles.includes(req.user.role)
        ? res.status(401).json('Unauthorized')
        : next();

const serializeUser = user => {
    return {
        email: user.email,
        _id: user.id,
        name: user.name
    };
}

module.exports = {
    userAuth,
    userLogin,
    checkRole,
    userRegister,
    serializeUser
};