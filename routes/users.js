const router = require("express").Router();
// Bring in the User Registration function
const {
    userAuth,
    userLogin,
    checkRole,
    userRegister,
    serializeUser
} = require('../utils/Auth');

// Home Page
router.get('/', (req, res) => res.render('home'));

// Welcome Page
router.get('/welcome/seller', (req, res) => res.render('welcome-seller'));
router.get('/welcome/transport', (req, res) => res.render('welcome-transport'));
router.get('/welcome/buyer', (req, res) => res.render('welcome-buyer'));

// Register Page
router.get('/register/seller', (req, res) => res.render('register-seller'));
router.get('/register/transport', (req, res) => res.render('register-transport'));
router.get('/register/buyer', (req, res) => res.render('register-buyer'));

// Login Page
router.get('/login/seller', (req, res) => res.render('login-seller'));
router.get('/login/transport', (req, res) => res.render('login-transport'));
router.get('/login/buyer', (req, res) => res.render('login-buyer'));

// Dashboard Page
router.get('/dashboard/seller', (req, res) => res.render('dashboard-seller'));

// POST Methods
// Registration Route
router.post('/register/seller', async(req, res) => {
    await userRegister(req.body, 'seller', res);
});
router.post('/register/transport', async(req, res) => {
    await userRegister(req.body, 'transport', res);
});
router.post('/register/buyer', async(req, res) => {
    await userRegister(req.body, 'buyer', res);
});

// Login Route
router.post('/login/seller', async(req, res) => {
    await userLogin(req.body, 'seller', res);
});
router.post('/login/transport', async(req, res) => {
    await userLogin(req.body, 'transport', res);
});
router.post('/login/buyer', async(req, res) => {
    await userLogin(req.body, 'buyer', res);
});


// // Profile Route
// router.get('/profile', userAuth, async(req, res) => {
//     return res.json(serializeUser(req.user));
// });

// // Seller Protected Route
// router.get(
//     '/seller-protected', 
//     userAuth, 
//     checkRole(['seller']), 
//     async(req, res) => {
//         return res.json('Hello Seller');
// });

// // Transport Protected Route
// router.get(
//     '/transport-protected', 
//     userAuth, 
//     checkRole(['transport']), 
//     async(req, res) => {
//         return res.json('Hello Transport');
// });
// // Buyer Protected Route
// router.get(
//     '/buyer-protected', 
//     userAuth, 
//     checkRole(['buyer']), 
//     async(req, res) => {
//         return res.json('Hello Buyer');
// });

module.exports = router;