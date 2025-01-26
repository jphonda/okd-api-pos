const connectToDatabase = require('/opt/services/mongodb');
const Orders = require('/opt/models/orders');
const Stock = require('/opt/models/stock');
const {ObjectId} = require('mongodb');
const StockHistory = require('/opt/models/stock-history');

module.exports.updateOrder = async function updateOrder(payload) {
	try {
		await connectToDatabase();

		const {profile, body, id} = payload;
		console.log('Body:', body);
		console.log('ID:', id);
		console.log('Profile:', profile);

		const order = await Orders.findOne({_id: new ObjectId(id)});
		console.log('Order:', order);

		const stock = await Stock.findOne({_id: new ObjectId(body.stockId)});
		console.log('Stock:', stock);

		const stockHistory = new StockHistory();

		order.formula = order.formula.map(item => {
			if (item.id === body.stockId && item.status !== 'completed') {
				const updatedStock = parseInt(stock.volume) - parseInt(item.volume);
				stockHistory.volume = item.volume; // บันทึกปริมาณที่ใช้
				stockHistory.order_id = order._id;
				stockHistory.stock_id = stock._id;
				stockHistory.prefix = profile.prefix;
				stock.volume = updatedStock.toString(); // แปลงกลับเป็น string
				return {...item, status: 'completed'}; // เพิ่ม/อัปเดต status
			}
			return item;
		});

		await stockHistory.save();
		await stock.save();
		await order.save();

		return {
			message: 'Order updated successfully .',
		};

	} catch (error) {
		return {
			message: 'Order update already .'
		}
	}
}
