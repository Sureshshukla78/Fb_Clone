const express = require("express");
route = express.Router()
const Post = require("../models/postModel");
const User = require("../models/user");

// create a post 
route.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});
// update  a post
route.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("The post has been Updated.");
        } else {
            res.status(403).json("you can only update your Post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
// delete a post
route.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The post has been deleted.");
        } else {
            res.status(403).json("you can only delete your Post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
// like a post
route.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("This post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("This post has been disliked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})
// get a post
route.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params)
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})
// get timeline posts
route.get("/timeline/all", async(req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const currentUserPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.following.map(friendId => {
              return Post.find({ userId: friendId });
            })
        );
        res.status(200).json(currentUserPosts.concat(...friendPosts));
    } catch (error) {
        res.status(500).json(error);
    }
})
module.exports = route