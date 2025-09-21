const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const User = require('../models/user');


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ providerId: profile.id, provider: 'google' });
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                provider: 'google',
                providerId: profile.id
            });
        }
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}));


passport.use(new OIDCStrategy({
    identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: process.env.MICROSOFT_CALLBACK_URL,
    allowHttpForRedirectUrl: true,
    scope: ['profile', 'email', 'openid']
}, async (iss, sub, profile, accessToken, refreshToken, done) => {
    try {
        if (!profile) return done(null, false);
        let user = await User.findOne({ providerId: profile.oid, provider: 'microsoft' });
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile._json.preferred_username,
                provider: 'microsoft',
                providerId: profile.oid
            });
        }
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}));
