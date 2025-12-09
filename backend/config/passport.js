const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Debug: Log profile data
        console.log('Google Profile:', {
          id: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value,
          photos: profile.photos,
          pictureUrl: profile.photos?.[0]?.value
        });

        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Update last login and picture
          user.lastLogin = new Date();
          if (profile.photos && profile.photos[0] && profile.photos[0].value) {
            user.picture = profile.photos[0].value;
            console.log('Updated user picture:', user.picture);
          } else {
            console.log('No picture in profile.photos');
          }
          await user.save();
          return done(null, user);
        } else {
          // Check if user exists with same email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            if (profile.photos && profile.photos[0] && profile.photos[0].value) {
              user.picture = profile.photos[0].value;
              console.log('Linked user picture:', user.picture);
            }
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          } else {
            // Create new user
            const pictureUrl = profile.photos && profile.photos[0] && profile.photos[0].value 
              ? profile.photos[0].value 
              : null;
            console.log('Creating new user with picture:', pictureUrl);
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              picture: pictureUrl,
              lastLogin: new Date(),
            });
            return done(null, user);
          }
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

