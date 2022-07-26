const express = require("express");
const dataReportController = require("./controllers/dataReportController")
const router = express.Router();
const cors = require("cors");


router.use(cors());

router.get('/', dataReportController.home);
router.post('/downloadSlots', dataReportController.confirm);
router.get('/getSlotGraphData', dataReportController.graph);

module.exports = router;
