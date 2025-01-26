const tokenVerifier = require('/opt/functions/auth/tokenVerifier');
const wareHouseCreator = require('/opt/functions/warehouse/create');  // เรียกใช้ฟังก์ชันจาก Layer

exports.handler = async (event) => {
	try {
		const body = JSON.parse(event.body);
		const token = event.headers.Authorization || event.headers.authorization;
		if (!token) {
			throw new Error('Token not provided');
		}
		const profile = await tokenVerifier.getProfile(token);
		if (profile.role !== 'admin') {
			throw new Error('Unauthorized');
		}


		const payload = {
			name: body.name,
			location: body.location,
			type: body.type
		}

		await wareHouseCreator.create(profile, payload);

		return {
			statusCode: 201,  // ส่งกลับ HTTP status 201 (Created)
			body: "success"
		}

	} catch (error) {
		console.error('Error getting profile:', error);
		return {
			statusCode: 401,  // Unauthorized
			body: JSON.stringify({
				message: 'Could not authenticate user', error: error.message
			})
		}
	}
}