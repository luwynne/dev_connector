const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async() => {
    try{
      await mongoose.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex:true
      });  
      console.log('MongoDB connected');
    }catch(err){
        console.error(err.message);
        process.exit(1); // failling the application if the DB doesnt start
    }
}

module.exports = connectDB;