const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findByEmail(email);

      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  'office365',
  new OIDCStrategy(
    {
      clientID: process.env.OFFICE365_CLIENT_ID,
      clientSecret: process.env.OFFICE365_CLIENT_SECRET,
      callbackURL: process.env.OFFICE365_CALLBACK_URL,
      identityMetadata: `https://login.microsoftonline.com/${process.env.OFFICE365_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      responseType: 'code',
      responseMode: 'form_post',
      redirectUrl: process.env.OFFICE365_REDIRECT_URL,
      allowHttpForRedirectUrl: true,
      passReqToCallback: false,
      scope: ['openid', 'profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Verificar y crear/actualizar usuario en la base de datos
        const user = await User.findOrCreateFromOffice365Profile(profile);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
