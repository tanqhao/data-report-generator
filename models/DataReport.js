const http = require('http');
const fs = require('fs');
const path = require('path');
const request = require('request');
const nodemailer = require('nodemailer');

const mongoose = require("mongoose");
const csv = require("csvtojson");
const exec = require("child_process").exec;
const axios = require("axios");

const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const deosSchema = new Schema({
  Date: Date,
  Data: {sec: {sensor: Number}}
});

const deosData = mongoose.model("deosData", deosSchema);

const RATempData = mongoose.model("RATemp", deosSchema);
const RAHumidData = mongoose.model("RAHumid", deosSchema);
const RACO2Data = mongoose.model("RACO2", deosSchema);
const TempData = mongoose.model("Temp", deosSchema);
const HumidityData = mongoose.model("Humidity", deosSchema);
const PM25Data = mongoose.model("PM2.5", deosSchema);
const VOCData = mongoose.model("VOC", deosSchema);
const CO2 = mongoose.model("C02", deosSchema);
const RATemp249Data = mongoose.model("RATemp249", deosSchema);

const DataList = [
  RATempData,
  RAHumidData,
  RACO2Data,
  TempData,
  HumidityData,
  PM25Data,
  VOCData,
  CO2//,
  //RATemp249Data
];

let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;




function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

const nameUrl = "http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&amp;function=130&session=177218149&displaytype=1";

let DataReport = function(){};

DataReport.getSlots = async (req) => {

  let maxCount = 10;
  // Get content in html nameUrl
  let html = httpGet(nameUrl);
  const dom = new JSDOM(html);

  console.log("Counting number of slots ...");

  let counter = 0;
  let slotNames = [];

  // Count number of slots
  for (let i = 0; i < (maxCount - 1); i++) {
    let query = "#slotbez";
    query += (i + 1);

    let queryObj = dom.window.document.querySelector(query);
    // Check for object cause if object does not exist, will error
    if (queryObj) {
      slotNames.push({id: i+1, name: queryObj.textContent})
      counter++;
    }
  }

  return slotNames;
};


/*
6 day data
http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=4&datentyp=5&bezeichnung=%22Temperature%22&trenner=,

Today data
http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=150&slotno4_=%22Temperature%22&datentyp4=5&bezeichnung=%22Temperature%22&zeitvon=19.06.2022%2000:00:00&zeitbis=19.06.2022%2013:36:12&trenner=,&startstop=0
*/

DataReport.downloadDataAndAddToDB = (selectedSlots) => {
console.log('selected', selectedSlots);
  const allSlots = [
    { id: 1, name: 'RATemp', url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=1&datentyp=5&bezeichnung=%22RA%20Temp%22&trenner=,' },
    { id: 2, name: 'RAHumid', url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=2&datentyp=5&bezeichnung=%22RA%20Humid%22&trenner=,'},
    { id: 3, name: 'RACO2', url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=3&datentyp=5&bezeichnung=%22RA%20CO2%22&trenner=,' },
    { id: 4, name: 'Temperature', url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=4&datentyp=5&bezeichnung=%22Temperature%22&trenner=,'},
    { id: 5, name: 'Humidity', url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=5&datentyp=5&bezeichnung=%22Humidity%22&trenner=,'},
    { id: 6, name: 'PM2.5', url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=6&datentyp=5&bezeichnung=%22PM2.5%22&trenner=,'},
    { id: 7, name: 'VO2', url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=7&datentyp=5&bezeichnung=%22VOC%22&trenner=,'},
    { id: 8, name: 'CO2', url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=8&datentyp=5&bezeichnung=%22C02%22&trenner=,'}
  ];

  const allDownloadUrl = [
     "http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=1&datentyp=5&bezeichnung=%22RA%20Temp%22&trenner=,",
     "http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=2&datentyp=5&bezeichnung=%22RA%20Humid%22&trenner=,",
     "http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=3&datentyp=5&bezeichnung=%22RA%20CO2%22&trenner=,",
     "http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=4&datentyp=5&bezeichnung=%22Temperature%22&trenner=,",
     "http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=5&datentyp=5&bezeichnung=%22Humidity%22&trenner=,",
     "http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=6&datentyp=5&bezeichnung=%22PM2.5%22&trenner=,",
     "http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=7&datentyp=5&bezeichnung=%22VOC%22&trenner=,",
     "http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=8&datentyp=5&bezeichnung=%22C02%22&trenner=,"
   ];

   const downloadSlots = [];

   for(let slot of selectedSlots) {
       downloadSlots.push(allSlots[slot-1]);
     }

  // downlolad slot to local CSV files
   downloadDataIntoDatabase(downloadSlots);


}

async function downloadDataIntoDatabase(downloadSlots) {

  let localCSVFileName;
  let errors = [];

  for(let slot of downloadSlots) {
    localCSVFileName = slot.name + '.csv';
    console.log('start downloading :' + localCSVFileName);
    try {

      const response = await downloadPage(localCSVFileName, slot.url);
      console.log(response + localCSVFileName);
      addCSVDataIntoDatabase(slot);
    } catch (error) {
      console.error(localCSVFileName + " ERROR: " + error);
      errors.push(error)
    }
  }

  if (!errors.length) {
    console.log("Sucessfully downloaded all csv files and updated database")
  }
}


function downloadPage(downloadCSVFileName, url, retries = 5, timeoutTime = 300) {
  return new Promise((resolve, reject) => {

    const filePath = path.join(__dirname, "../csv/" + downloadCSVFileName);
    const file = fs.createWriteStream(filePath);


    request(url, (error, response, body) => {
        if (error) reject(error);
        if (response.statusCode != 200) {
          console.log(downloadCSVFileName + " : Failed download. Retries left " + retries);
          if (retries > 0) {
            /* 3 */
            setTimeout(() => {
              return downloadPage(downloadCSVFileName, url, retries - 1, timeoutTime * 2)
            }, timeoutTime)
          } else {
            reject(Error(e))
          }
        }
        //resolve(body);
      })
      .pipe(file)
      .on('finish', () => {
        //storeCSVDataIntoDatabase();
        resolve("Finish download: ");
      });
  });
}

function addCSVDataIntoDatabase(slot) {
  // mongoimport - d deosDB - c ratemps--drop--file "C:\Users\pippy\Documents\Web Development\DataReportGenerator-main\RATemp.csv"--type = csv--parseGrace skipRow--fields = \"Date.date_ms("
  // mm - dd - yyyy "),Time.date_ms("
  // H: mm: ss "),Value.double()\" --columnsHaveTypes
    console.log('start add csv to db', slot.name);
    for (let i = 0; i < DataList.length; i++) {
      //let dbName = name[i].replace(/ /g, '');

      if(DataList[i].modelName == slot.name) {
      let dbName = DataList[i].collection.collectionName;

      const filePath = path.join(__dirname, "../csv/" + DataList[i].modelName);
      let command = `mongoimport -d deosDB -c ${dbName} --drop --file "${filePath}.csv" --type=csv --parseGrace skipRow --fields="Date.string(),Time.string(),Value.double()" --columnsHaveTypes`;
      //let command = "mongoimport -d deosDB -c " + dbName + " --drop --file \"" + __dirname + "\\" + name[i] + ".csv\" --type=csv --parseGrace skipRow --fields=\"Date.string(),Time.string(),Value.double()\" --columnsHaveTypes ";
      exec(command, (err, stdout, stderr) => {
        if (err)
          console.log(err);
      });
    }
  }
    setTimeout(deleteHeaderFromDB, 5000, slot);

}

function deleteHeaderFromDB(slot)
{
  console.log('delete header from db', slot.name);
  for (let i = 0; i < DataList.length; i++) {
      if(DataList[i].modelName == slot.name) {

    DataList[i].deleteOne( {Value: {$exists: false}}, err => {
      if (err)
        console.log(err);
    }).then(result => {
      console.log(result);
    });
  }
}
}

module.exports = DataReport;


// function emailOutputData() {
//   var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'xueli363615@gmail.com',
//       pass: 'basketball2'
//     }
//   });
//
//   let mailOptions = {
//     from: 'xueli363615@gmail.com',
//     to: 'xueli363615@gmail.com',
//     //to: 'xueli363615@gmail.com, desmondzheng82@gmail.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!',
//     attachments: [{
//         filename: 'newfile.txt',
//         contentType: 'text/plain',
//         path: './newfile.txt'
//       },
//       {
//         filename: 'pikachu.png',
//         path: './pikachu.png'
//       }
//     ],
//   };
//
//   transporter.sendMail(mailOptions, function(error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// }
