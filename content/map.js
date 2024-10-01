var MapManager = (function() {

  var map = null;
  var dataManager = null;

  // data
  var geomWtrTrmMains = [];
  var geomWtrDstrMains = [];
  var geomAbandWtrMains = [];
  var markersWtrHydrants = [];
  var markersWtrCtrlValves = [];

  var geomSewMains = [];
  var geomSewGvrdMains = [];
  var markersSewCatBasins = [];
  var markersManhole = [];

  // colours
  CLR_WTR_TRM_MAINS = '#0F7174';
  CLR_WTR_TRM_MAINS_SEL = '#118789';
  CLR_WTR_DIST_MAINS = '#CB1550';
  CLR_WTR_DIST_MAINS_SEL = '#D82460';
  CLR_ABD_WTR_MAINS = '#7B506E';
  CLR_ABD_WTR_MAINS_SEL = '#8E5E80';
  CLR_WTR_HYD = '#B23C86';
  CLR_WTR_HYD_SEL = '#C64396';
  CLR_WTR_CTRL_VALVE = '#41521E';
  CLR_WTR_CTRL_VALVE_SEL = '#4D6023';

  CLR_SEW_MAINS = '#0E547A';
  CLR_SEW_MAINS_SEL = '#116491';
  CLR_SEW_GVRD_MAINS = '#E06C1F';
  CLR_SEW_GVRD_MAINS_SEL = '#FB7921';
  CLR_SEW_CAT_BAS = '#3590B7';
  CLR_SEW_CAT_BAS_SEL = '#3EA7D6';
  CLR_SEW_MANHOLE = '#88A512';
  CLR_SEW_MANHOLE_SEL = '#99B714';

  // Width
  MARKER_RADIUS = 6;
  MARKER_RADIUS_SEL = 12;
  MARKER_WEIGHT = 1;
  MARKER_WEIGHT_SEL = 3;
  LINE_WIDTH = 6;
  LINE_WIDTH_SEL = 12;

  // draw properties
  var map_bounds = null;
  var map_zoom = null;
  var clickedItemOn = false;
  var clickedItem = null;
  var clickedItemId = null;
  var clickedItemType = null;
  const TYPE_MARKER = 1;
  const TYPE_LINE = 2;

  const MIN_ZOOM_MANHOLE = 15;
  const MIN_ZOOM_WTR_TRM_MAINS = 15;
  const MIN_ZOOM_WTR_DIST_MAINS = 15;
  
  var DRAW_WTR_TRM_MAINS = false;
  var DRAW_WTR_DIST_MAINS = false;
  var DRAW_ABD_WTR_MAINS = false;
  var DRAW_WTR_HYD = false;
  var DRAW_WTR_CTRL_VALVE = false;

  var DRAW_SEW_MAINS = false;
  var DRAW_SEW_GVRD_MAINS = false;
  var DRAW_SEW_CAT_BAS = false;
  var DRAW_SEW_MANHOLES = false;

  var api = function(dm) {
    dataManager = dm;
  };

  api.prototype.markerTooltipOn = function(e, type) {
    var layer = e;
    layer.openTooltip();

    if (type == OPT_WTR_HYD)
      layer.setStyle({
          fillColor: CLR_WTR_HYD_SEL,
          radius: MARKER_RADIUS_SEL,
          weight: MARKER_WEIGHT_SEL
      });
    else if (type == OPT_WTR_CTRL_VALVE)
      layer.setStyle({
          fillColor: CLR_WTR_CTRL_VALVE_SEL,
          radius: MARKER_RADIUS_SEL,
          weight: MARKER_WEIGHT_SEL
      });
    else if (type == OPT_SEW_CAT_BAS)
      layer.setStyle({
          fillColor: CLR_SEW_CAT_BAS_SEL,
          radius: MARKER_RADIUS_SEL,
          weight: MARKER_WEIGHT_SEL
      });
    else if (type == OPT_SEW_MANHOLES)
      layer.setStyle({
          fillColor: CLR_SEW_MANHOLE_SEL,
          radius: MARKER_RADIUS_SEL,
          weight: MARKER_WEIGHT_SEL
      });
  };

  api.prototype.markerTooltipOff = function(e, type) {
    var layer = e;

    layer.closeTooltip();

    if (type == OPT_WTR_HYD)
      layer.setStyle({
          fillColor: CLR_WTR_HYD,
          radius: MARKER_RADIUS,
          weight: MARKER_WEIGHT
      });
    else if (type == OPT_WTR_CTRL_VALVE)
      layer.setStyle({
          fillColor: CLR_WTR_CTRL_VALVE,
          radius: MARKER_RADIUS,
          weight: MARKER_WEIGHT
      });
    else if (type == OPT_SEW_CAT_BAS)
      layer.setStyle({
          fillColor: CLR_SEW_CAT_BAS,
          radius: MARKER_RADIUS,
          weight: MARKER_WEIGHT
      });
    else if (type == OPT_SEW_MANHOLES)
      layer.setStyle({
          fillColor: CLR_SEW_MANHOLE,
          radius: MARKER_RADIUS,
          weight: MARKER_WEIGHT
      });
  };

  api.prototype.markerClick = function(e, type) {
    if (!clickedItemOn) {
      api.prototype.markerTooltipOn(e.target);
      clickedItem = e.target;
      clickedItemType = TYPE_MARKER;
      clickedItemOn = true;
    } else if (clickedItem == e.target) {
      api.prototype.turnTooltipOff(null);
      clickedItemOn = false;
    } else {
      api.prototype.turnTooltipOff(null);
      api.prototype.markerTooltipOn(e.target);
      clickedItem = e.target;
    }
  };

   api.prototype.lineTooltipOn = function(e, type) {
    var layer = e;

    layer.openTooltip();

    if (type == OPT_WTR_TRM_MAINS)
      layer.setStyle({
          color: CLR_WTR_TRM_MAINS_SEL,
          weight: LINE_WIDTH_SEL
      });
    else if (type == OPT_WTR_DIST_MAINS)
      layer.setStyle({
          color: CLR_WTR_DIST_MAINS_SEL,
          weight: LINE_WIDTH_SEL
      });
    else if (type == OPT_ABD_WTR_MAINS)
      layer.setStyle({
          color: CLR_ABD_WTR_MAINS_SEL,
          weight: LINE_WIDTH_SEL
      });

    else if (type == OPT_SEW_MAINS)
      layer.setStyle({
          color: CLR_SEW_MAINS_SEL,
          weight: LINE_WIDTH_SEL
      });
    else if (type == OPT_SEW_GVRD_MAINS)
      layer.setStyle({
          color: CLR_SEW_GVRD_MAINS_SEL,
          weight: LINE_WIDTH_SEL
      });
  };

  api.prototype.lineTooltipOff = function(e, type) {
    var layer = e;

    layer.closeTooltip();

    if (type == null) return; // will be erased, does not matter

    if (type == OPT_WTR_TRM_MAINS)
      layer.setStyle({
          color: CLR_WTR_TRM_MAINS,
          weight: LINE_WIDTH
      });
    else if (type == OPT_WTR_DIST_MAINS)
      layer.setStyle({
          color: CLR_WTR_DIST_MAINS,
          weight: LINE_WIDTH
      });
    else if (type == OPT_ABD_WTR_MAINS)
      layer.setStyle({
          color: CLR_ABD_WTR_MAINS,
          weight: LINE_WIDTH
      });

    else if (type == OPT_SEW_MAINS)
      layer.setStyle({
          color: CLR_SEW_MAINS,
          weight: LINE_WIDTH
      });
    else if (type == OPT_SEW_GVRD_MAINS)
      layer.setStyle({
          color: CLR_SEW_GVRD_MAINS,
          weight: LINE_WIDTH
      });
  };

  api.prototype.lineClick = function(e, p, type) {
    if (!clickedItemOn) {
      api.prototype.lineTooltipOn(e.target, type);
      clickedItem = e.target;
      clickedItemId = p.id;
      clickedItemType = TYPE_LINE;
      clickedItemOn = true;
    } else if (clickedItemId == p.id) {
      api.prototype.turnTooltipOff(type);
      clickedItemOn = false;
    } else {
      api.prototype.turnTooltipOff(type);
      api.prototype.lineTooltipOn(e.target, type);
      clickedItem = e.target;
      clickedItemId = p.id;
    }
  };

  api.prototype.turnTooltipOff = function(type) {
    if (!clickedItemOn) return;

    if (clickedItemType == TYPE_MARKER)
      api.prototype.markerTooltipOff(clickedItem);
    else if (clickedItemType == TYPE_LINE)
      api.prototype.lineTooltipOff(clickedItem, type);
  }

  api.prototype.markerHoverOn = function(e, type) {
    if (clickedItemOn) return;
    api.prototype.markerTooltipOn(e.target, type);
  };

  api.prototype.markerHoverOff = function(e, type) {
    if (clickedItemOn) return;
    api.prototype.markerTooltipOff(e.target, type);
  };

  api.prototype.lineHoverOn = function(e, type) {
    if (clickedItemOn) return;
    api.prototype.lineTooltipOn(e.target, type);
  };

  api.prototype.lineHoverOff = function(e, type) {
    if (clickedItemOn) return;
    api.prototype.lineTooltipOff(e.target, type);
  };

  function drawMarker1(apiFunc, title, labelFunc, type, colour_fill, arr) {
    var manholes = apiFunc(map_bounds._northEast.lat, map_bounds._southWest.lat, map_bounds._northEast.lng, map_bounds._southWest.lng);
    var manholesData = JSON.parse(manholes);

    const data = manholesData.data;

    for (const manhole of data) {
      var circle = L.circleMarker([manhole.lat, manhole.lng], {
        radius: MARKER_RADIUS,
        weight: MARKER_WEIGHT,
        fillColor: colour_fill,
        fillOpacity: 1
      }).addTo(map);

      circle.bindTooltip(labelFunc(manhole, title), 
      {
          direction: 'right',
          permanent: true,
          sticky: true,
          offset: [0, 0],
          opacity: 1.0,
          className: 'leaflet-tooltip-own' 
      });
      circle.closeTooltip();

      circle.on('mouseover', function(e) {
        api.prototype.markerHoverOn(e, type);
      });
      circle.on('mouseout', function(e) {
        api.prototype.markerHoverOff(e, type);
      });
      circle.on('click', function(e) {
        api.prototype.markerClick(e, type);
      });

      arr.push(circle);
    }
  };

  function drawTypeI(apiFunc, type, label, colour, arr, labelFunc) {
    var items = apiFunc(map_bounds._northEast.lat, map_bounds._southWest.lat, map_bounds._northEast.lng, map_bounds._southWest.lng);
    var itemsData = JSON.parse(items);

    const data = itemsData.data;

    for (const wtrTrmMain of data) {
      var geojsonFeature = {
        "type": "Feature",
        "properties": {
          "id": wtrTrmMain.i
        },
        "geometry": wtrTrmMain.g
      };

      var feature = L.geoJSON(geojsonFeature,
      {
        onEachFeature: function (feature, layer) {
          onEachFeature(feature, layer, type, wtrTrmMain, label, labelFunc);
        },
        style: {
          "color": colour,
          weight: LINE_WIDTH
        }
      }).addTo(map);

      // turn off tooltips
      for (var k in feature._layers) {
        var l = map._layers[k];
        l.closeTooltip();
      }

      arr.push(feature);
    }
  }

  api.prototype.drawWtrTrmMains = function() {
    drawTypeI(dataManager.getWtrTrmMains, OPT_WTR_TRM_MAINS, 'WATER TRANSMISSION MAIN', CLR_WTR_TRM_MAINS, geomWtrTrmMains, featureLabelI);
  };

  api.prototype.drawWtrDistrMains = function() {
    drawTypeI(dataManager.getWtrDistrMains, OPT_WTR_DIST_MAINS, 'WATER DISTRIBUTION MAIN', CLR_WTR_DIST_MAINS, geomWtrDstrMains, featureLabelI);
  };

  api.prototype.drawAbandWtrMains = function() {
    drawTypeI(dataManager.getAbandWtrMains, OPT_WTR_DIST_MAINS, 'ABANDONED WATER MAIN', CLR_ABD_WTR_MAINS, geomAbandWtrMains, featureLabelII);
  };

  api.prototype.drawWtrHydrants = function() {
    drawMarker1(dataManager.getWtrHydrants, "WATER HYDRANT", markerLabelHydrant, OPT_WTR_HYD, CLR_WTR_HYD, markersWtrHydrants);
  };

  api.prototype.drawWtrCtrlValves = function() {
    drawMarker1(dataManager.getWtrCtrlValves, "WATER CONTROL VALVE", markerLabelCtrlValve, OPT_WTR_CTRL_VALVE, CLR_WTR_CTRL_VALVE, markersWtrCtrlValves);
  };


  api.prototype.drawSewMains = function() {
    drawTypeI(dataManager.getSewMains, OPT_SEW_MAINS, 'SEWER MAIN', CLR_SEW_MAINS, geomSewMains, featureLabel3);
  };

  api.prototype.drawSewGvrdMains = function() {
    drawTypeI(dataManager.getSewGvrdMains, OPT_SEW_GVRD_MAINS, 'GVRD SEWER MAIN', CLR_SEW_GVRD_MAINS, geomSewGvrdMains, featureLabel4);
  };

  api.prototype.drawSewCatBasins = function() {
    drawMarker1(dataManager.getSewerCatchBasins, "SEWER CATCH BASIN", markerLabelCatchBasin, OPT_SEW_CAT_BAS, CLR_SEW_CAT_BAS, markersSewCatBasins);
  };

  api.prototype.drawManholes = function() {
    drawMarker1(dataManager.getManholes, "MANHOLE", markerLabel1, OPT_SEW_MANHOLES, CLR_SEW_MANHOLE, markersManhole);
  };

  // Manhole
  function markerLabel1(item, label) {
    return "<div style='background:white; padding:1px 3px 1px 3px'><span class=\"tp-header\">" + label + "</span>" +
      "<span class=\"tp-label\">Type:</span>&nbsp;" + item.t + "<br />" +
      "<span class=\"tp-label\">Elevation:</span>&nbsp;" + item.e + "</div>";
  }

  // Water hydrant
  function markerLabelHydrant(item, label) {
    return "<div style='background:white; padding:1px 3px 1px 3px'><span class=\"tp-header\">" + label + "</span>" +
      "<span class=\"tp-label\">ID:</span>&nbsp;" + item.i + "<br />" +
      "<span class=\"tp-label\">Type:</span>&nbsp;" + item.t + "<br />" +
      "<span class=\"tp-label\">Corner dist:</span>&nbsp;" + item.d + "<br />" +
      "<span class=\"tp-label\">Feeder len:</span>&nbsp;" + item.l + "<br />" +
      "<span class=\"tp-label\">Direction:</span>&nbsp;" + item.di + "<br />" +
      "<span class=\"tp-label\">Colour:</span>&nbsp;" + item.c + "<br />" +
      "<span class=\"tp-label\">Install:</span>&nbsp;" + item.dt + "<br />" +
      "<span class=\"tp-label\">Fire use only:</span>&nbsp;" + item.f + "<br />" +
      "<span class=\"tp-label\">Compression:</span>&nbsp;" + item.co + "</div>";
  }

  // Control valve
  function markerLabelCtrlValve(item, label) {
    return "<div style='background:white; padding:1px 3px 1px 3px'><span class=\"tp-header\">" + label + "</span>" +
      "<span class=\"tp-label\">Subsystem:</span>&nbsp;" + item.su + "<br />" +
      "<span class=\"tp-label\">Size:</span>&nbsp;" + item.s + "<br />" +
      "<span class=\"tp-label\">Open:</span>&nbsp;" + item.o + "<br />" +
      "<span class=\"tp-label\">X offset:</span>&nbsp;" + item.x + "<br />" +
      "<span class=\"tp-label\">X direction:</span>&nbsp;" + item.xd + "<br />" +
      "<span class=\"tp-label\">Y offset:</span>&nbsp;" + item.y + "<br />" +
      "<span class=\"tp-label\">Y direction:</span>&nbsp;" + item.yd + "</div>";
  }

  // Catch basin
  function markerLabelCatchBasin(item, label) {
    return "<div style='background:white; padding:1px 3px 1px 3px'><span class=\"tp-header\">" + label + "</span></div>";
  }

  function featureLabelI(item, label) {
    return "<div style='background:white; padding:1px 3px 1px 3px'><span class=\"tp-header\">" +
      label + "</span><span class=\"tp-label\">Diameter (mm):</span>&nbsp;" + item.d + "<br /><span class=\"tp-label\">Date:</span>&nbsp;" +
      item.dt + "<br /><span class=\"tp-label\">Lining:</span>&nbsp;" + item.l + "<br /><span class=\"tp-label\">Material:</span>&nbsp;" +
      item.m + "</div>";
  };

  function featureLabelII(item, label) {
    return "<div style='background:white; padding:1px 3px 1px 3px'><span class=\"tp-header\">" +
      label + "</span><span class=\"tp-label\">Diameter (mm):</span>&nbsp;" + item.d + "<br /><span class=\"tp-label\">Date:</span>&nbsp;" +
      item.dt + "<br /><span class=\"tp-label\">Material:</span>&nbsp;" +
      item.m + "</div>";
  };

  function featureLabel3(item, label) {
    return "<div style='background:white; padding:1px 3px 1px 3px'><span class=\"tp-header\">" + label + "</span>" + 
      "<span class=\"tp-label\">Diameter (mm):</span>&nbsp;" + item.d + "<br />" +
      "<span class=\"tp-label\">Type:</span>&nbsp;" + item.t + "<br />" +
      "<span class=\"tp-label\">Grade (%):</span>&nbsp;" + item.gr + "<br />" +
      "<span class=\"tp-label\">Install yr:</span>&nbsp;" + item.dt + "<br />" +
      "<span class=\"tp-label\">Material</span>&nbsp;" + item.m + "<br />" +
      "<span class=\"tp-label\">Length (m):</span>&nbsp;" + item.l + "<br />" +
      "<span class=\"tp-label\">Downstream elev:</span>&nbsp;" + item.de + "<br />" +
      "<span class=\"tp-label\">Upstream elev:</span>&nbsp;" + item.ue + "</div>";
  };

  function featureLabel4(item, label) {
    return "<div style='background:white; padding:1px 3px 1px 3px'><span class=\"tp-header\">" + label + "</span>" + 
      "<span class=\"tp-label\">Diameter (mm):</span>&nbsp;" + item.d + "<br />" +
      "<span class=\"tp-label\">Type:</span>&nbsp;" + item.t + "<br />" +
      "<span class=\"tp-label\">Grade (%):</span>&nbsp;" + item.gr + "<br />" +
      "<span class=\"tp-label\">Install yr:</span>&nbsp;" + item.dt + "<br />" +
      "<span class=\"tp-label\">Material</span>&nbsp;" + item.m + "<br />" +
      "<span class=\"tp-label\">Length (m):</span>&nbsp;" + item.l + "</div>";
  };

  function onEachFeature(feature, layer, type, wtrTrmMain, label, labelFunc) {
    layer.bindTooltip(labelFunc(wtrTrmMain, label),
      {
          direction: 'right',
          permanent: true,
          sticky: true,
          offset: [0, 0],
          opacity: 1.0,
          className: 'leaflet-tooltip-own' 
      });

    layer.on('click', function(e) {
      api.prototype.lineClick(e, feature.properties, type);
    });

    layer.on('mouseover', function(e) {
      api.prototype.lineHoverOn(e, type);
    });

    layer.on('mouseout', function(e) {
      api.prototype.lineHoverOff(e, type);
    });
  };

  api.prototype.clearMap = function() {
    for (const manhole of markersManhole) {
      map.removeLayer(manhole);
    }
  };

  api.prototype.clearMapItems = function(items) {

    for (const item of items) {
      map.removeLayer(item);
    }
    items = [];
  };

  api.prototype.retrieveAndDraw = function() {
    
    api.prototype.clearMapItems(geomWtrTrmMains);
    api.prototype.clearMapItems(geomWtrDstrMains);
    api.prototype.clearMapItems(geomAbandWtrMains);
    api.prototype.clearMapItems(markersWtrHydrants);
    api.prototype.clearMapItems(markersWtrCtrlValves);

    api.prototype.clearMapItems(geomSewMains);
    api.prototype.clearMapItems(geomSewGvrdMains);
    api.prototype.clearMapItems(markersSewCatBasins);
    api.prototype.clearMapItems(markersManhole);

    // Water
    if (DRAW_WTR_TRM_MAINS && map_zoom >= MIN_ZOOM_WTR_TRM_MAINS) {
      api.prototype.drawWtrTrmMains();
    }
    if (DRAW_WTR_DIST_MAINS && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS) {
      api.prototype.drawWtrDistrMains();
    }
    if (DRAW_ABD_WTR_MAINS && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS) {
      api.prototype.drawAbandWtrMains();
    }
    if (DRAW_WTR_HYD && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS) {
      api.prototype.drawWtrHydrants();
    }
    if (DRAW_WTR_CTRL_VALVE && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS) {
      api.prototype.drawWtrCtrlValves();
    }

    // Sewer
    if (DRAW_SEW_MAINS && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS) {
      api.prototype.drawSewMains();
    }
    if (DRAW_SEW_GVRD_MAINS && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS) {
      api.prototype.drawSewGvrdMains();
    }
    if (DRAW_SEW_CAT_BAS && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS) {
      api.prototype.drawSewCatBasins();
    }
    if (DRAW_SEW_MANHOLES && map_zoom >= MIN_ZOOM_MANHOLE) {
      api.prototype.drawManholes();
    }


  };

  api.prototype.init = function() {
    //var map = L.map('map').setView([48.49, 1.395], 16);
    map = L.map('map').setView([49.23912083246701, -123.03021749396088], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: ''
    }).addTo(map);
   
    map.on('moveend', onMapMove);

    function onMapMove(e) {
      map_bounds = map.getBounds();
      map_zoom = map.getZoom();

      api.prototype.turnTooltipOff(null);
      clickedItemOn = false;

      api.prototype.retrieveAndDraw();
    }

    onMapMove(null);
  };

  api.prototype.setOption = function(label, value) {
    // Sewer manholes
    if (label == OPT_SEW_MANHOLES) {
      DRAW_SEW_MANHOLES = value;
      if (value && map_zoom >= MIN_ZOOM_MANHOLE)
        api.prototype.drawManholes();
      else
        api.prototype.clearMapItems(markersManhole);
    }
    else if (label == OPT_WTR_TRM_MAINS) {
      DRAW_WTR_TRM_MAINS = value;
      if (value && map_zoom >= MIN_ZOOM_WTR_TRM_MAINS)
        api.prototype.drawWtrTrmMains();
      else
        api.prototype.clearMapItems(geomWtrTrmMains);
    }
    else if (label == OPT_WTR_DIST_MAINS) {
      DRAW_WTR_DIST_MAINS = value;
      if (value && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS)
        api.prototype.drawWtrDistrMains();
      else
        api.prototype.clearMapItems(geomWtrDstrMains);
    }
    else if (label == OPT_ABD_WTR_MAINS) {
      DRAW_ABD_WTR_MAINS = value;
      if (value && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS)
        api.prototype.drawAbandWtrMains();
      else
        api.prototype.clearMapItems(geomAbandWtrMains);
    }
    else if (label == OPT_WTR_HYD) {
      DRAW_WTR_HYD = value;
      if (value && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS)
        api.prototype.drawWtrHydrants();
      else
        api.prototype.clearMapItems(markersWtrHydrants);
    }
    else if (label == OPT_WTR_CTRL_VALVE) {
      DRAW_WTR_CTRL_VALVE = value;
      if (value && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS)
        api.prototype.drawWtrCtrlValves();
      else
        api.prototype.clearMapItems(markersWtrCtrlValves);
    }

    else if (label == OPT_SEW_MAINS) {
      DRAW_SEW_MAINS = value;
      if (value && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS)
        api.prototype.drawSewMains();
      else
        api.prototype.clearMapItems(geomSewMains);
    }
    else if (label == OPT_SEW_GVRD_MAINS) {
      DRAW_SEW_GVRD_MAINS = value;
      if (value && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS)
        api.prototype.drawSewGvrdMains();
      else
        api.prototype.clearMapItems(geomSewGvrdMains);
    }
    else if (label == OPT_SEW_CAT_BAS) {
      DRAW_SEW_CAT_BAS = value;
      if (value && map_zoom >= MIN_ZOOM_WTR_DIST_MAINS)
        api.prototype.drawSewCatBasins();
      else
        api.prototype.clearMapItems(markersSewCatBasins);
    }

  };

  return api;

})();

