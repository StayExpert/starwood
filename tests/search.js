var starwood = require('..');

describe('#Starwood', function() {
  describe('#Search', function() {
    it('Should return correct search results', function(done) {
      starwood.search({
        country: 'CN',
        province: 'CNHP',
        city: 'Sanya',
        arrivalDate: now(),
        departureDate: tomorrow()
      }, function(err, hotels) {
        if (err)
          return done(err);

        done();
      });
    });
  });
});