var $loading = $('#loader').hide();


function runPyScript(callback) {
    let startLocation = $("#startLocation").val();
    let endLocation = $("#endLocation").val();
    
    $.ajax({
        type: "POST",
        data: { start_location: startLocation, end_location: endLocation },
        url: "http://127.0.0.1:5000/",
        dataType: 'json',
        beforeSend: function() {
            $loading.show();
        },
        complete: function() {
            $loading.hide();
        },
        success: function(response) {
            // Invoke the callback with the response data
            callback(response);
        },
        error: function(xhr, status, error) {
            // Handle any errors
            console.error(error);
        }
    });
}

var markers = L.layerGroup().addTo(mymap);

$('#search-form').submit(function(e) {
    e.preventDefault();
    
    let tempRange = Number($("#tempRange").val());
    let windRange = Number($("#windRange").val());
    let rainCheck = $('#rainCheck').is(":checked");
    
    // Call runPyScript and pass a callback function to handle the response
    runPyScript(function(result) {
        if (mymap.hasLayer(markers)) {
            markers.clearLayers();
        }
        
        for (let x of result) {
            let noRain = true;
            if (rainCheck && Number(x.weatherImpact.total_precipitation) > 0) {
                noRain = false;
            }
            let midpoint = x.midpoint;
            let latlng = L.latLng(midpoint[0], midpoint[1]);
            let tempColor = '';
            if (x.weatherImpact.temp < tempRange && x.weatherImpact.wind_speed < windRange && noRain) {
                tempColor = 'green';
            } else {
                tempColor = 'red';
            }
            let marker = L.circleMarker(latlng, {radius: 5, color: tempColor}).addTo(mymap).bindPopup(`<p><span style="font-weight: bold;">Time at location:</span> ${x.validTime}</p><p>Temperature: ${x.weatherImpact.temp}&#x2109;</p><p>Wind Speed: ${x.weatherImpact.wind_speed} mph</p><p>Rain: ${x.weatherImpact.total_precipitation} inches</p>`);
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            marker.addTo(markers);
        }
    });
});