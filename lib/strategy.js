const OAuth2Strategy = require('passport-oauth2')
const pError = require('./errors/error')
const util = require('util')
const uri = require('url')

/**
 * `Strategy` constructor.
 *
 * The CryPt authentication strategy authenticates requests by delegating to
 * CryPt using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your CryPt application's client id
 *   - `clientSecret`  your CryPt application's client secret
 *   - `callbackURL`   URL to which CryPt will redirect the user after granting authorization
 *
 * Examples:
 *
 *    passport.use(new CryPtStrategy({
 *       clientID: CONSUMER_CLIENT_ID,
 *       clientSecret: CONSUMER_CLIENT_SECRET,
 *       callbackURL: 'https://www.example.net/crypt/oauth/callback',
 *       scope:'profile'
 *     },
 *     function(accessToken, refreshToken, profile, done) {
 *      User.findOne({cryptId:profile.cryptId},(err,user)=>{
 *          if(err) throw err
 *          else if(user){return done(err,user)}
 *          else{
 *              User.create(...,(error,userdoc)=>{
 *                  return done(error,userdoc)
 *              })
 *          }
 *      })
 *     }));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://crypt-oauth.web.app/oauth';
  options.tokenURL = options.tokenURL || 'https://crypt-server.herokuapp.com/oauth/tokenexchange';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'crypt';
  this._userProfileURL = options.userProfileURL || 'https://crypt-server.herokuapp.com/api/userinfo';
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);


Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;
    
    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }
      
      if (json && json.error && json.error.message) {
        return done(new pError(json.error.message, json.error.code));
      } else if (json && json.error && json.error_description) {
        return done(new pError(json.error_description, json.error));
      }
      return done(new Error('Failed to fetch user profile'));
    }
    
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }
    
    
    done(null, json);
  });
}

Strategy.prototype.authorizationParams = function(options) {
  var params = {};
  params['scope'] = options.scope
  return params;
}

Strategy.prototype.tokenParams = function(options){
    let params = {};
    params['client_id'] = options.clientID
    params['client_secret'] = options.clientSecret
    return params
}

module.exports = Strategy;