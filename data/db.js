// The connection to the MongoDB database. The database should be accessible via the context

const pickupGameSchema = require('../models/PickupGame');
const playerSchema = require('../models/Player');

const mongoose = require('mongoose');

const connection = mongoose.createConnection("mongodb://veftdbuser:Abc12345@ds137643.mlab.com:37643/hoop-dreams", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
},
    () => {
        console.log("MongoDb connected");
    }
);

module.exports = {
    PickupGame: connection.model('PickupGame', pickupGameSchema),
    Player: connection.model('Player', playerSchema),
};
