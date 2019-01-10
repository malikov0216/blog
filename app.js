const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.set('view engine', 'ejs'); // Шаблонизатор
app.use(bodyParser.urlencoded({ extended: true })); //для получение post запроса
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

var isEntered = false;
var interval;
var user = '';
var pass = '';
var sum = [];
var name = '';
var cheerio = require('cheerio');
var request = require('request');
var jar = request.jar();
var url = 'http://www.alivemax.com/';
var asdF = function () {
  request(
    {
      uri: url + 'login',
      method: 'POST',
      form: {
        LOGIN: '1',
        USER: user,
        PASS: pass
      },
      jar: jar,
      followRedirect: true,
      followAllRedirects: true
    },
    function (error, response, body) {
      var ch = cheerio.load(body);
      name = ch('.nameBanner').text();
      if (!error) {
        request(
          {
            uri: url + 'earnings',
            method: 'GET',
            jar: jar
          },
          function (err, resp, html) {
            if (!err) {
              var $ = cheerio.load(html);
              var rows = $('.mout');
              for (var i = 0; i < rows.length; i++) {
                var row = rows.eq(i).children();
                for (var j = 0; j < 1; j++) {
                  var date = row.eq(1).text();
                  var money = row.eq(3).text();
                  var arrTwo = [[], []];
                  arrTwo[0].push(date);
                  arrTwo[1].push(money);
                  sum.push(arrTwo);
                }
              }
              isEntered = true;
              return isEntered;
            } else {
              console.log(err);
            }
          }
        );
      } else {
        console.log('There is an ERROR !! ' + error);
      }
    }
  );
  return true;
};
app.get('/', function (req, res) {
  isEntered = false;
  sum = [];
  user = '';
  pass = '';
  res.render('index');
});
app.post('/', function (req, res) {
  user = req.body.username;
  pass = req.body.password;
  asdF();
  interval = setInterval(function () {
    if (isEntered === true) {
      clearInterval(interval);
      res.redirect('/create');
    }
  }, 1000);
});
app.get('/create', function (req, res) {
  res.render('create', { sum: sum, name: name });
});
module.exports = app;
