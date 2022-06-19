const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")


mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
},
  (err, client) => {
      module.exports = client
      const app = require('./backend')
      app.listen(process.env.PORT)
      console.log(`server running on port ${process.env.PORT}`);
  }
);
