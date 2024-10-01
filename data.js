const fs = require("fs");
const { parse } = require("csv-parse");
const NodeCache = require('node-cache');


const RE_manhole = '^{"coordinates":\\s\\[([+-]?([0-9]*[.])?[0-9]+),\\s([+-]?([0-9]*[.])?[0-9]+)\\],\\s"type":\\s"Point"}$';

const cache_wtr_trans_mains = new NodeCache();
const cache_wtr_distr_mains = new NodeCache();
const cache_aband_wtr_mains = new NodeCache();
const cache_wtr_hydrants = new NodeCache();
const cache_wtr_ctrl_valves = new NodeCache();

const cache_sew_mains = new NodeCache();
const cache_sew_gvrd_mains = new NodeCache();
const cache_sew_catch_basins = new NodeCache();
const cache_manhole = new NodeCache();

// Water transmission mains, water distribution mains
function createObjType1(g, row, min, max) {
  return {
    g: g,
    min_lat: min[0],
    max_lat: max[0],
    min_lng: min[1],
    max_lng: max[1],
    d: parseFloat(row[1]), // diameter
    dt: row[2], // date
    l: (row[3] == 'blank') ? '' : row[3], // lining
    m: (row[4] == '<blank>') ? '' : row[4] // material
  };
};

// Abandoned water mains
function createObjType2(g, row, min, max) {
  return {
    g: g,
    min_lat: min[0],
    max_lat: max[0],
    min_lng: min[1],
    max_lng: max[1],
    d: parseFloat(row[0]), // diameter
    dt: row[1], // date
    m: (row[2] == '<blank>') ? '' : row[2] // material
  };
};

// Sewer mains
function createObjType3(g, row, min, max) {
  return {
    g: g,
    min_lat: min[0],
    max_lat: max[0],
    min_lng: min[1],
    max_lng: max[1],
    d: parseFloat(row[0]), // diameter
    t: row[1], // type
    gr: row[2], // grade
    dt: row[3], // year
    m: (row[4] == '<blank>') ? '' : row[4], // material
    l: (row[5] != "") ? parseFloat(row[5]) : '', // length
    de: parseFloat(row[7]), // downstream elevation
    ue: parseFloat(row[8]) // downstream elevation
  };
};

// Sewer gvrd mains
function createObjType4(g, row, min, max) {
  return {
    g: g,
    min_lat: min[0],
    max_lat: max[0],
    min_lng: min[1],
    max_lng: max[1],
    d: parseFloat(row[0]), // diameter
    t: row[1], // type
    gr: row[2], // grade
    dt: row[3], // year
    m: (row[4] == '<blank>') ? '' : row[4], // material
    l: (row[5] != "") ? parseFloat(row[5]) : '' // length
  };
};

function createObjType5(row) {
  return {
    e: parseFloat(row[0]), // elevation
    t: row[1] // type
  };
};

// Water hydrants
function createObjType6(row) {
  return {
    i: row[0], // id
    t: row[3], // type
    d: row[4], // corner distance
    l: row[5], // feeder len
    di: row[6], // dir
    c: row[8], // color
    dt: row[18], // install date
    f: row[22], // fire use only
    co: row[24] // compression
  };
};

// Control valves
function createObjType7(row) {
  return {
    su: row[0], // subsystem
    s: row[1], // size
    o: row[2], // open
    x: row[3], // offset x
    xd: row[4], // direction x
    y: row[5], // offset y
    yd: row[6] // direction y
  };
};

// Sewer catch basins
function createObjType8(row) {
  return {
  };
};

function loadMarkers(file, cache, name, colGeom, createObjFunc) {
  fs.createReadStream(file)
    .pipe(parse({ delimiter: ";", from_line: 2 }))
    .on("data", function (row) {
      var coords = row[colGeom];
      var re = new RegExp(RE_manhole);
      var match = coords.match(re);

      cache.set( match[3]+','+match[1], createObjFunc(row) );
    })
    .on("end", function () {
      console.log("Loaded: " + name);
    })
    .on("error", function (error) {
      console.log(error.message);
    });
};

// Water transmission mains, water distribution mains, abandoned water mains
function loadLines(file, cache, name, colGeom, createObjFunc) {
  var id = 1;
  fs.createReadStream(file)
    .pipe(parse({ delimiter: ";", from_line: 2 }))
    .on("data", function (row) {
      var coords = JSON.parse(row[colGeom]);
      var min = [coords.coordinates[0][1], coords.coordinates[0][0]];
      var max = [coords.coordinates[0][1], coords.coordinates[0][0]];
      for (const c of coords.coordinates) {
        // lat
        if (c[1] < min[0])
          min[0] = c[1];
        if (c[1] > max[0])
          max[0] = c[1];

        // lng
        if (c[0] < min[1])
          min[1] = c[0];
        if (c[0] > max[1])
          max[1] = c[0];
      }

      cache.set( id, createObjFunc(coords, row, min, max) );
      id = id+1;
    })
    .on("end", function () {
      console.log("Loaded: " + name);
    })
    .on("error", function (error) {
      console.log(error.message);
    });
};

// Water transmission mains, water distribution mains
function retrieveObjType1(key, value) {
  return {
    i: key,
    g: value.g,
    d: value.d,
    dt: value.dt,
    l: value.l,
    m: value.m
  };
};

// Abandoned water mains
function retrieveObjType2(key, value) {
  return {
    i: key,
    g: value.g,
    d: value.d,
    dt: value.dt,
    m: value.m
  };
}

// Sewer mains
function retrieveObjType3(key, value) {
  return {
    i: key,
    g: value.g,
    d: value.d,
    t: value.t,
    gr: value.gr,
    dt: value.dt,
    m: value.m,
    l: value.l,
    de: value.de,
    ue: value.ue
  };
};

// Sewer GVRD mains
function retrieveObjType4(key, value) {
  return {
    i: key,
    g: value.g,
    d: value.d,
    t: value.t,
    gr: value.gr,
    dt: value.dt,
    m: value.m,
    l: value.l
  };
};

function retrieveObjType5(lat, lng, value) {
  return {
    lat: lat,
    lng: lng,
    e: value.e,
    t: value.t,
  };
};

// Hydrants
function retrieveObjType6(lat, lng, value) {
  return {
    lat: lat,
    lng: lng,
    i: value.i,
    t: value.t,
    d: value.d,
    di: value.di,
    l: value.l,
    c: value.c,
    dt: value.dt,
    f: value.f,
    co: value.co
  };
};

// Water ctrl valves
function retrieveObjType7(lat, lng, value) {
  return {
    lat: lat,
    lng: lng,
    su: value.su,
    s: value.s,
    o: value.o,
    x: value.x,
    xd: value.xd,
    y: value.y,
    yd: value.yd
  };
};

// Catch basins
function retrieveObjType8(lat, lng, value) {
  return {
    lat: lat,
    lng: lng
  };
};

function retrieveLines(n, s, e, w, cache, objFunc) {
  data = [];
  for (const key of cache.keys()) {
    var value = cache.get(key);
    //console.log('checking:', value.min_lat, value.max_lat, value.min_lng, value.max_lng);
    if (!(value.min_lat > n || value.max_lat < s ||
      value.min_lng > e || value.max_lng < w)) {
        data.push( objFunc(key, value) );
      } // if
   } // for
   return data;
};

function retrieveMarkers(n, s, e, w, cache, objFunc) {
  data = [];
  for (const key of cache.keys()) {
    var sep = key.indexOf(',');
    var lat = parseFloat( key.substring(0, sep) );
    var lng = parseFloat( key.substring(sep+1, key.length) );
    if (lat <= n && lat >= s &&
      lng <= e && lng >= w) {
        objData = cache.get(key);
        data.push(objFunc(lat, lng, objData));
      } // if
   } // for
   return data;
}

module.exports = {
  loadWaterTransMains: function (file) {
    loadLines(file, cache_wtr_trans_mains, 'water transmission mains', 0, createObjType1);
  },
  loadWaterDistrMains: function (file) {
    loadLines(file, cache_wtr_distr_mains, 'water distribution mains', 0, createObjType1);
  },
  loadAbandWaterMains: function (file) {
    loadLines(file, cache_aband_wtr_mains, 'abandoned water mains', 3, createObjType2);
  },
  loadWaterHydrants: function (file) {
    loadMarkers(file, cache_wtr_hydrants, 'water hydrants', 30, createObjType6);
  },
  loadWaterCtrlValves: function (file) {
    loadMarkers(file, cache_wtr_ctrl_valves, 'water control valves', 7, createObjType7);
  },
  loadSewerMains: function (file) {
    loadLines(file, cache_sew_mains, 'sewer mains', 6, createObjType3);
  },
  loadSewerGvrdMains: function (file) {
    loadLines(file, cache_sew_gvrd_mains, 'gvrd sewer mains', 6, createObjType4);
  },
  loadSewerCatchBasins: function (file) {
    loadMarkers(file, cache_sew_catch_basins, 'sewer catch basins', 1, createObjType8);
  },
  loadManholes: function (file) {
    loadMarkers(file, cache_manhole, 'manholes', 2, createObjType5);
  },
  
  retrieveWaterTransMains: function (n,s,e,w) {
    return retrieveLines(n, s, e, w, cache_wtr_trans_mains, retrieveObjType1);
  },
  retrieveWaterDistrMains: function (n,s,e,w) {
    return retrieveLines(n, s, e, w, cache_wtr_distr_mains, retrieveObjType1);
  },
  retrieveAbandWaterMains: function (n,s,e,w) {
    return retrieveLines(n, s, e, w, cache_aband_wtr_mains, retrieveObjType2);
  },
  retrieveWaterHydrants: function (n,s,e,w) {
    return retrieveMarkers(n, s, e, w, cache_wtr_hydrants, retrieveObjType6);
  },
  retrieveWaterCtrlValves: function (n,s,e,w) {
    return retrieveMarkers(n, s, e, w, cache_wtr_ctrl_valves, retrieveObjType7);
  },

  retrieveSewerMains: function (n,s,e,w) {
    return retrieveLines(n, s, e, w, cache_sew_mains, retrieveObjType3);
  },
  retrieveSewerGvrdMains: function (n,s,e,w) {
    return retrieveLines(n, s, e, w, cache_sew_gvrd_mains, retrieveObjType4);
  },
  retrieveSewerCatchBasins: function (n,s,e,w) {
    return retrieveMarkers(n, s, e, w, cache_sew_catch_basins, retrieveObjType8);
  },
  retrieveManholes: function (n,s,e,w) {
    return retrieveMarkers(n, s, e, w, cache_manhole, retrieveObjType5);
  }
};
