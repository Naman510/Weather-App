require('dotenv').config();

const express = require("express");

const https = require("https");

const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
  var query=req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units=metric&appid="+process.env.API_KEY;
  https.get(url, function(response){
    console.log(response.statusCode);
    if(response.statusCode===404){
      res.send("Invalid city name");
    }
    response.on("data",function(data){
       const weatherData= JSON.parse(data);
       const description = weatherData.weather[0].description;
       const temp=weatherData.main.temp;
       const icon=weatherData.weather[0].icon;
       const imageURL= "https://openweathermap.org/img/wn/"+icon+"@2x.png"
       res.write("<p>The weather is currently "+description +"</p>");
       res.write("<h1>The temperature in "+query+" is currently "+temp+" degree celcius.</h1>");
       res.write("<img src="+imageURL+">");
       res.send();
    });
  });

});
app.listen(3000, function(){
  console.log("server is running");
});
