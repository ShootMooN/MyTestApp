var AV = require('leanengine');
var Session = AV.Object.extend('Session');

module.exports = function (session){
  var Store = session.Store;
  var Error = require('errno-codes');


  function LeanStore(options) {
    options = options || {};
    Store.call(this, options);

    this.ttl =  options.ttl;

    this.parseClassName = options.parseClassName || 'Session';
  }

  LeanStore.prototype.__proto__ = Store.prototype;

  LeanStore.prototype.get_ = function(id, callback) {
    var self = this;
    var query = new AV.Query(Session);

    query.equalTo('identity', id);
    query.first({
            success: function (foundSession)
            {
              if (!foundSession)
              {
                callback(Error.get(Error.ENOENT), null);
              }
              else if (foundSession.get('destroyAt') < new Date())
              {
                self.destroy(foundSession, callback)
              }
              else
              {
                callback(null, foundSession);
              }
            },
            error: function (error)
            {
              callback(error, null);
            }
        });
  };

  LeanStore.prototype.get = function(id, callback)
  {
    this.get_(id, function(error, foundSession)
    {
      callback(error, foundSession ? foundSession.get('data') : null);
    });
  };

  LeanStore.prototype.set = function(id, session, callback)
  {
    var self = this;

    this.get_(id, function(error, foundSession) {
      if (!foundSession)
      {
        var newSession = new Session();
        var destroyAt = new Date();

        if (!self.ttl)
        {
          if (typeof session.cookie.maxAge === 'number')
          {
            self.ttl = session.cookie.maxAge / 1000 | 0;
          }
          else
          {
            self.ttl = 86400;
          }
        }

        destroyAt.setSeconds(destroyAt.getSeconds() + self.ttl);

        newSession.set('identity', id);
        newSession.set('data', session);
        newSession.set('destroyAt', destroyAt);

        newSession.save(null, {
          success: function(newSession) {
            callback(null);
          },
          error: function(newSession, error) {
            callback(error);
          }
        });
      }
      else
      {
        foundSession.set('data', session);
        foundSession.save();
        callback(null);
      }
    });
  };

  LeanStore.prototype.destroy = function(session, callback)
  {
    session.destroy({
      success: function(myObject) {
        callback(Error.get(Error.ENOENT), null);
      },
      error: function(myObject, error) {
        callback(error, null);
      }
    });
  };

  return LeanStore;
};
