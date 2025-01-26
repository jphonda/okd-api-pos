const connectToDatabase = require('/opt/services/mongodb');
const Product = require('/opt/models/product');

module.exports.searchProducts = async function searchProducts(prefix, query) {
    try {
        // เชื่อมต่อ MongoDB
        await connectToDatabase();
        if (!query || !query.search || !query.by) {
            return await Product.find({prefix: prefix});
        }

        const searchField = query.by;

        const searchQuery = {
            prefix: prefix,
            [searchField]: {$regex: query.search, $options: 'i'}  // ค้นหาข้อความโดยไม่สนตัวพิมพ์เล็กพิมพ์ใหญ่
        };

        const products = await Product.find(searchQuery);
        return products;

    } catch (error) {
        console.error('Error searching products:', error);
        throw new Error('Error occurred while searching products');
    }
}