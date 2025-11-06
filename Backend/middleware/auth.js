const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    console.log("Received token: ", token); // Log received token
    
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT: ", decoded);
        req.user = decoded; // direktno postavljanje decoded umesto decoded.user
        next();
    } catch (err) {
        console.log("Token verification failed: ", err); // Dodajte ovaj log
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
