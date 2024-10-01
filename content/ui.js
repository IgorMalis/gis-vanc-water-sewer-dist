const OPT_WTR_TRM_MAINS = 'Water transmission mains';
const OPT_WTR_DIST_MAINS = 'Water distribution mains';
const OPT_ABD_WTR_MAINS = 'Abandoned water mains';
const OPT_WTR_HYD = 'Water hydrants';
const OPT_WTR_CTRL_VALVE = 'Water control valves';

const OPT_SEW_MAINS = 'Sewer mains';
const OPT_SEW_GVRD_MAINS = 'GVRD sewer mains';
const OPT_SEW_CAT_BAS = 'Sewer catch basins';
const OPT_SEW_MANHOLES = 'Sewer manholes';


var UiManager = (function() {

  var optionsOpen = true;
  var mapManager = null;

  var api = function() {
    // Open/close options dialog
    document.getElementById("settings-top").addEventListener("click", api.prototype.expand);

    var elements = document.getElementsByClassName('optionInput');
    for (element of elements) {
      element.addEventListener('change', api.prototype.optionChanged);
    }
    
  };

  api.prototype.setMapManager = function(mm) {
    mapManager = mm;
  };

  api.prototype.expand = function(event) {
    if (!optionsOpen) {
      document.getElementById("settings-cont").classList.add('settings-cont-exp');
      document.getElementById("settings-arrow").classList.add('exp');
      optionsOpen = true;
    }
    else {
      document.getElementById("settings-cont").classList.remove('settings-cont-exp');
      document.getElementById("settings-arrow").classList.remove('exp');
      optionsOpen = false;
    }
  };

  api.prototype.optionChanged = function(event) {
    const value = event.currentTarget.checked;
    const id = event.currentTarget.id;
    const label = api.prototype.getLabel(id);

    mapManager.setOption(label, value);
  };

  api.prototype.getLabel = function(id) {
    var labels = document.getElementsByTagName("label");
    for (var i = 0; i < labels.length; i++) {
      var label = labels[i];
      if(label.getAttribute("for") == id) {
          return label.innerText;
      }
    }
  };

  return api;

})();

