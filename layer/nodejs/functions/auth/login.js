const connectToDatabase = require('/opt/services/mongodb');
const User = require('/opt/models/user');
const jwt = require('jsonwebtoken');

// A separate function for verifying the password
function verifyPassword(user, password) {
	if (user.password !== password) {
		throw new Error('Invalid password');
	}
}

async function authenticateUser(email, password) {
	try {
		await connectToDatabase();
		const user = await User.findOne({email});
		console.log('user', user);

		if (!user) {
			throw new Error('Invalid email');
		}

		verifyPassword(user, password);  // Using the extracted function

		const token = jwt.sign({userId: user._id, email: user.email},
			process.env.JWT_SECRET,
			{expiresIn: '1h'});
		user.token = token;
		await user.save();

		return {
			token: user.token,
			email: user.email,
			name: user.name,
			message: 'Login successful'
		};

	} catch (error) {
		console.error('Authentication error occurred:', error);
		throw new Error('Could not authenticate user');
	}
}

module.exports = {authenticateUser};