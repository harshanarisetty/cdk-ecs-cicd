const express = require('express')
const app = express()
const path = require('path');
app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, './src/index.html'));
})
 
app.listen(3000)