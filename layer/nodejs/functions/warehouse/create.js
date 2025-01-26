const connectToDatabase = require('/opt/services/mongodb');
const Warehouse = require('/opt/models/warehouse');

const warehouseCreator = {
	async create(profile, payload) {
		try {
			await connectToDatabase();
			console.log('Payload:', payload);
			const {name, address, location} = payload;
			const warehouseData = new Warehouse();
			warehouseData.prefix = profile.prefix;
			warehouseData.name = name;
			warehouseData.address = address;
			warehouseData.location = location;
			await warehouseData.save();
		} catch (error) {
			return {
				message: 'Could not authenticate user'
			}
		}
	}
}

module.exports = warehouseCreator;