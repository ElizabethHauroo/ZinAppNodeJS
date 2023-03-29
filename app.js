require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./models/user');
const Song = require('./models/song');
const path = require('path');
const { checkAuthenticated, checkNotAuthenticated } = require('./middleware/authMiddleware');
const flash = require('connect-flash');

// Connect to the cloud database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
// Use EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('views'));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
app.use(flash());

// Passport authentication configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Routes Middlewear

app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/admin', (req, res) => {
    res.render('admin');
  });
  
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
  });
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), async (req, res) => {
    if (req.body.username === "admin" && req.body.password === "adminpassword") {
        req.user.isAdmin = true;
        await req.user.save();  
      
      // Redirect to admin page

        res.redirect('/admin');
      } else {
        
        res.redirect('/');
      }
  });
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register');
  });
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const user = await User.register(new User({ username: req.body.username }), req.body.password);
      passport.authenticate('local')(req, res, () => {
        res.redirect('/');
      });
    } catch (e) {
      res.redirect('/register');
    }
  });
  
  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.sendStatus(500);
      }
      res.redirect('/');
    });
  });

  // SONGS CRUD

  //create
  app.post('/songs', isAuthenticated, async (req, res) => {
    const song = new Song({
      userId: req.user.id,
      title: req.body.title,
      style: req.body.style
    });
  
    try {
      const savedSong = await song.save();
      res.redirect('/songs/' + savedSong.id);
    } catch (err) {
      console.error('Error creating song:', err);
      res.status(500).send('Error creating song');
    }
  });

    //read (filtered by user)
    app.get('/songs', isAuthenticated, async (req, res) => {
      try {
        const songs = await Song.find({ userId: req.user.id });
        res.render('songs', { songs });
      } catch (err) {
        console.error('Error fetching songs:', err);
        res.status(500).send('Error fetching songs');
      }
    });

    // Create new song form
app.get('/songs/create', (req, res) => {
  res.render('create-song', { title: 'Create a New Song' });
});

  app.get('/songs/:id([a-fA-F0-9]{24})', isAuthenticated, async (req, res) => {
    try {
      const song = await Song.findOne({ _id: req.params.id, userId: req.user.id });
      if (!song) {
        res.status(404).send('Song not found');
      } else {
        res.render('song', { song });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching song');
    }
  });

  //Edit

  app.get('/songs/:id([a-fA-F0-9]{24})/edit', isAuthenticated, async (req, res) => {
    try {
      const song = await Song.findOne({ _id: req.params.id, userId: req.user.id });
      if (!song) {
        res.status(404).send('Song not found');
      } else {
        res.render('editSong', { song });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching song');
    }
  });


    //update
    app.post('/songs/:id([a-fA-F0-9]{24})/update', isAuthenticated, async (req, res) => {
      try {
        const updatedSong = await Song.findOneAndUpdate(
          { _id: req.params.id, userId: req.user.id },
          {
            title: req.body.title,
            style: req.body.style
          },
          { new: true }
        );
        res.redirect('/songs/' + updatedSong.id);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error updating song');
      }
    });

      
  //delete

  app.post('/songs/:id([a-fA-F0-9]{24})/delete', isAuthenticated, async (req, res) => {
    try {
      await Song.deleteOne({ _id: req.params.id, userId: req.user.id });
      res.redirect('/songs');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting song');
    }
  });

  //read admin
  app.get('/admin/songs', async (req, res) => {
    try {
      const songs = await Song.find();
      res.render('adminSongs', { songs });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching songs');
    }
  });

  app.get('/all-users', async (req, res) => {
    try {
      const users = await User.find({});
      res.render('all-users', { users });
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  });
  /* delete user by id
  app.post('/delete-user/:id', async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.redirect('/all-users');
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  });*/

  app.delete('/users/delete/:id', async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.redirect('/all-users');
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
});

  
  //checking for user/admin access 

  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
  
  function isAdmin(req, res, next) {
    if (req.user && req.user.username === "admin") {
      return next();
    }
    res.status(403).send('Access Denied. Admins Only');
  }
  
  

//const port = process.env.PORT || 3000;
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});   

// Add a route to stop the server
app.get('/stop', (req, res) => {
    port.close(() => {
      console.log('Server stopped listening on port 3000');
      res.send('Server stopped');
    });
  });

//end Routes

