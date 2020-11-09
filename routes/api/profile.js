const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator/check');


// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req,res) => {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name', 'avatar']);

        if(!profile){
            return res.status(401).json({msg:'There is no profile for this user.'});
        }

        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   POST api/profile
// @desc    Create user profile
// @access  Private
router.post('/', 
[
    auth, 
    [
        check('status', 'Status is required.').not().isEmpty(),
        check('skills', 'Skills is requried.').not().isEmpty()
    ]
], async (req,res) => {
    
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({errors:errors.array()});
        }

        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            youtube,
            facebook,
            twitter,
            intragram,
            linkedin
        } = req.body;

        const profile_fields = {};
        profile_fields.user = req.user.id;

        if(company) profile_fields.company = company;
        if(website) profile_fields.website = website;
        if(location) profile_fields.location = location;
        
        profile_fields.status = status;
        profile_fields.skills = skills.split(',').map(skill => skill.trim());
        
        if(bio) profile_fields.bio = bio;
        if(githubusername) profile_fields.githubusername = githubusername;
        

        profile_fields.social = {}
        if(youtube) profile_fields.social.youtube = youtube
        if(facebook) profile_fields.social.facebook = facebook
        if(twitter) profile_fields.social.twitter = twitter
        if(intragram) profile_fields.social.intragram = intragram
        if(linkedin) profile_fields.social.linkedin = linkedin

        try{
            let profile = await Profile.findOne({user:req.user.id});

            if(profile){
                profile = await Profile.findOneAndUpdate(
                    {user:req.user.id}, 
                    {$set:profile_fields}, 
                    {new:true});
            }else{
                profile = new Profile(profile_fields);
                await profile.save(); 
            } 
            res.json(profile);

        }catch(err){
            console.error(err.message);
            res.status(500).send('Server error');
        }
});

module.exports = router;