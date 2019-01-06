var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('view engine', 'ejs'); // Шаблонизатор
app.use(bodyParser.urlencoded({ extended: true })); //для получение post запроса

var user = '';
var pass = '';
var sum = [];
var cheerio = require('cheerio');
var request = require('request');
var jar = request.jar();
var url = 'http://www.alivemax.com/';
var asdF = function() {
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
    function(error, response, body) {
      if (!error) {
        request(
          {
            uri: url + 'earnings',
            method: 'GET',
            jar: jar
          },
          function(err, resp, html) {
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
};
app.get('/', function(req, res) {
  sum = [];
  user = '';
  pass = '';
  res.render('index');
});
app.post('/', function(req, res) {
  user = req.body.username;
  pass = req.body.password;
  asdF();
  setTimeout(function() {
    res.redirect('/create');
  }, 4000);
});
app.get('/create', function(req, res) {
  res.render('create', { sum: sum });
});
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
