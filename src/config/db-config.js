const mongoose = require('mongoose');

const connectDB = async()=>{
    try {
        const password = process.env.MONGODB_PASSWORD;
        const user = process.env.MONGODB_USER;
        const dbName = process.env.MONGODB_DB_NAME;
        const url = `mongodb+srv://${user}:${password}@${dbName}.dxltl.mongodb.net/${dbName}?retryWrites=true&w=majority`;
        const conn = await mongoose.connect(url, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
module.exports = connectDB;