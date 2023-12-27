const jsonwebtoken = require('jsonwebtoken');
// Creating Token
const createToken = (user) => {
    // Create an random number
    let randNum = (1000 + Math.random() * 9000).toFixed(0)
    // Create the token with json web token
    const token = jsonwebtoken.sign({
        user,
        randNum
    }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    });
    return { token, randNum };
}

module.exports = createToken;