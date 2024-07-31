

const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const protectRoute = async (req, res, next) => {
	try {
		const token = req.headers['authorization'].split(' ')[1];

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, 'your-secret-key');

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = { protectRoute };