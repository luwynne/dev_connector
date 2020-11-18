const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator/check');
const request = require('request');
const config = require('config');


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
            instagram,
            linkedin
        } = req.body;

        const profile_fields = {};
        profile_fields.user = req.user.id;

        if(company) profile_fields.company = company;
        if(website) profile_fields.website = website;
        if(location) profile_fields.location = location;
        
        profile_fields.status = status;
        profile_fields.skills = skills;
        
        if(bio) profile_fields.bio = bio;
        if(githubusername) profile_fields.githubusername = githubusername;
        

        profile_fields.social = {}
        if(youtube) profile_fields.social.youtube = youtube
        if(facebook) profile_fields.social.facebook = facebook
        if(twitter) profile_fields.social.twitter = twitter
        if(instagram) profile_fields.social.instagram = instagram
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


// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req,res) => {
    try{
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   GET api/profile/user/:user_id
// @desc    Get the profile by the user ID
// @access  Public
router.get('/user/:user_id', async (req,res) => {
    try{
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).send('Profile not found.');
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).send('Profile not found.');
        }
        res.status(500).send('Server error');
    }
});



// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private
router.delete('/', auth, async (req,res) => {
    try{
        await Post.deleteMany({user: req.user.id}); // removing the user's post
        await Profile.findOneAndRemove({user: req.user.id}); // remove profile
        await User.findOneAndRemove({_id: req.user.id}); // remove user
        res.json({msg:'User deleted.'});
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   PUT api/profile/experience
// @desc    Adds/updates the profile experience
// @access  Private
router.put('/experience', [
    auth,
    [
        check('title', 'Title is required.').not().isEmpty(),
        check('company', 'Company is requried.').not().isEmpty(),
        check('from', 'From date is requried.').not().isEmpty() 
    ]
],
async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }

    const {
        title, 
        company, 
        location, 
        from, 
        to, 
        current, 
        description
    } = req.body;

    const new_exp = {title, company, location, from, to, current, description};

    try{   
        const profile = await Profile.findOne({user: req.user.id});
        
        if(!profile){
            return res.status(400).send('Profile not found.');
        }
        profile.experience.unshift(new_exp);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete profile experience
// @access  Private
router.delete('/experience/:exp_id', auth, async (req,res) => {
    try{
        const profile = await Profile.findOne({user:req.user.id});
        
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        
        if(removeIndex >= 0){
            profile.experience.splice(removeIndex,1);
            await profile.save();
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   PUT api/profile/education
// @desc    Adds/updates the profile education
// @access  Private
router.put('/education', [
    auth,
    [
        check('school', 'Title is required.').not().isEmpty(),
        check('degree', 'Company is requried.').not().isEmpty(),
        check('fieldofstudy', 'From date is requried.').not().isEmpty(),
        check('from', 'From date is requried.').not().isEmpty() 
    ]
],
async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current
    } = req.body;

    const new_edu = {school,degree,fieldofstudy,from,to,current};

    try{   
        const profile = await Profile.findOne({user: req.user.id});
        
        if(!profile){
            return res.status(400).send('Profile not found.');
        }
        profile.education.unshift(new_edu);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete profile experience
// @access  Private
router.delete('/education/:edu_id', auth, async (req,res) => {
    try{
        const profile = await Profile.findOne({user:req.user.id});
        
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        
        if(removeIndex >= 0){
            profile.education.splice(removeIndex,1);
            await profile.save();
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   GET api/profile/github/:username
// @desc    Gets the Github profile
// @access  Public
router.get('/github/:username', (req,res) => {
    try{

        const options = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&
            client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:'GET',
            headers:{ 'user-agent':'node.js' }
        }

        request(options, (error, response, body) => {
            if(error){
                console.error(error);
            }
            if(response.statusCode !== 200){
                return res.status(404).json({msg:'No Github profile found'});
            }
            res.json(JSON.parse(body));
        });

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;