const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const router = express.Router();
const bodyParser = require("body-parser");

const app = express();
let MongoClient = require('mongodb').MongoClient;
const sha1 = require('sha1');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(4000, () => {
  console.log("port 4000");
});

MongoClient.connect("mongodb://localhost/user_pool", function(error, db) {
  if (error) throw console.log('Connection failed')
  console.log("Connection successfull");
  db.close();
});

//Routes
app.use("/user", router);

router.route('/create').post(function (request, response) {
  let login = request.body.login
  let email = request.body.email
  let password = sha1(request.body.password)
  console.log(request.body)

  if (login.length === 0 || email.length === 0 || password.length === 0) {
    response.status(400).send({msg: 'empty'});
  } else {
    MongoClient.connect('mongodb://localhost/', function (error, db) {
      if (error) throw console.log('Connection failed')

      let dbo = db.db('user_pool')
      let verifLogin = {login: login}

      dbo.collection('membre').find(verifLogin).toArray(function (err, result) {
        if (err) throw err
        if (result.length === 0) {
          let insert = {id: 1, login: login, email: email, password: password, type: false}
          dbo.collection('membre').insertOne(insert, function (err, res) {
            if (err) throw err
            console.log(res)
            db.close()
            //res.redirect('/membre')
            response.status(200).send({msg: 'ok'})
          })
        } else {
          console.log('Ce login existe déjà')
          response.status(400).send('loginExist');
        }
      })
    })
  }
})

router.route('/login').post(function (request, response) {
  let login = request.body.login
  let password = sha1(request.body.password)

  if (login.length === 0 || password.length === 0) {
    response.status(400).send({msg: 'empty'});
  } else {
    MongoClient.connect('mongodb://localhost/', function (error, db) {
      if (error) throw console.log('Connection failed')
      let dbo = db.db('user_pool')
      let verifLogin = {login: login}

      dbo.collection('membre').find(verifLogin).toArray(function (err, result) {
        if (err) throw console.log('Connection failed')
        if (result.length > 0) {
          if (result[0].password === password) {
            db.close()
            response.status(200).send({msg: 'Connecté'})
          } else {
            console.log('Login ou password incorrect')
            response.status(400).send({msg: 'Login ou password incorrect'})
          }
        }
      })
    })
  }
})

router.route('/billet/create').post(function (request, response) {
    let titre = request.body.titre
    let description = request.body.description

    if (titre.length === 0 || description.length === 0) {
      response.status(400).send({msg: 'empty'});
    } else {
      MongoClient.connect('mongodb://localhost', function (error, db) {
        if (error) throw console.log('Connection failed')
        let dbo = db.db('user_pool')
        let verifTitre = {titre: titre}

        dbo.collection('billet').find(verifTitre).toArray(function (err, result) {
          if (err) throw console.log('Connection failed')
          if (result.length === 0) {
            let insert = {id: 1, titre: titre, description: description}
            dbo.collection('billet').insertOne(insert, function (err, res) {
              if (err) throw console.log(err)
              db.close()
              response.status(200).send({msg: 'Billet enregistré'})
            })
          } else {
            response.status(400).send({msg: 'Un billet porte déjà ce nom'})
          }
        })
      })
    }
})