
var DataManager = (function() {



  var api = function() {

  };

  function httpGet(theUrl)
  {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
      xmlHttp.send( null );
      return xmlHttp.responseText;
  }

  api.prototype.getWtrTrmMains = function(n,s,e,w) {
    var wtrTrmMains = httpGet('api/watertransmain?n=' + n + '&s=' + s + '&e=' + e + '&w=' + w);
    return wtrTrmMains;
  };

  api.prototype.getWtrDistrMains = function(n,s,e,w) {
    var wtrTrmMains = httpGet('api/waterdistrmain?n=' + n + '&s=' + s + '&e=' + e + '&w=' + w);
    return wtrTrmMains;
  };

  api.prototype.getAbandWtrMains = function(n,s,e,w) {
    var wtrTrmMains = httpGet('api/abandwaterrmain?n=' + n + '&s=' + s + '&e=' + e + '&w=' + w);
    return wtrTrmMains;
  };

  api.prototype.getWtrHydrants = function(n,s,e,w) {
    var wtrTrmMains = httpGet('api/waterhydrant?n=' + n + '&s=' + s + '&e=' + e + '&w=' + w);
    return wtrTrmMains;
  };

  api.prototype.getWtrCtrlValves = function(n,s,e,w) {
    var wtrTrmMains = httpGet('api/waterctrlvalve?n=' + n + '&s=' + s + '&e=' + e + '&w=' + w);
    return wtrTrmMains;
  };

  api.prototype.getSewMains = function(n,s,e,w) {
    var wtrTrmMains = httpGet('api/sewermain?n=' + n + '&s=' + s + '&e=' + e + '&w=' + w);
    return wtrTrmMains;
  };

  api.prototype.getSewGvrdMains = function(n,s,e,w) {
    var wtrTrmMains = httpGet('api/sewergvrdmain?n=' + n + '&s=' + s + '&e=' + e + '&w=' + w);
    return wtrTrmMains;
  };

  api.prototype.getSewerCatchBasins = function(n,s,e,w) {
    var manholes = httpGet('api/sewercatchbasin?n=' + n + '&s=' + s + '&e=' + e + '&w=' + w);
    console.log('manholes:');
    return manholes;
  };

  api.prototype.getManholes = function(n,s,e,w) {
    var manholes = httpGet('api/manhole?n=' + n + '&s=' + s + '&e=' + e + '&w=' + w);
    console.log('manholes:');
    return manholes;
  };
  return api;

})();
