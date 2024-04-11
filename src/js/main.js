/**
 * Created by midgetracer on 12/6/17.
 */
const ip = $.ajax({
    type: "GET",
    url: "http://127.0.0.1:5000/get_ip",
    dataType: 'json',
    async: false,
})

const publicIP = ip.responseText

var streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.mapbox-streets-v8',
    accessToken: 'pk.eyJ1Ijoic2h5ZnRzb2x1dGlvbnMiLCJhIjoiY2o0bGF3Z3d6MHJmeDJxcWg3dXA0dTkyOCJ9.-v0rIY2deWJ7Qm4A4tM52Q'
});

var light = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox-countries-v1',
    accessToken: 'pk.eyJ1Ijoic2h5ZnRzb2x1dGlvbnMiLCJhIjoiY2o0bGF3Z3d6MHJmeDJxcWg3dXA0dTkyOCJ9.-v0rIY2deWJ7Qm4A4tM52Q'
});

var land = L.tileLayer(`http://${publicIP}:8008/WMS?CRS=EPSG:3857&FORMAT=image/png;%20mode=8bit&LAYER=Land&REQUEST=GetGTile&SERVICE=WMS&STYLE=default&TILESIZE=1024&TRANSPARENT=TRUE&VERSION=1.3.0&TILEZOOM={z}&TILECOL={x}&TILEROW={y}`)

var gTile557 = `http://${publicIP}:8008/WMS?CRS=EPSG:3857&{timeControl}&FORMAT=image/png;%20mode=8bit&LAYER={layerName}&REQUEST=GetGTile&SERVICE=WMS&STYLE={style}&TILESIZE=256&TRANSPARENT=TRUE&VERSION=1.3.0&TILEZOOM={z}&TILECOL={x}&TILEROW={y}&PASSTHROUGH=true&NAME=EzE`;

var gTileURL = `http://${publicIP}:8008/WMS?FORMAT=image/png&CRS=EPSG:900913&LAYER={layerName}&REQUEST=GetGTile&SERVICE=WMS&TRANSPARENT=TRUE&VERSION=1.3.0&TILEZOOM={z}&TILECOL={x}&TILEROW={y}`;

var awsURL = `http://${publicIP}:8008/WMS?FORMAT=image/png&CRS=EPSG:900913&LAYER={layerName}&REQUEST=GetGTile&SERVICE=WMS&TRANSPARENT=TRUE&VERSION=1.3.0&TILEZOOM={z}&TILECOL={x}&TILEROW={y}`;

var gTileURL = `http://${publicIP}:8008/WMS?FORMAT=image/png&CRS=EPSG:3857&LAYER={layerName}&REQUEST=GetGTile&SERVICE=WMS&TRANSPARENT=TRUE&VERSION=1.3.0&TILEZOOM={z}&TILECOL={x}&TILEROW={y}`;
var gTileGoogle = `http://${publicIP}:8008/WMS?FORMAT=image/png&CRS=EPSG:900913&LAYER={layerName}&REQUEST=GetGTile&SERVICE=WMS&TRANSPARENT=TRUE&VERSION=1.3.0&TILEZOOM={z}&TILECOL={x}&TILEROW={y}`;

var gTileURLwTime = `http://${publicIP}:8008/WMS?FORMAT=image/png&CRS=EPSG:900913&LAYER={layerName}&TIME={time}&REQUEST=GetGTile&SERVICE=WMS&TRANSPARENT=TRUE&VERSION=1.3.0&TILEZOOM={z}&TILECOL={x}&TILEROW={y}`;

var gTiletestURLwTime = `http://${publicIP}:8008/WMS?FORMAT=image/png&CRS=EPSG:900913&LAYER={layerName}&TIME={time}&REQUEST=GetGTile&SERVICE=WMS&TRANSPARENT=TRUE&VERSION=1.3.0&TILEZOOM={z}&TILECOL={x}&TILEROW={y}`;

var gTileURLRunForecast = `http://${publicIP}:8008/WMS?FORMAT=image/png&CRS=EPSG:900913&LAYER={layerName}&DIM_RUN={run}&DIM_FORECAST={forecast}&REQUEST=GetGTile&SERVICE=WMS&TRANSPARENT=TRUE&VERSION=1.3.0&TILEZOOM={z}&TILECOL={x}&TILEROW={y}`;

var restURL = 'https://wx.shyftsolutions.io/api/layer/{layerName}/{z}/{x}/{y}';

var nwsWWA = 'https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer/WMSServer?';

var MRMS = `http://${publicIP}:8008/WMS?CRS=EPSG:3857&FORMAT=image/png;%20mode=8bit&LAYER=MRMS&REQUEST=GetGTile&SERVICE=WMS&STYLE=default&TILESIZE=1024&TRANSPARENT=TRUE&VERSION=1.3.0&TILEZOOM={z}&TILECOL={x}&TILEROW={y}`


var runForecast557 = 'DIM_FORECAST=PT6H&DIM_RUN=2019-05-21T06:00:00Z';

var baseLayers = {
    "Land" : land,
    'Streets': streets
};

var overlayMaps = {
    //hq.shyftwx.com/WMS?request=GetMap&service=WMS&version-1.3.0&format=image/png&layers=GEFS-Precipitation_Probability
    // request=GetMap&service=WMS&BBOX=-95,30,-80,45&version=1.3.0&format=image/png&layers=0&styles=default&srs(crs)=CRS:84
    'MRMS': L.tileLayer.betterWms(MRMS, {
        layerName: 'MRMS'
    }),

    'Tru GFS Winds': L.tileLayer(gTileURL, {
        layerName: 'GFS-Wind'
    }),

    'Surface Temperature': L.tileLayer(awsURL, {
        layerName: 'GFS-Temperature'
    }),

    'Hot Cold': L.tileLayer(awsURL, {
        layerName: 'Hot-Cold'
    }),

    'Geopotential Height': L.tileLayer(awsURL, {
        layerName: 'Geopotential-Height'
    }),
    
    // 'NWS WWA': L.tileLayer.betterWms(nwsWWA, {
    //     layers: '0',
    //     transparent: true,
    //     format: 'image/png'
    // }),

    // '557 CDFSII Global': L.tileLayer(gTile557,{
    //     layerName: 'CDFSII_GLOBAL_DISK_IR',
    //     style: 'GFS-GLOBAL_IR_MB',
    //     timeControl: 'TIME=2019-04-19T15:45:00Z'
    // }),

    // '557 MRMS Composite Reflectivity': L.tileLayer(gTile557,{
    //     layerName: 'MRMS_CONUS_Composite_Refl_QC',
    //     style: 'default',
    //     timeControl: 'TIME=2019-04-19T15:44:16Z'
    // }),

    // '557 GALWEM Vorticity': L.tileLayer(gTile557,{
    //     layerName: 'GALWEM_SevereWx_Abs_Vort_Advection',
    //     style: 'default',
    //     timeControl: runForecast557
    // }),

    // '557 GALWEM Temp': L.tileLayer(gTile557,{
    //     layerName: 'GALWEM_Surface_Temperature_in_F',
    //     style: 'Temperatures_in_F',
    //     timeControl: runForecast557
    // }),

    // '557 GALWEM Wind': L.tileLayer(gTile557,{
    //     layerName: 'GALWEM_Surface_Winds',
    //     style: 'default',
    //     timeControl: runForecast557
    // }),


    // 'Tru Surface Temperature': L.tileLayer(gTileURL, {
    //     layerName: 'TWS-Temperature'
    // }),

    // 'TWS G16-WV': L.tileLayer(gTiletestURLwTime, {
    //     layerName: 'GOES16-WV',
    //     time: '2019-02-13T01:32:00Z'
    // }),

    // 'TWS G16-IR': L.tileLayer(gTiletestURLwTime, {
    //     layerName: 'GOES16-IR',
    //     time: '2019-02-13T01:32:00Z'
    // }),

    // 'Tru HRRR Temp': L.tileLayer(gTileURL, {
    //     layerName: 'HRRR-Temperature'
    // }),

    // 'Tru HRRR Vis': L.tileLayer(gTileURL, {
    //     layerName: 'HRRR-Visibility'
    // }),

    // 'Tru HRRR Wind': L.tileLayer(gTileURL, {
    //     layerName: 'HRRR-Wind'
    // }),

    // 'Tru GFS FL Winds and Temp': L.tileLayer(gTileURL, {
    //     layerName: 'GFS-FL_Winds_and_Temperature'
    // }),

    

    // 'Tru HRRR Wind': L.tileLayer(gTileURL, {
    //     layerName: 'HRRR-Wind'
    // }),

    // 'Tru Borders 3857': L.tileLayer(gTileURL, {
    //     layerName: 'BlackBorders'
    // }),

    // 'Tru Borders 900913': L.tileLayer(gTileGoogle, {
    //     layerName: 'BlackBorders'
    // }),


    // 'Tru HRRR Radar Winter': L.tileLayer(gTileURL, {
    //     layerName: 'HRRR-Composite_Reflectivity-Winter'
    // }),

    // 'Tru MRMS Winter': L.tileLayer(gTileURL, {
    //     layerName: 'MRMS-Composite_Reflectivity-Winter'
    // }),

    // 'Tru MRMS': L.tileLayer(gTileURL, {
    //     layerName: 'MRMS-Composite_Reflectivity'
    // }),

    // 'GOES-16 Vis': L.tileLayer(awsURL, {
    //     layerName: 'GOES_16_VIS'
    // }),


    // 'GOES-16 Vis True Color': L.tileLayer(awsURL, {
    //     layerName: 'GOES_16_TC'
    // }),

    // 'GOES-16 IR': L.tileLayer(awsURL, {
    //     layerName: 'GOES_16_IR'
    // }),

    // 'GOES-16 Water Vapor': L.tileLayer(awsURL, {
    //     layerName: 'GOES_16_WV'
    // }),


    

    // 'MRMS Reflectivity': L.tileLayer(awsURL, {
    //     layerName: 'MRMS_Base_Reflectivity'
    // }),

    // 'MRMS Composite': L.tileLayer(awsURL, {
    //     layerName: 'MRMS_Composite_Reflectivity'
    // }),

    // 'Echo Tops': L.tileLayer(gTileURL, {
    //     layerName: 'Echo_Tops'
    // }),

    // 'METAR Observations': L.tileLayer(awsURL, {
    //     layerName: 'METAR'
    // }),

    // 'Flight Level Winds & Temp': L.tileLayer(awsURL, {
    //     layerName: 'GFS-FL_Winds_and_Temperature'
    // }),

    // 'FITL': L.tileLayer(gTileURL, {
    //     layerName: 'FITL'
    // }),

    // 'Borders': L.tileLayer(gTileURL, {
    //     layerName: 'Borders'
    // })

};

var mymap = L.map('mapid', {
    center: [40, -100],
    zoom: 2,
    layers: land
}).setView([40, -95], 5);

L.easyButton( '<i class="material-icons">satellite</i>', function() {
    generateCrossSection()
}).addTo(mymap);

L.control.layers(baseLayers, overlayMaps).addTo(mymap);


var logo = L.control({position: 'bottomright'});
logo.onAdd = function(map){
    var div = L.DomUtil.create('div', 'myclass');
    div.innerHTML= "<img src='../res/logo.png' width='388' height='73'/>";
    return div;
};
// logo.addTo(mymap);

L.control.mousePosition({emptyString: '-- : --'}).addTo(mymap);


// Create new empty polyline and add it to the map
// var polyline = new L.Polyline([]).addTo(mymap);
//
// var markerGroup = L.layerGroup().addTo(mymap);
//
// // Handle map click event
// mymap.on('click', function(event) {
//
//     // New marker on coordinate, add it to the map
//     var marker = new L.Marker(event.latlng, {draggable: true}).addTo(markerGroup);
//     marker.bindPopup("<input type='button' value='Delete this marker' class='marker-delete-button'/>");
//     marker
//         .on("popupopen", onPopupOpen)
//         .on('dragstart', dragStartHandler)
//         .on('drag', dragHandler)
//         .on('dragend', dragEndHandler);
//
//     // Add coordinate to the polyline
//     polyline.addLatLng(event.latlng);
//
// });
//
// function dragStartHandler () {
//     var latlngs = polyline.getLatLngs(),
//         latlng = this.getLatLng();
//     for (var i = 0; i < latlngs.length; i++) {
//         if (latlng.equals(latlngs[i])) {
//             this.polylineLatlng = i;
//         }
//     }
// }
//
// function dragHandler () {
//     var latlngs = polyline.getLatLngs(),
//         latlng = this.getLatLng();
//     latlngs.splice(this.polylineLatlng, 1, latlng);
//     polyline.setLatLngs(latlngs);
// }
//
// function dragEndHandler () {
//     delete this.polylineLatlng;
// }
//
// function onPopupOpen() {
//     var tempMarker = this;
//     markerGroup.removeLayer(tempMarker._leaflet_id);
//     var latlngs = polyline.getLatLngs(),
//         latlng = this.getLatLng();
//     for (var i = 0; i < latlngs.length; i++) {
//         if (latlng.equals(latlngs[i])) {
//             this.polylineLatlng = i;
//             latlngs.splice(this.polylineLatlng, 1);
//             polyline.setLatLngs(latlngs);
//         }
//     }
// }
//
// function generateCrossSection() {
//     var crosssectionurl = "https://wx.shyftsolutions.io/WMSV?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MRMS-Cross_Section&WIDTH=800&HEIGHT=1100&CRS=CRS:1&BBOX=0,0,1,1&DIM_PLACE=";
//     var latlngs = polyline.getLatLngs();
//     for (var i = 0; i < latlngs.length; i++) {
//         crosssectionurl += "EPSG:4326[" + latlngs[i]["lng"].toFixed(2) + ";" + latlngs[i]["lat"].toFixed(2) + "]";
//         if (i < latlngs.length -1) {
//             crosssectionurl += "+"
//         }
//     }
//     console.log(crosssectionurl);
//     window.open(crosssectionurl, '_blank');
// }

