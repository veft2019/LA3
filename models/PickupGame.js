const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    basketballFieldId: { type: String, required: true },
    registeredPlayers: [{ type: Schema.Types.ObjectId, ref: 'Player', required: true }],
    hostId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    deleted: { type: Boolean, default: false }
});
