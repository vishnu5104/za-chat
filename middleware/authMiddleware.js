const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');

const authorization = async (req, res, next) => {
    try {

        // Extract token from authorization header (Bearer <token>)

        const token = req.headers['authorization'].split(' ')[1];

        logger.info('bear token',token);
        if (!token) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        jwt.verify(token, 'your-secret-key', (err, decoded) => {
            if (err) {
                
                logger.error(`Invalid Token: ${err.message}`);
                return res.status(401).json({ message: 'Invalid token' });
            } else {


                // If token is valid, you can optionally attach the decoded payload to the request object
                req.user = decoded;
                logger.info('Token verified successfully');
                next();
            }
        });
    } catch (error) {
        logger.error(`Authorization Error: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authorization;