const express = require('express');


const server = express();

const http = require("http");


_port = process.env.PORT || 3000;

//http.createServer((_, res) => res.end("Alive")).listen(_port)

server.all('/', (req, res)=>{
  res.send('Your bot is alive!');
  //res.setHeader('Content-Type', 'text/html');
  //res.send('<link href="https://fonts.googleapis.com/css?family=Roboto Condensed" rel="stylesheet"> <style> body {font-family: "Roboto Condensed";font-size: 22px;} <p>Hosting Active</p>');
  res.end();
})

function keepAlive(){
   console.log(_port);
   server.listen(_port, ()=>{console.log("Server is online!")});
}
//npx kill-port 8080
//pkill 1
module.exports = keepAlive;