var $ = require('jquery');  
var persona = require('./vendor/module');

$('h1').html('Hola Browserify');

var carlos = new persona("Carlos", 30);  
carlos.saludar();  
carlos.presentar();  