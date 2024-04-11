var $loading = $('#loader').hide();


function runPyScript(){
    let startLocation = $("#startLocation").val()
    let endLocation = $("#endLocation").val()
    var data = $.ajax({
        type: "POST",
        data: jQuery.param({start_location: startLocation, end_location: endLocation}),
        url: "http://127.0.0.1:5000/",
        dataType: 'json',
        async: false,
        beforeSend: function() {
            $loading.show();
         },
         complete: function(){
            $loading.hide();
         },
    });

    return data.responseJSON;
}

var markers = L.layerGroup().addTo(mymap);
$('#search-form').submit(function(e){
    e.preventDefault()
    let tempRange = Number($("#tempRange").val())
    let windRange = Number($("#windRange").val())
    let rainCheck = $('#rainCheck').is(":checked")
    result = runPyScript();
    if(mymap.hasLayer(markers)){
        markers.clearLayers()
    }
    for(x of result){
        let noRain = true
        if(rainCheck && Number(x.weatherImpact.total_precipitation) > 0){
            noRain = false
        }
        midpoint = x.midpoint
        var latlng = L.latLng(midpoint[0], midpoint[1]);
        let tempColor = ''
        if (x.weatherImpact.temp < tempRange && x.weatherImpact.wind_speed < windRange && noRain){
            tempColor = 'green'
        }else{
            tempColor = 'red'
        }
        var marker = L.circleMarker(latlng, {radius: 5, color: tempColor}).addTo(mymap).bindPopup(`<p><span style="font-weight: bold;">Time at location:</span> ${x.validTime}</p><p>Temperature: ${x.weatherImpact.temp}&#x2109;</p><p>Wind Speed: ${x.weatherImpact.wind_speed} mph</p><p>Rain: ${x.weatherImpact.total_precipitation}</p>`)
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
        marker.addTo(markers)
    }
});