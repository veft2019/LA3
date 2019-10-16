const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  playerId: { type: Schema.Types.ObjectId, required: true , ref: 'Player'},
  pickupGameId: { type: String, required: true , ref: 'PickupGame'}
});
