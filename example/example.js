var starwood = require('..');
var utils = require('../lib/utils');

starwood.search({
  country: 'CN',
  province: 'CNHP',
  city: 'Sanya',
  arrivalDate: utils.today(),
  departureDate: utils.tomorrow()
}, function(err, hotels){
  if (err)
    return console.error(err)

  console.log(hotels);
});
