const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/users/Teacher");
// Load middleware
const checkAuth = require("../../middlewares/authorization/checkAuth");

// @route POST api/users/teacher/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } 
        else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                    .save()
                    .then ((user) => {
                        const payload = {
                            user: {
                                id: user._id,
                                name: user.name
                            }
                        };
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            { expiresIn: 31556926 },
                            (err, token) => {
                                if(err) throw err;
                                res.json({ 
                                    user,
                                    token: "Bearer "+token
                                });
                            }    
                        );
                    })
                    .catch(err => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/teacher/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user._id,
                    name: user.name
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { expiresIn: 31556926 },
                    (err, token) => {
                        res.json({
                            token: "Bearer " + token
                        });
                    }
                );
            }
            else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

// @route GET api/users/teacher
// @desc Get list of all teachers
// @access Private
router.get("/", checkAuth, async (req, res) => {
    const users = await User.find().select({ password: false });
    if(users) {
        res.json(users);
    }
});

module.exports = router;