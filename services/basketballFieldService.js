/*
Should contain logic to connect to the web service and return data, either by using promises or providing callbacks
 */
const request = require('request');

const allBasketBallField_db = request.get('https://basketball-fields.herokuapp.com/api/basketball-fields', {json: true}, (err, res, body) => {
    if(err) {
        return console.log(err);
    }
    return body;
})

const fieldById_db = (id) => {
    return data.response.body.find(s => s.id === id);
}

module.exports = {
    allBasketBallField_db,
    fieldById_db
}
