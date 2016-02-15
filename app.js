var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var numcpus = require('os').cpus().length;
var util = require('util');
//var connectionString = 'postgres://localhost:5432/dvdrental';
//var connectionString = 'postgres://postgres:forob1nc.@localhost/dvdrental';
var msg = 'welcome to my api ';

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var actorRouter = express.Router();
actorRouter.route('/actor')
    .post(function(req, res) {
        var data = req.body;
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
//           client.query("INSERT INTO actor(first_name, last_name) values($1, $2) returning *",
//            client.query("INSERT INTO actor values(DEFAULT, $1, $2)",
//                [data.first_name, data.last_name],
//              client.query("select actor_insert($1, $2)", [data.first_name, data.last_name],
//              client.query("select actor_insert_json($1)", [data],
              client.query("select * from actor_post($1)", [data],
                function (err, results) {
                done();
                if (err)
                    res.status(500).send(err);
                else
                    res.status(201).send(results);
            })
        })
    })
    .get(function(req, res) {
//      var responseJson = {hello: "this is my api"};
//      res.json(responseJson);
//      var results = [];
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
          client.query("SELECT * from actor", function(err, results) {
          done();
          if (err)
            res.status(500).send(err);
          else
            res.send(results);
          msg = '2nd message ';
        })
      })
    });
actorRouter.route('/actor/:actorid')
    .put(function(req, res) {
        var data = req.body;
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            client.query("UPDATE actor SET first_name=($1), last_name=($2), last_update=DEFAULT WHERE actor_id=($3)",
                [data.first_name, data.last_name, req.params.actorid],
                function (err, results) {
                    done();
                    if (err)
                        res.status(500).send(err);
                    else
                        res.send(results);
                })
        })
    })
    .delete(function(req, res) {
//        var data = req.body;
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            client.query("DELETE FROM actor WHERE actor_id=($1)", [req.params.actorid],
                function (err, results) {
                    done();
                    if (err)
                        res.status(500).send(err);
                    else
                        res.send(results);
                })
        })
    })
    .get(function(req, res) {
//      var responseJson = {hello: "this is my api"};
//      res.json(responseJson)
//      var results = [];
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//        res.send(req.params.actorid);
        client.query("SELECT * from actor where actor_id = " + req.params.actorid, function(err, results) {
        done();
        if (err)
          res.status(500).send(err);
        else
          res.send(results);
        })
      })
    });

var addressRouter = express.Router();
addressRouter.route('')
    .get(function(req, res) {
//      var responseJson = {hello: "this is my api"};
//      res.json(responseJson);
//      var results = [];
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query("SELECT * from address", function(err, results) {
        done();
        if (err)
          res.status(500).send(err);
        else
          res.send(results);
        })
      })
    });

var categoryRouter = express.Router();
categoryRouter.route('')
    .get(function(req, res) {
//      var responseJson = {hello: "this is my api"};
//      res.json(responseJson);
//      var results = [];
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query("SELECT * from category", function(err, results) {
        done();
        if (err)
          res.status(500).send(err);
        else
          res.send(results);
        })
      })
    });

app.use('/api', actorRouter);
app.use('/api/address', addressRouter);
app.use('/api/category', categoryRouter);

app.get('/', function(req, res) {
//  res.send('welcome to my api');
  res.send(msg + numcpus + ' ' + process.env.web_memory);
  res.send(process.memoryusage());
  res.send(util.inspect(process.memoryusage()));
});

app.listen(port, function() {
  console.log('Running on Port: '+ port)
});