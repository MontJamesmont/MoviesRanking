'use strict';
var
  http    = require( 'http' ),
  express = require( 'express'  ),

  app     = express(),
  server  = http.createServer( app );

app.configure( function () {
  app.use( express.static( __dirname ) );
});
server.listen( 3000 );
console.log(
  'Serwer Express nasłuchuje na porcie %d',
   server.address().port
);
