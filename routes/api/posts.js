const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');


// @route   POST api/posts
// @desc    Create new post
// @access  Public
router.post('/', [
    auth,
    [
        check('text', 'Text is required.').not().isEmpty()
    ]
], async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }

    try{

        const user = await User.findById(req.user.id).select('-password'); // comming from the validated token
        const new_post = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user:req.user.id
        });

        const post = await new_post.save();
        res.json(post);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async(req,res) => {
    try{
        const posts = await Post.find().sort({date:-1}); // selecting the most recent posts first
        res.json(posts);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   GET api/posts/:id
// @desc    Get single post by id
// @access  Private
router.get('/:id', auth, async(req,res) => {
    try{

        const post = await Post.findById(req.params.id); // selecting the most recent posts first
        if(!post){
            return res.status(404).json({msg:'No post found.'});
        }
        res.json(post);

    }catch(err){
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            res.status(404).json({msg:'No post found.'});
        } 
        res.status(500).send('Server error');
    }
});


// @route   DELETE api/posts/:id
// @desc    Deletes a single post
// @access  Private
router.delete('/:id', auth, async(req,res) => {
    try{

        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:'No post found.'});
        }

        // check if the user owns the post
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized.'});
        }

        await post.remove();
        res.json({msg:'Post removed.'});

    }catch(err){
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            res.status(404).json({msg:'No post found.'});
        } 
        res.status(500).send('Server error');
    }
});


// @route   PUT api/posts/like/:id
// @desc    Adds a like to a post
// @access  Private
router.put('/like/:id', auth, async (req,res) => {
    try{

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg:'No post found.'});
        }

        // Check if the post has already been liked by that user
        // looping through the likes of the user and filtering those in which the user is the current one requesting the like
        // if found, it wont allow him to do it again
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(403).json({msg:'Post already liked.'});
        }

        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes); // sending the likes as response for the FE

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   PUT api/posts/like/:id
// @desc    Unlike the post
// @access  Private
router.put('/unlike/:id', auth, async (req,res) => {
    try{

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({msg:'No post found.'});
        }

        // Check if the post has been liked by that user
        // if the post has not been liked by user then he shouldn't unlike it
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(403).json({msg:'Post has not yet been liked.'});
        }

        // Get remove index
        // this maps the likes and returns the one which has the index as the user id on it
        // this maps the array of likes by its users and returns the ones in which the user/index is like the one passed as parameter in the indexOf function
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   POST api/posts/comment/:id
// @desc    Create new post comment
// @access  Private
router.post('/comment/:id', [
    auth,
    [
        check('text', 'Text is required.').not().isEmpty()
    ]
], async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }

    try{

        const user = await User.findById(req.user.id).select('-password'); 
        const post = await Post.findById(req.params.id);

        const new_comment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user:req.user.id
        };

        post.comments.unshift(new_comment);
        await post.save();
        res.json(post.comments);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req,res) => {
    try{

        const post = await Post.findById(req.params.id);
        
        // this is a map function that find from the comments collection the one which has that parameter
        // which mean looping through the comments collection and find the one in which the id has the same id passed as parameter
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if(!comment){
            return res.status(404).json({msg:'Comment does not exist.'});
        }

        // check if the user trying to delete the comment is the one that actuallt made the comment
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User not authorized.'});
        }

        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;