const DataReport = require("../models/DataReport");


exports.home = (req, res) => {
  console.log('get home', req);
  DataReport.getSlots(req).then(response => {
    res.send(response);
  });

};

exports.confirm = (req, res) => {
  console.log('post downloadslot',req.body);
  DataReport.downloadDataAndAddToDB(req.body);
  //res.redirect("/");
}

exports.graph = (req, res) => {
  console.log('get graph data', req.query);
  DataReport.querySlotGraphData(req.query).then(response => {
    res.send(response)
  })

  //res.redirect("/");
}
