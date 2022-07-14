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

// const deosSchema = new Schema({
//   Date: Date,
//   Data: {sec: {sensor: Number}}
// });



const deosSchema = new Schema({
  Date: String,
  Time: String,
  Value: Number,
  Timestamp: Date
});


const deosData = mongoose.model("deosData", deosSchema);

const RATempData = mongoose.model("RATemp", deosSchema);
const RAHumidData = mongoose.model("RAHumid", deosSchema);
const RACO2Data = mongoose.model("RACO2", deosSchema);
const TempData = mongoose.model("Temperature", deosSchema);
const HumidityData = mongoose.model("Humidity", deosSchema);
const PM25Data = mongoose.model("PM2.5", deosSchema);
const VOCData = mongoose.model("VOC", deosSchema);
const CO2Data = mongoose.model("C02", deosSchema);
const RATemp249Data = mongoose.model("RATemp249", deosSchema);

const TestData = mongoose.model("test", deosSchema);

const DataList = [
  RATempData,
  RAHumidData,
  RACO2Data,
  TempData,
  HumidityData,
  PM25Data,
  VOCData,
  CO2Data//,
  //RATemp249Data
];


const allSlots = [
  { id: 1, name: 'RATemp', db: RATempData, url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=1&datentyp=5&bezeichnung=%22RA%20Temp%22&trenner=,' },
  { id: 2, name: 'RAHumid', db: RAHumidData, url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=2&datentyp=5&bezeichnung=%22RA%20Humid%22&trenner=,'},
  { id: 3, name: 'RACO2', db: RACO2Data, url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=3&datentyp=5&bezeichnung=%22RA%20CO2%22&trenner=,' },
  { id: 4, name: 'Temperature', db: TempData, url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=4&datentyp=5&bezeichnung=%22Temperature%22&trenner=,'},
  { id: 5, name: 'Humidity', db: HumidityData, url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=5&datentyp=5&bezeichnung=%22Humidity%22&trenner=,'},
  { id: 6, name: 'PM2.5', db: PM25Data, url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=6&datentyp=5&bezeichnung=%22PM2.5%22&trenner=,'},
  { id: 7, name: 'VOC', db: VOCData, url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=7&datentyp=5&bezeichnung=%22VOC%22&trenner=,'},
  { id: 8, name: 'C02', db: CO2Data, url: 'http://deos.asuscomm.com/cgi-bin/cosmobdf.cgi?module=trend&function=117&slotno=8&datentyp=5&bezeichnung=%22C02%22&trenner=,'}
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

  let maxCount = 9;
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
  console.log('get slots', slotNames);
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

   const downloadSlots = [];

   for(let slot of selectedSlots) {
       downloadSlots.push(allSlots[slot-1]);
     }

  // downlolad slot to local CSV files
   downloadDataIntoDatabase(downloadSlots);
   //addCSVDataIntoDatabase(downloadSlots[0]);
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
    for (let i = 0; i < allSlots.length; i++) {
      //let dbName = name[i].replace(/ /g, '');
      //console.log(DataList[i].collectionName);
      if(allSlots[i].name == slot.name) {
      let dbName = allSlots[i].db.collection.collectionName;
      console.log('model', allSlots[i].name);
      console.log('slot', slot.name);
      console.log(allSlots[i].db.collection.collectionName);



      const filePath = path.join(__dirname, "../csv/" + allSlots[i].db.modelName);
      let command = `mongoimport -d deosDB -c ${dbName} --drop --file "${filePath}.csv" --type=csv --parseGrace skipRow --fields="Date.string(),Time.string(),Value.double()" --columnsHaveTypes`;
      console.log('command', command);
      //let command = "mongoimport -d deosDB -c " + dbName + " --drop --file \"" + __dirname + "\\" + name[i] + ".csv\" --type=csv --parseGrace skipRow --fields=\"Date.string(),Time.string(),Value.double()\" --columnsHaveTypes ";
      exec(command, (err, stdout, stderr) => {
        if (err)
          console.log(err);
      });
    }
  }
    setTimeout(deleteHeaderAndAddDateFromDB, 5000, slot);

}

function deleteHeaderAndAddDateFromDB(slot)
{
  console.log('delete header from db', slot.name);
  console.log('Converting and adding timestamp to db', slot.name);
  for (let i = 0; i < DataList.length; i++) {
        if(DataList[i].modelName == slot.name) {

      // delete header in db
      DataList[i].deleteOne( {Value: {$exists: false}}, err => {
        if (err)
          console.log(err);
      }).then(result => {
        console.log(result);
      });

      // add Date object in db
      DataList[i].find({}).then(datas => {
        datas.forEach(data => {

          let strDate = data.Date.split('-');
          let strTime = data.Time.split(':');

          let date = new Date(strDate[2], strDate[0], strDate[1], strTime[0], strTime[1], strTime[2], 0);

           DataList[i].updateOne( {_id: data._id}, [
             { $addFields: {Timestamp: date} }], err => {
               if(err)
               console.log(err);
             });
          });
      });
    }
  }
}

DataReport.querySlotGraphData = async(query) => {
  console.log('query slot graph', query);

  let time = query.time;
  let date = query.date;

  // let date = new Date();
  // console.log('date', date.toLocaleDateString());
  // console.log('time', date.toJSON());

  for(let slot of allSlots) {
    if(slot.id == query.id)
    {
      //console.log(slot);

      if(time !== undefined && date !== undefined) {
        try {
          console.log(date);
          console.log(time);
          const collection = await slot.db.find(
            { Date: date, Time:  { $gte :  time, $lte: '18:00:00' } }, null, {
            limit: 150
          }).sort().exec();
          console.log(collection)
          return collection;
        } catch (err) {
          console.log('err', err);
          return err;
        }
      }
      else {
        try {
          const collection = await slot.db.find(
            { }, null, {
            limit: 150
          }).sort({_id: -1}).exec();
          console.log(collection);
          return collection.reverse();
        } catch (err) {
          console.log('err', err);
          return err;
        }
      }

    }
  }
}

module.exports = DataReport;

// db.getCollection('ratemps').find(  {
//     Date: '07-09-2022',Time:  { $gte :  '14:00:00', $lte : '14:30:00'} })

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
