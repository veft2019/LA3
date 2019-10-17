const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
    name: { type: String, required: true },
    playedGames: [{ type: Schema.Types.ObjectId, ref: 'PickupGame'}],
    deleted: { type: Boolean, default: false }
});
