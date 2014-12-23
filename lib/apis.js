var cheerio = require('cheerio');

exports.host = 'https://www.starwoodhotels.com/preferredguest';
exports.routes = {
  search: {
    url: [
      '/search/results/detail.html?',
      'skinCode=spg&',
      'localeCode=zh_CN&', // hardcode here.
      'country={{country}}&', // todo: default by `CN`
      'stateProvince={{province}}&',
      'chinaStateProvince={{province}}&', // only support provinces' IDs in China for now.
      'city={{city}}',
      'arrivalDate={{arrivalDate}}&',
      'departureDate={{departureDate}}&',
      'numberOfRooms=1',
      'numberOfAdults=1',
      'numberOfChildren=0'
    ].join(''),
    callback: function(err, res, html, next) {
      if (err || res.statusCode !== 200)
        return next(err || new Error('Network err: ' + res.statusCode));

      var $ = cheerio.load(html);
      var $results = $('#resultsSecondary');

      if (!$results.length || !$results.find('.property').length)
        return next(new Error('Search results not found'));

      var hotels = [];

      $results.find('.property').each(function(){
        var hotel = {};

        if ($(this).attr('propertyid'))
          hotel.id = $(this).attr('propertyid');

        if ($(this).find('.propertyDetail .detailThumb > img').length)
          hotel.thumbnail = $(this).find('.propertyDetail .detailThumb > img').attr('zoomsrc');

        if ($(this).find('.propertyDetail .propLocationInfo .propertyName').length)
          hotel.name = $(this).find('.propertyDetail .propLocationInfo .propertyName').text();

        if ($(this).find('.propertyDetail .propLocationInfo .address').length) {
          hotel.address
        }

        hotels.push(hotel);
      });

      return next(null, hotels);
    }
  }
};