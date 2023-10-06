const mongoose = require('mongoose')
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL,  { useNewUrlParser: true });
    // let creat_collectoin = mongoose.model('user',new mongoose.Schema(user));
    console.log(`MongoDB Connected: {conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
module.exports = connectDB;