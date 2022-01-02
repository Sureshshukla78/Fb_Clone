const express = require("express");
route = express.Router()
const user = require("../models/user");
// update user
route.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const password = await bcrypt.hash(req.body.password, 10)
            } catch (error) {
                res.status(500).json(error);
            }
        }
        try {
            const getUser = await user.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("account has been updated");
        } catch (error) {

        }
    } else {
        return res.status(403).json("you can update only your account")
    }
})
// delete user
route.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await user.findByIdAndDelete(req.params.id);
            res.status(200).json("account has been deleted successfully");
        } catch (error) {
            res.status(500).send("server Error");
        }
    } else {
        return res.status(403).json("you can only delete your account")
    }
});
// get a user
route.get("/:id", async (req, res) => {
    try {
        const getUser = await user.findById(req.params.id);
        const { password, updatedAt, ...other } = getUser._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(404).send("User not found");
    }
});
// follow a user
route.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            // trying to follow this user
            const followuser = await user.findById(req.params.id);
            // user which is trying to make request
            const currUser = await user.findById(req.body.userId);
            console.log("user verified");
            if (!followuser.followers.includes(req.body.userId)) {
                await followuser.updateOne({ $push: { followers: req.body.userId } });
                await currUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you already followed");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can't follow yourself");
    }
});
// unfollow a user
route.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            // trying to follow this user
            const followuser = await user.findById(req.params.id);
            // user which is trying to make request
            const currUser = await user.findById(req.body.userId);
            console.log("user verified");
            if (followuser.followers.includes(req.body.userId)) {
                await followuser.updateOne({ $pull: { followers: req.body.userId } });
                await currUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you don't follow this user");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can't unfollow yourself");
    }
});


module.exports = route;