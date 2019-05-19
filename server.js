const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const request2 = require('request');
var async = require('async');
const app = express();
const logger = require(__dirname+'/logger.js');

const apiKey = 'bd924ce26937314151f2e1c86d7cc522';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  var badnames=0; //flag to triger error alert deactivated
  res.render('index', {badnames:badnames, error: null, temp0: null, temp1: null, temp2: null, city0:null, city1:null, city2:null,
    sunrise0:null, sunrise1:null, sunrise2:null, sunset0:null, sunset1:null, sunset2:null,
    daterise0:null, daterise1:null, daterise2:null,dateset0:null, dateset1:null,  dateset2:null });
  })

  app.post('/search', function (req, res) {

    let city1 = req.body.city1.trim().toLowerCase();
    let url1= `http://api.openweathermap.org/data/2.5/weather?q=${city1}&units=metric&appid=${apiKey}`;
    let city2 = req.body.city2.trim().toLowerCase();
    let url2 = `http://api.openweathermap.org/data/2.5/weather?q=${city2}&units=metric&appid=${apiKey}`;
    let city3 = req.body.city3.trim().toLowerCase();
    let url3 = `http://api.openweathermap.org/data/2.5/weather?q=${city3}&units=metric&appid=${apiKey}`;
    var urls=[url1,url2,url3];
    var allcity=[city1,city2,city3]
    console.log(allcity);

    //console.log(city1+city2+city3);
    var counter=0;
    var count_catch=0;
    var req_data=['','','']; //array vai ser preenchido com 3 respostas
    var temp =[];
    var sunrise =[];
    var sunset =[];
    var daterise =[];
    var dateset =[];
    var city = [];
    var badnames = 0; //flag to triger error alert deactivated
    var cods =[];


    async.each(urls, function(element, done) {
      //console.log(element);
      request(element,  //elemento do array
        function (e, r, body) {
          req_data[counter] = JSON.parse(body); //parse response
          try{
            console.log(req_data[counter].cod);
            if(req_data[counter].cod=='200'){
              let counteach=0; //reset counter foreach loop
              allcity.forEach(function(entry) { //cycle to order responses like the submited request by the user

                if(req_data[counter].name.trim().toLowerCase()==entry){ //remove first character because of capital letter
                  temp[counteach]=req_data[counter].main.temp; //array com temperaturas
                  sunrise[counteach]=req_data[counter].sys.sunrise; //array com amanhecer
                  sunset[counteach]=req_data[counter].sys.sunset;  //array com por do sol
                  daterise[counteach]=new Date(sunrise[counteach]*1000);
                  daterise[counteach]=daterise[counteach].getHours() + ":" + daterise[counteach].getMinutes() + ' ' + daterise[counteach].toString().substr(34,40);
                  dateset[counteach]=new Date(sunset[counter]*1000);
                  dateset[counteach]=dateset[counteach].getHours() + ":" + dateset[counteach].getMinutes() + ' ' + dateset[counteach].toString().substr(34,40);
                  city[counteach]=entry;  //array com por do sol
                  cods[counteach]=req_data[counter].cod;
                }
                counteach++;
              });
              counter++;
              done();
              if(counter==3){ //corre 1 vez no fim do ultimo request
                console.log(city);
                logger.info(cods[2]+' ; '+city1+' , '+city2+' , '+city3); //log message with last response code
                res.render('index', {badnames:badnames, error: null, temp0: temp[0], temp1: temp[1], temp2: temp[2], city0:city[0], city1:city[1], city2:city[2],
                  sunrise0:sunrise[0], sunrise1:sunrise[1], sunrise2:sunrise[2], sunset0:sunset[0], sunset1:sunset[1], sunset2:sunset[2],
                  daterise0:daterise[0], daterise1:daterise[1], daterise2:daterise[2],dateset0:dateset[0], dateset1:dateset[1],  dateset2:dateset[2] });
                };
              }else{
                //console.log('else1'); //debug msg
                counter++;
                if(counter==3){
                  logger.info(JSON.parse(body).cod+' ; '+city1+' , '+city2+' , '+city3); //log message with last response code
                  badnames=1;
                  res.render('index', {badnames:badnames, error: null, temp0: null, temp1: null, temp2: null, city0:null, city1:null, city2:null,
                    sunrise0:null, sunrise1:null, sunrise2:null, sunset0:null, sunset1:null, sunset2:null,
                    daterise0:null, daterise1:null, daterise2:null,dateset0:null, dateset1:null,  dateset2:null });
                  }}}catch(err){
                    console.log(err);
                    // if(counter==2){ //corre 1 vez no fim do ultimo request
                    badnames=1; //flag to triger error alert activated
                    res.render('index', {badnames:badnames, error: null, temp0: null, temp1: null, temp2: null, city0:null, city1:null, city2:null,
                      sunrise0:null, sunrise1:null, sunrise2:null, sunset0:null, sunset1:null, sunset2:null,
                      daterise0:null, daterise1:null, daterise2:null,dateset0:null, dateset1:null,  dateset2:null });
                      count_catch++;
                      badnames=0;
                    };

                  });
                }
              );





            })



            app.listen(3000, function () {
              console.log('Listening on port 3000! v6')
            })
