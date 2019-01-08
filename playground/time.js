const moment = require('moment');

var date = new Date().getTime();
console.log(date);

console.log(moment());
console.log(moment().valueOf());
console.log(moment().format('h:mm a'));