import express from 'express';

import User from '../Modules/usersValue.js';
import { registrationValidate, loginValidate } from '../validation.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import verify from './verifyToken.js';
import { Roles, AuthRoles } from '../Roles/index.js';

const Route = express.Router();

Route.get('/', AuthRoles(Roles.ADMIN), async (req, res) => {
    try {
        const getUser = await User.find();
        res.send(getUser);
    } catch (err) {
        res.send(err)
    }

})
Route.post('/register', async (req, res) => {
    // res.send('User Router');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const { error } = registrationValidate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    const emailExit = await User.findOne({ email: req.body.email });
    if (emailExit) return res.status(400).send({ error: 'Email already exists' });
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: 'ADMIN_ROLE',
    })
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.send(err)
    }

})
Route.post('/login', async (req, res) => {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const { error } = loginValidate(req.body);
    if (error) return res.status(401).send({ error: error.details[0].message });
    // Check email in database
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).send({ error: 'Email or password is wrong' });
    const passwordExit = await bcrypt.compare(req.body.password, user.password);
    if (!passwordExit) return res.status(401).send({ error: 'Password is wrong' });
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_JSON);
    res.header('auth_token', token).send({ user, token })
})

export default Route;