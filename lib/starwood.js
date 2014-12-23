var SDK = require('sdk');
var cheerio = require('cheerio');

var host = 'https://www.starwoodhotels.com/preferredguest';
var apis = {
  search: {
    url: [
      '/search/results/detail.html?',
      'skinCode=spg&',
      'localeCode=zh_CN&',
      'country=CN&',
      'stateProvince={{province}}&',
      'chinaStateProvince={{province}}&', // only support provinces' IDs in China
      'city={{city}}',
      'arrivalDate=' + dataUtils.now() + '&',
      'departureDate=' + dataUtils.tomorrow() + '&',
      'numberOfRooms=1',
      'numberOfAdults=1',
      'numberOfChildren=0'
    ].join(''),
    callback: function(err, res, html) {
      
    }
  }
};

module.exports = new SDK(host, apis, true); // init by now
