# passport-crypt-oauth20

[Passport](http://www.passportjs.org/) strategy for authenticating with [CryPt](https://crypt-oauth.web.app) using the OAuth 2.0 API.

This module lets you authenticate using CryPt in your Node.js applications.

## Install

```
$ npm install passport-crypt-oauth20
```

## Usage

### Create An Application

---

Before using ```passport-crypt-oauth20```, you must register an application with CryPt. If you have not already done so, a new application can be created in the [CryPt Developers Console](https://crypt-oauth.web.app/devconsole). Your application will be issued a client ID and client secret, which need to be provided to the strategy. You will also need to configure a redirect URI which matches the route in your application.

### Configure Strategy

---

The CryPt authentication strategy authenticates users using a CryPt account and OAuth 2.0 tokens. The client ID and secret obtained when creating an application are supplied as options when creating the strategy. The strategy also requires a ```verify``` callback, which receives the access token and optional refresh token, as well as ```profile``` which contains the authenticated user's CryPt profile. The ```verify``` callback must call ```cb``` (done is used as cb in following code snippet) providing a user to complete authentication.

```JavaScript
const CryPtStrategy = require('passport-crypt-oauth20')

passport.use(new CryPtStrategy({
         clientID: CONSUMER'S_CLIENT_ID,
         clientSecret: CONSUMER'S_CLIENT_SECRET,
         callbackURL: 'http://example.com/crypt/oauth/callback',
         scope:'profile'
       },
       function(accessToken, refreshToken, profile, done) {
        User.findOne({cryptId:profile.cryptId},(err,user)=>{
            if(err) throw err
            else if(user){return done(err,user)}
            else{
                User.create({...profile,
                    access_token:accessToken,
                    refersh_token:refreshToken
                },(error,userdoc)=>{
                    return done(error,userdoc)
                })
            }
        })
       }
     ));
```

### Authenticate Requests

---

Use ```passport.authenticate()```, specifying the 'crypt' strategy, to authenticate requests.

For example, as route middleware in an [Express](expressjs.com) application:

```JavaScript
app.get('/crypt/oauth/login',passport.authenticate('crypt'))

app.get('/crypt/oauth/callback', 
  passport.authenticate('crypt', { failureRedirect: '/loginfail',successRedirect:'/protected' }))

```