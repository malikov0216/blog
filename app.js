const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const requestPromise = require('request-promise');

const app = express();

app.set('view engine', 'ejs'); // Шаблонизатор
app.use(bodyParser.urlencoded({ extended: true })); //для получение post запроса
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

let user = 'nartay777';
let pass = 'dimaw2007';
let sum = [];
let userName = '';
let jar = request.jar();
let url = 'http://www.alivemax.com/';
let parseSalaries = function (rows) {
  let sum = [];
  for (let i = 0; i < rows.length; i++) {
    let row = rows.eq(i).children();
    for (let j = 0; j < 1; j++) {
      let date = row.eq(1).text();
      let money = row.eq(3).text();
      let arrTwo = [[], []];
      arrTwo[0].push(date);
      arrTwo[1].push(money);
      sum.push(arrTwo);
    }
  }
  return sum;
};



const login = function () {
  const loginOptions = {
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
  };

  return requestPromise(loginOptions);
};
const getSalariesPage = function () {
  const options = {
    uri: url + 'earnings',
    method: 'GET',
    jar: jar
  }
  return requestPromise(options);
};

const getSalaries = function (html) {
  const $ = cheerio.load(html);
  const rows = $('.mout');
  const salaries = parseSalaries(rows);
  return salaries;
};

const getName = function (body) {
  var page = cheerio.load(body);
  userName = page('.nameBanner').text();
  return userName;
}

app.get('/', function (req, res) {
  sum = [];
  user = '';
  pass = '';
  res.render('index');
});
app.post('/', function (req, res) {
  user = req.body.username;
  pass = req.body.password;
  var loginPage = login();

  let dataUserName = loginPage.then(getName);
  let dataSum = loginPage.then(getSalariesPage).then(getSalaries);

  Promise.all([dataUserName, dataSum]).then((data) => {
    userName = data[0];
    sum = data[1];
    res.redirect('/create');
  }).catch(err => console.log(err));

});
app.get('/create', function (req, res) {
  res.render('create', { sum: sum, name: userName });
});
module.exports = app;
