const DataReport = require("../models/DataReport");


exports.home = (req, res) => {

  DataReport.getSlots(req).then(response => {
    res.send(response);
  });

};

exports.confirm = (req, res) => {
  console.log('post',req.body);
  DataReport.downloadDataAndAddToDB(req.body);
  //res.redirect("/");
}
