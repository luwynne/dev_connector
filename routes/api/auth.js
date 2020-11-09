const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');
const jwt  = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');


// @route   GET api/auth
// @desc    Get logged user
// @access  Public
router.get('/', auth, async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   POST api/auth
// @desc    Login and get user token
// @access  Public
router.post('/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ], 
    async (req,res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()});
        }

        const {email, password} = req.body;

        try{

            let user = await User.findOne({email});
            if(!user){
                return res.status(401).json({errors:[{msg:'Invalid credentials. User not found'}]});
            }

            // encrypting password to compare on DB
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(401).json({errors:[{msg:'Invalid credentials.'}]});
            }
            
            const payload = {
                user:{
                    id: user.id
                }
            }

            // jwt signing
            jwt.sign(
                payload, 
                config.get('jwtSecret'), 
                {expiresIn: 360000},
                (err,token) => {
                    if(err){
                        throw err;
                    }else{
                        return res.json({token});
                    }
                }
            );
        }catch(err){
            console.error(err.message);
            return res.status(500).send('Server error');
        }
});

module.exports = router;