const connectToDatabase = require('/opt/services/mongodb');
const Orders = require('/opt/models/orders');
const Product = require('/opt/models/product');

module.exports.createOrders = async function createOrders(payload) {
	try {
		await connectToDatabase();
		console.log('Payload:', payload);
		const {profile, body} = payload;


		const Order = {
			prefix: profile.prefix,
			userId: profile.name,
			totalAmount: body.totalAmount,
			status: body.status,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const newOrder = new Orders(Order);
		await newOrder.save();

		return {
			message: 'Order created successfully',
			data: {}
		};


	} catch (error) {
		return {
			message: 'Could not authenticate user'
		};
	}
}
