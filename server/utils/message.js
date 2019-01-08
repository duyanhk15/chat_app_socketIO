const moment = require('moment');

const generateMessage = (from, text) => {
    return {
        from,
        text,
        // createAt: new Date()
        createAt: moment().valueOf()
    }
}

const generateLocationMessage = (from, latitude, longitude) =>{
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createAt: moment().valueOf()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}