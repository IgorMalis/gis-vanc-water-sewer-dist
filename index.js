// Use http module to serve static content (web app front-end: HTML, JS, CSS, image files)
// accessible at http://localhost:8000
// and define 9 JSON API endpoints for retrieving geographic data from CSV files
// accessible at http://localhost:8000/api/<endpoint>

const http = require("http");
const url = require('url');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

var data = require('./data'); // data manager


const port = 8000;

// Load data from CSV files
data.loadWaterTransMains("./data/water-transmission-mains.csv");
data.loadWaterDistrMains("./data/water-distribution-mains.csv");
data.loadAbandWaterMains("./data/abandoned-water-mains.csv");
data.loadWaterHydrants("./data/water-hydrants.csv");
data.loadWaterCtrlValves("./data/water-control-valves.csv");

data.loadSewerMains("./data/sewer-mains.csv");
data.loadSewerGvrdMains("./data/gvrd-sewer-trunk-mains.csv");
data.loadSewerCatchBasins("./data/sewer-catch-basins.csv");
data.loadManholes("./data/sewer-manholes.csv");

var serve = serveStatic("./content");

// Validate query string for APIs
function validateInput(query) {
  return query.n && !isNaN(query.n) &&
    query.s && !isNaN(query.s) &&
    query.e && !isNaN(query.e) &&
    query.w && !isNaN(query.w);
};

// Define API endpoints
var server = http.createServer(function(req, res) {

  var urlData = url.parse(req.url, true);
  var path = urlData.pathname;
  var query = urlData.query;

  // Manholes
  if (path == '/api/manhole' &&
    validateInput(query)) {

    const matchingManholes = data.retrieveManholes(
      parseFloat(query.n), parseFloat(query.s),
      parseFloat(query.e), parseFloat(query.w)
    );

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end( JSON.stringify({ data: matchingManholes }) );
    return;
  }

  // Water transmission mains
  else if (path == '/api/watertransmain' &&
    validateInput(query)) {

    const matchingItems = data.retrieveWaterTransMains(
      parseFloat(query.n), parseFloat(query.s),
      parseFloat(query.e), parseFloat(query.w)
    );

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end( JSON.stringify({ data: matchingItems }) );
    return;
  }

  // Water distribution mains
  else if (path == '/api/waterdistrmain' &&
    validateInput(query)) {

    const matchingItems = data.retrieveWaterDistrMains(
      parseFloat(query.n), parseFloat(query.s),
      parseFloat(query.e), parseFloat(query.w)
    );

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end( JSON.stringify({ data: matchingItems }) );
    return;
  }

  // Abandoned water mains
  else if (path == '/api/abandwaterrmain' &&
    validateInput(query)) {

    const matchingItems = data.retrieveAbandWaterMains(
      parseFloat(query.n), parseFloat(query.s),
      parseFloat(query.e), parseFloat(query.w)
    );

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end( JSON.stringify({ data: matchingItems }) );
    return;
  }

  // Water hydrants
  else if (path == '/api/waterhydrant' &&
    validateInput(query)) {

    const matchingItems = data.retrieveWaterHydrants(
      parseFloat(query.n), parseFloat(query.s),
      parseFloat(query.e), parseFloat(query.w)
    );

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end( JSON.stringify({ data: matchingItems }) );
    return;
  }

  // Water control valves
  else if (path == '/api/waterctrlvalve' &&
    validateInput(query)) {

    const matchingItems = data.retrieveWaterCtrlValves(
      parseFloat(query.n), parseFloat(query.s),
      parseFloat(query.e), parseFloat(query.w)
    );

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end( JSON.stringify({ data: matchingItems }) );
    return;
  }

  // Sewer mains
  else if (path == '/api/sewermain' &&
    validateInput(query)) {

    const matchingItems = data.retrieveSewerMains(
      parseFloat(query.n), parseFloat(query.s),
      parseFloat(query.e), parseFloat(query.w)
    );

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end( JSON.stringify({ data: matchingItems }) );
    return;
  }

  // Sewer GVRD mains
  else if (path == '/api/sewergvrdmain' &&
    validateInput(query)) {

    const matchingItems = data.retrieveSewerGvrdMains(
      parseFloat(query.n), parseFloat(query.s),
      parseFloat(query.e), parseFloat(query.w)
    );

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end( JSON.stringify({ data: matchingItems }) );
    return;
  }

  // Sewer catch basins
  else if (path == '/api/sewercatchbasin' &&
    validateInput(query)) {

    const matchingItems = data.retrieveSewerCatchBasins(
      parseFloat(query.n), parseFloat(query.s),
      parseFloat(query.e), parseFloat(query.w)
    );

    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end( JSON.stringify({ data: matchingItems }) );
    return;
  }

  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(port);
