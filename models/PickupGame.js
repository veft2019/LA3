const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
    location: { type: Schema.Types, ref: 'BasketballField', required: true },
    registeredPlayers: [{ type: String, required: true }],
    host: { type: Schema.Types, ref: 'Player', required: true }
});
