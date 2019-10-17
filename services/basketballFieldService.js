/*
Should contain logic to connect to the web service and return data, either by using promises or providing callbacks
 */
const request = require('request');

const data = request.get('https://basketball-fields.herokuapp.com/api/basketball-fields', {json: true}, (err, res, body) => {
    if(err) {
        return console.log(err);
    }
    console.log(body);
    return body;
})

const fieldById = (id) => {
    return data.response.body.find(s => s.id === id);
}

module.exports = {
    basketBallField_db: data,
    fieldById
}
