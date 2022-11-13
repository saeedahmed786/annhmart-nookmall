const User = require('../models/userModel');
var bcrypt = require('bcryptjs');
const config = require('../config/keys');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendEmail = require('../nodemailer');

exports.getAllUsers = async (req, res) => {
    const findUsers = await User.find();
    if (findUsers) {
        res.status(200).json(findUsers);
    } else {
        res.status(404).json({ errorMessage: 'No Users Found' });
    }
}

exports.getUserById = async (req, res) => {
    const findUser = await User.findOne({ _id: req.params.id });
    if (findUser) {
        res.status(200).json(findUser);
    } else {
        res.status(404).json({ errorMessage: 'No Users Found' });
    }
}

exports.SignUp = async (req, res) => {
    const ifEmailAlreadyPresent = await User.findOne({ email: req.body.email });
    const ifUsernameAlreadyPresent = await User.findOne({ username: req.body.username });
    if (ifEmailAlreadyPresent) {
        res.status(201).json({ errorMessage: 'Email already exists. Please try another one.' });
    }
    else if (ifUsernameAlreadyPresent) {
        res.status(201).json({ errorMessage: 'Username already exists. Please try another one.' });
    }
    else {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hash
        });

        const saveUser = await user.save();
        if (saveUser) {
            res.status(200).json({ successMessage: 'Account created successfuly!. Please Sign in.' });
        } else {
            res.status(400).json({ errorMessage: 'Account not created. Please try again' });
        }
    }
}


exports.Login = async (req, res) => {
    const findUser = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.email }]
    });
    if (findUser) {
        const checkPassword = bcrypt.compareSync(req.body.password, findUser.password);
        if (checkPassword) {
            const payload = {
                user: {
                    _id: findUser._id,
                    role: findUser.role
                }
            }
            jwt.sign(payload, config.jwtSecret, (err, token) => {
                if (err) res.status(400).json({ errorMessage: 'Jwt Error' })

                const {
                    _id,
                    role,
                    username,
                    email,
                    DudoCode,
                    Nookpoints,
                } = findUser;
                res.status(200).json({
                    _id,
                    role,
                    username,
                    email,
                    DudoCode,
                    Nookpoints,
                    token,
                    successMessage: 'Logged In Successfully',

                });
            });
        } else {
            res.status(201).json({ errorMessage: 'Incorrect username or password.' })
        }
    }
    else {
        res.status(201).json({ errorMessage: 'Incorrect username or password.' })
    }
}

exports.adminLogin = async (req, res) => {
    const findUser = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.email }]
    });

    if (findUser && findUser.role === 1) {
        const checkPassword = bcrypt.compareSync(req.body.password, findUser.password);
        if (checkPassword) {
            const payload = {
                user: {
                    _id: findUser._id,
                    role: findUser.role
                }
            }
            jwt.sign(payload, config.jwtSecret, (err, token) => {
                if (err) res.status(400).json({ errorMessage: 'Jwt Error' })

                const {
                    _id,
                    role,
                    username,
                    email,
                    DudoCode,
                    Nookpoints
                } = findUser;
                res.status(200).json({
                    _id,
                    role,
                    username,
                    email,
                    DudoCode,
                    Nookpoints,
                    token,
                    successMessage: 'Logged In Successfully',

                });
            });
        } else {
            res.status(201).json({ errorMessage: 'Incorrect username or password.' })
        }

    } else {
        res.status(201).json({ errorMessage: 'Incorrect username or password.' })
    }
}

exports.updateUserByAdmin = async (req, res) => {
    const findUser = await User.findOne({ _id: req.params.id });
    if (findUser) {
        findUser.email = req.body.email;
        findUser.username = req.body.username;
        findUser.role = req.body.role;

        const saveUser = await findUser.save();
        if (saveUser) {
            res.status(200).json({ successMessage: 'User Updated Successfully' })
        } else (
            res.status(400).json({ errorMessage: 'User could not be Updated.' })
        )
    } else {
        res.status(404).json({ errorMessage: 'User code not found.' })
    }
}

exports.updateUsername = async (req, res) => {
    const findUser = await User.findOne({ _id: req.user._id });
    if (findUser) {
        findUser.username = req.body.username;

        const saveUser = await findUser.save();
        if (saveUser) {
            res.status(200).json({ successMessage: 'username Updated Successfully' })
        } else (
            res.status(400).json({ errorMessage: 'username could not be Updated.' })
        )
    } else {
        res.status(404).json({ errorMessage: 'User not found.' })
    }
}


exports.changePassword = async (req, res) => {
    if (req.body.newPassword !== req.body.confirmNewPassword) {
        res.status(400).json({ errorMessage: 'Passwords do not match.' })
    }
    else {
        const findUser = await User.findById({ _id: req.user._id });
        if (findUser) {
            const checkPassword = bcrypt.compareSync(req.body.oldPassword, findUser.password);
            if (checkPassword) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.newPassword, salt);
                findUser.password = hash;
                findUser.save((error, result) => {
                    if (error) {
                        res.status(400).json({ errorMessage: 'Failed to change password' });
                    } else {
                        res.status(200).json({ successMessage: 'Password changed Successfully.' })
                    }
                })
            } else {
                res.status(201).json({ errorMessage: 'Please enter correct old password.' })
            }

        }
    }
}



exports.addUserByAdmin = async (req, res) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: hash,
        role: 0.5
    });

    const saveUser = await user.save();
    if (saveUser) {
        res.status(200).json({ successMessage: 'Account created successfuly!. Please Sign in.' });
    } else {
        res.status(400).json({ errorMessage: 'Account not created. Please try again' });
    }
}




/****************************************************** Forgot Password ***********************************************/
exports.resetPasswordLink = async (req, res) => {
    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            console.log(error);
        }
        const token = buffer.toString("hex");
        User.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                res.status(201).json({ errorMessage: 'Email does not exist' });
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 3600000;
            user.save((err, result) => {
                if (err) {
                    res.status(400).json({ errorMessage: 'Token saving failed' });
                }
                if (result) {
                    let url = '';
                    if (process.env.NODE_ENV === 'production') {
                        url = `https://nookmall.com/update/${token}` // The url of the domain on which you are hosting your frontend in production mode to serve the reset-password link page by sending this link to the email
                    } else {
                        url = `http://localhost:3000/update/${token}`  // The url of the frontend in developement mode to serve the reset-password link page on the frontend by sending this link to the email
                    }
                    sendEmail(req.body.email, "Reset Password Link", `<p>Click this <a href = ${url}>${url}</a> to change your password.</p>`)
                    res.status(200).json({ successMessage: 'Check your Inbox!' });
                }
            })

        })
    })


}

exports.updatePassword = async (req, res) => {
    if (req.body.password !== req.body.confirm) {
        res.status(400).json({ errorMessage: 'Passwords do not match.' })
    }

    else {
        await User.findOne({ resetToken: req.body.token, expireToken: { $gt: Date.now() } }).then(user => {
            if (!user) {
                res.status(201).json({ errorMessage: 'Try again. Session expired!' });
            }
            if (user) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);
                user.password = hash;
                user.resetToken = '',
                    user.expireToken = '',
                    user.save((error, result) => {
                        if (error) {
                            res.status(400).json({ errorMessage: 'Failed to update password' });
                        } else {
                            res.status(200).json({ successMessage: 'Password updated Successfully.' })
                        }
                    })
            }
        });
    }
}


exports.deleteUser = async (req, res) => {
    const deleteUser = await User.findById({ _id: req.params.id })
    if (deleteUser) {
        deleteUser.remove();
        res.status(200).json({ successMessage: `User has been deleted successfully` });
    } else {
        res.status(400).json({ errorMessage: 'User could not be deleted. Please try again' });
    }
}