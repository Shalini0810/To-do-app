const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
// SIGN UP
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByUsername = await User.findOne({ username });
        const hashpassword = bcrypt.hashSync(password);

        if (existingUserByEmail || existingUserByUsername) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const user = new User({ email, username, password :hashpassword });
        await user.save();

        res.status(200).json({ user: user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
//SIGN IN
router.post("/signin", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ message: "Please Sign Up Next" });
        }

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Password is Not Correct" });
        }

        const { password, ...others } = user._doc;
        return res.status(200).json({ user: others });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
