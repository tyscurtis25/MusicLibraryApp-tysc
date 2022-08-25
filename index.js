const listenPort = 2233;

let express = require('express');

let app = express();

//helps avoid errors, reads the code like it was html, ignoring spaces
app.use(express.urlencoded({ extended: true }));

//allows us to use the "views folder"
app.use(express.static("views"));



//allows ejs to work and render the pages
app.set("view engine", "ejs");

//assigns a port, in the terminal, it will say the phrase in the function
app.listen(listenPort, function () {
    console.log("Hear you loud and clear on port " + listenPort);
});

//connects to our db called music library
let knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./musiclibrary.db"
    },
    useNullAsDefault: true
});

/******************** ROUTES ***********************/

//Redirect so the / goes to the index
app.get("/", (req, res) => {
    res.redirect('/index');
})

//Route for the homepage
app.get("/index", function (req, res) {
    knex.from("Songs").select("*").orderBy("title", "artist", "releaseYear")
        .then(songs => {
            console.log("Number of Songs: " + songs.length);
            res.render("index", { arrayName: songs });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err });
        });
});

//Route for the homepage to go to the add song page
app.get('/addsong', (req, res) => {
    res.render('addsong');
});

//Route to send back to home page and post the new song to database
app.post('/addsong', (req, res) => {
    knex('Songs').insert(req.body).then(songs => {
        res.redirect('/');
    })
});

//Route for the homepage to go to the edit song page
app.get('/editsong/:id', (req, res) => {
    knex('Songs').where('id', req.params.id)
        .then(results => {
            console.log(results);
            res.render("editsong", { arrayName: results });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ err });
        });
});

//Route to send the user back to homepage and post the edits to the database
app.post('/editsong', (req, res) => {
    console.log(req.body.id);
    knex('Songs').where({ id: req.body.id }).update({
        id: req.body.id, title: req.body.title,
        artist: req.body.artist, releaseYear: req.body.releaseYear
    })
        .then(results => {
            console.log(results);
            res.redirect('/');
        })
});

//deleting just one song
app.post('/delSong/:id', (req, res) => {
    knex('Songs').where('id', req.params.id).del()
        .then(songs => {
            res.redirect('/');
        }).catch(err => {
            console.log(err);
            res.status(500).json({ err });
        })
});

//startover button begins
app.post('/startOver/', (req, res) => {
    knex('Songs').del().then(results => {
        console.log('deleted');
    })
        .then(songs => {
            res.redirect('/test');
            console.log(songs);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ err });
        })
});
//route 1 inserts Bohemian Rhapsody
app.get('/test', (req, res) => {
    knex('Songs').insert(
        {title: "Bohemian Rhapsody", artist: "QUEEN", releaseYear: 1975})
        .then(songs => {
            res.redirect('/test2');
            console.log(songs);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ err });
        })
});
//route 2 inserts Don't Stop Believing
app.get('/test2', (req, res) => {
    knex('Songs').insert(
        {title: "Don't Stop Believing", artist: "JOURNEY", releaseYear: 1981})
        .then(songs => {
            res.redirect('/test3');
            console.log(songs);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ err });
        })
});
//route 3 inserts Hey Jude
app.get('/test3', (req, res) => {
    knex('Songs').insert(
        {title: "Hey Jude", artist: "BEATLES", releaseYear: 1968})
        .then(songs => {
            res.redirect('/');
            console.log(songs);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ err });
        })
});