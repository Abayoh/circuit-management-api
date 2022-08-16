const mongoose = require('mongoose');
//mongodb+srv://abayoh:<password>@cluster0.adocr6l.mongodb.net/?retryWrites=true&w=majority
const connectDB = async () => {
  try {
    const password = process.env.MONGODB_PASSWORD;
    const user = process.env.MONGODB_USER;
    const dbName = process.env.MONGODB_DB_NAME;
    const url = `mongodb+srv://${user}:${password}@cluster0.adocr6l.mongodb.net/?retryWrites=true&w=majority`;
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
module.exports = connectDB;
