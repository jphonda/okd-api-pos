const connectToDatabase = require('/opt/services/mongodb');
const Stock = require('/opt/models/stock');
const {ObjectId} = require('mongodb');

module.exports.searchInModelWithStock = async function searchInModelWithStock(Model, prefix, query) {
    try {
        // เชื่อมต่อ MongoDB
        await connectToDatabase();

        // ถ้าไม่มี query parameters, คืนค่าข้อมูลทั้งหมดตาม prefix
        if (!query || !query.search || !query.by) {
            // คืนค่าข้อมูลทั้งหมดที่มี prefix
            return await Model.find({prefix: prefix});
        }

        // กำหนด field ที่ต้องการค้นหาจาก query.by (เช่น name, description)
        const searchField = query.by;


        // สร้าง dynamic query object โดยใช้ [searchField] เป็น key
        const searchQuery = {
            prefix: prefix,
            [searchField]: {$regex: query.search, $options: 'i'}  // ค้นหาข้อความโดยไม่สนตัวพิมพ์เล็กพิมพ์ใหญ่
        };

        // ค้นหา Model ตามเงื่อนไขที่กำหนด
        let results

        if (searchField === '_id') {
            results = await Model.findOne({_id: new ObjectId(query.search)});
        } else {
            results = await Model.find(searchQuery);
        }

        // // ดึงข้อมูล Stock ที่สัมพันธ์กันกับแต่ละ Item
        // await Promise.all(results.map(async (item) => {
        //     const stock = await Stock.findOne({item_id: item._id});
        //     return {
        //         ...item.toObject(),  // แปลงข้อมูล Item ให้เป็น object
        //         stock: stock ? stock.stock : 0, // ถ้ามี stock คงเหลือให้แสดง ถ้าไม่มีให้เป็น 0
        //         volume: stock ? stock.volume : 0
        //     };
        // }));

        return results;


    } catch (error) {
        console.error('Error searching in model with stock:', error);
        throw new Error('Error occurred while searching');
    }
};