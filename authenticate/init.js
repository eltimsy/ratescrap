
const Strategy = require('passport-local').Strategy
const records = [
      { id: 1, username: 'admin', password: 'superadmin', displayName: 'admin', emails: [ { value: 'admin@example.com' } ] }
    , { id: 2, username: 'crazy', password: 'crazyman', displayName: 'crazy', emails: [ { value: 'crazy@example.com' } ] }
  ];

function findByUsername(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}

function findById(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

module.exports = function(passport) {


  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

  passport.use(new Strategy(
    function(username, password, cb) {
      findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    }));
};