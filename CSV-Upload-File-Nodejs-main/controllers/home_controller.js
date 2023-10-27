const CSVFile = require('../models/mongoose');
const fs = require('fs');
const path = require('path');
const papa = require('papaparse');


//render homepage
module.exports.homePage = async (req, res) => {
  let files = await CSVFile.find({});
  res.render('home',{
    title: 'CSV Upload | Home',
    files: files
  });
 
}

//create and parse CSV
module.exports.uploadFile = (req, res) => {

  CSVFile.uploadedCSV(req, res, async function(err){
    try{

      let csvFile = await CSVFile.findOne({name:req.file.originalname});
      if(csvFile){
        req.flash('error', 'CSV already exists! 😧')
        return res.redirect('back');
      }

      //parsing CSV using papaparse
      const CSVFileUP = req.file.path;
      const csvData = fs.readFileSync(CSVFileUP, 'utf8');

      const conversedFile = papa.parse(csvData, { 
        header: false 
      
      });

      //allowing only CSV input type
      if(req.file && req.file.mimetype == 'text/csv'){
        //inserting the converted JSON to DB
        let csvFile = CSVFile.create({
          name: req.file.originalname,
          file: conversedFile.data
        });
        req.flash('success', 'CSV uploaded successfully 🤙');
        return res.redirect('back');
      }else{
        req.flash('error', 'only CSV file allowed');
        return res.redirect('back');
      }


    }catch(err){
      //cathching errors and rendering common error page in the FE along with notification
      console.log("error", err);
      req.flash('error', 'something went wrong ☹️');
      return res.render('servererror');
      
      
    }
  })
}

//display CSV Data
module.exports.displayCSV = async (req, res) => {
  let displayData = await CSVFile.findById(req.params.id);
  return res.render('table',{
    title: 'CSV Upload | Details',
    file: displayData.name,
    keys: displayData.file[0],
    results: displayData.file
  })
};

//delete CSV from DB
module.exports.deleteCSV = async (req, res) => {
  let deleteCSV = await CSVFile.findByIdAndDelete(req.params.id);
  req.flash('success', 'CSV removed successfully 🤘');
  return res.redirect('back');
}