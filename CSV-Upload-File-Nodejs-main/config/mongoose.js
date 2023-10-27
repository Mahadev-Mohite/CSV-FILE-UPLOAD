require('dotenv').config()
const mongoose = require('mongoose');

exports.connectMonggose =()=>{
  mongoose.connect('mongodb://127.0.0.1:27017/csvupload', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Database connection successful');
}


// const db = mongoose.connection;
// db.on('error', console.error.bind('error in connecting to the db'));
// db.once('open', function(){
//   console.log('Successfully connected to the DB');
// })