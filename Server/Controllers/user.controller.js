const bcrypt = require("bcrypt");
const User = require('../Models/User.model');
const sendMail = require("../utils/sendMail");
const ejs = require("ejs")
const path = require("path");
const createToken = require("../utils/jwt");
const jwt = require('jsonwebtoken');


// Register the User --> localhost:8000/api/auth/register 
const registerUser = async (req, res) => {
    try {
        // Destructuring the req.body
        const { name, email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please enter an email address" });
        }
        // Check if the user is already registered
        const user = await User.find({ email });
        if (user.length > 0) {
            return res.status(409).json({ message: "User already registered" })
        }

        // hashing the password
        const hashPassword = await bcrypt.genSalt(10).then(salt => bcrypt.hash(password, salt));

        // Creating a new user
        const newUser = {
            name,
            password: hashPassword,
            email
        }

        const activationToken = createToken(newUser);
        const activationCode = activationToken.randNum;
        const data = { user: { name: newUser.name }, activationCode };
        // Render the HTML File 
        await ejs.renderFile(path.join(__dirname, "../Mail/activation_mail.ejs"), data);
        try {
            await sendMail({
                email: newUser.email,
                subject: "Activate your account",
                template: "activation_mail.ejs",
                data,
            });
        } catch (error) {
            return res.status(500).json({ error: error.message, })
        }

        // return the response
        res.status(201).json({
            success: true,
            message: `Please check your email : ${newUser.email} to activate your account`,
            token: activationToken.token,
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Activate the User --> localhost:8000/api/auth/activate 
const activateUser = async (req, res) => {
    try {
        const { activationCode, activationToken } = req.body;
        const newUser = jwt.verify(
            activationToken, process.env.JWT_SECRET
        )
        // validate the activation code
        if (activationCode !== newUser.randNum) {
            return res.status(401).json({ error: "Invalid Validation Code" });
        }
        const { name, email, password } = newUser.user;
        await User.create({
            name,
            email,
            password
        })

        res.status(200).json({
            success: true,
            user: newUser.user
        })


    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};




// Method => POST --> login the User --> localhost:8000/api/auth/login` 
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Please enter an email" });
        }

        // Find the User
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Check the email address
        if (user.email !== email) {
            return res.status(400).json({ error: "Please enter a valid credentials" });
        }

        // Check the password 
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Please enter a valid credentials" });
        }

        const signinToken = createToken(user);

        res.status(200).json({ success: true, token: signinToken.token });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Method => POST --> Signin the User --> localhost:8000/api/auth/sign-in
const signinUser = async (req, res) => {
    try {
        const { email, password } = await req.user?.user

        res.status(200).json({ success: true, user: { email, password } });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

// Method => POST --> Update the User info --> localhost:8000/api/auth/update
const UpdateUser = async (req, res) => {
    try {
        const userId = req.params.id
        console.lof(userId)
        // const user = await User.findById({ userId })
        res.status(200).json({ success: true, });
    } catch (error) {
        res.status(500).json({ error: error });
    }
}



module.exports = { registerUser, loginUser, signinUser, activateUser, UpdateUser }