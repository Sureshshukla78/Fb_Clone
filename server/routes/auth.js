const express = require("express");
route = express.Router()
const User = require("../models/user");
const bcrypt = require("bcrypt");


/**
 * @description Auth Register Route
 * @method POST/
 */
route.post("/register", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        const registerUser = await newUser.save();
        res.status(201).send(registerUser);
    } catch (error) {
        res.status(500).send(error);
    }
});
/**
 * @description Auth login Route
 * @method POST/
 */
route.post("/login", async (req, res) => {
    try {
        const findUser = await User.findOne({ email: req.body.email });
        !findUser && res.status(404).send("User not find");

        const validPassword = await bcrypt.compare(req.body.password, findUser.password);
        !validPassword && res.status(400).send("wrong password");

        res.status(200).json(findUser);

    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = route;