const jwt = require('jsonwebtoken');
const SecretKey = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
    const token = req.headers["token"];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    };
    try {
        const decodedToken = jwt.verify(token, SecretKey);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = verifyToken;