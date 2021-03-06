var cheerio = require('cheerio');
var debug = require('debug')('starwood');
var trim = require('trim');
var utils = require('./utils');

// Request host
exports.host = 'https://www.starwoodhotels.com/';

// Request rules, contains request.headers
// `all` means this kind of rule will be append to request's option
// in both `GET`, `POST` ,`PUT`, `DELETE` methods.
exports.rules = {
  all: {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,ja;q=0.2,de;q=0.2',
      'Host': 'www.starwoodhotels.com',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
      'Referer': 'https://www.starwoodhotels.com/preferredguest/index.html?language=zh_CN'
    },
    gzip: true,
    json: false
  }
};

exports.routes = {
  // Seach hotels information from SPG's website.
  search: {
    url: '/preferredguest/search/results/detail.html?' + [
      'skinCode=spg',
      'iATANumber=',
      'romanStateProvince=',
      'japanStateProvince=',
      'localeCode={{lang|default("zh_CN")}}', // default lang by `zh_CN`
      'country={{country|default("CN")}}', // default by `CN`
      'stateProvince={{province}}',
      'chinaStateProvince={{province}}', // only support provinces' IDs in China for now.
      'city={{city}}',
      'arrivalDate={{arrivalDate}}',
      'departureDate={{departureDate}}',
      'numberOfRooms=1',
      'numberOfAdults=1',
      'numberOfChildren=0'
    ].join('&'),
    callback: function(err, res, html, next) {
      if (err || res.statusCode !== 200)
        return next(err || new Error('Network error: ' + res.statusCode), html);

      var $ = cheerio.load(html);
      var $results = $('#resultsSecondary');

      if (!$results.length || !$results.find('.property').length)
        return next(new Error('Search results not found'), html);

      var hotels = [];

      $results.find('.property').each(function() {
        var hotel = {};

        if ($(this).attr('propertyid'))
          hotel.id = $(this).attr('propertyid');

        if ($(this).find('.propertyDetail .detailThumb > img').length)
          hotel.thumbnail = $(this).find('.propertyDetail .detailThumb > img').attr('zoomsrc');

        if ($(this).find('.propertyDetail .propLocationInfo .propertyName').length)
          hotel.name = trim($(this).find('.propertyDetail .propLocationInfo .propertyName').text());

        if ($(this).find('.propertyDetail .propLocationInfo .address').length) {
          var $address = $(this).find('.propertyDetail .propLocationInfo .addressContainer');

          hotel.country = $address.find('.country').text();
          hotel.state = $address.find('.state').text();
          hotel.city = $address.find('.city').text();
          hotel.address = $address.find('.addressLine2 .address1').text();
          hotel.fax = $address.find('.phoneFaxContainer .phoneNumber a').text();

          hotel.zipcode = $address.find('.zipCode').length ? 
            utils.escape($address.find('.zipCode').text(),'邮政编码') : null;

          if ($address.find('.spgCategory').length)
            hotel.category = utils.escape($address.find('.spgCategory').text(), 'SPG 俱乐部类别');

          if ($address.find('.description').length) {
            if (!$address.find('.description #layerContent').length)
              hotel.description = trim($address.find('.description').text());
          }
        }

        if ($(this).find('.promoSection').length) {
          var $prices = $(this).find('.promoSection');

          // Best rate as local currency.
          hotel.bestRate = $prices.find('.promos').eq(0).find('.rateAmount').length ? 
            trim(utils.escape($prices.find('.promos').eq(0).find('.rateAmount').text(), 'CNY')) : null;

          // Find out if cash and points could be redeemed.
          hotel.redeemPoints = !!$prices.find('.promos').eq(1).find('.rateAmount').length;
          hotel.redeemCashPoints = !!$prices.find('.promos').eq(2).find('.rateAmount').length;
        }

        debug(hotel);

        hotels.push(hotel);
      });

      return next(null, hotels);
    }
  }
};