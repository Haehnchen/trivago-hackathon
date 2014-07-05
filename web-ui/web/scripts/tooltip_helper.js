var hotelApiBackend = '/Webservice/hotel/dortmund?callback=?';

var addMarkerTooltipEvents = function(marker, markerTemplate) {

    var tooltip = new Tooltip({map: marker.map}, marker);
    tooltip.bindTo("text", marker, "tooltip");

    google.maps.event.addListener(marker, 'mouseover', function() {

        $.getJSON(hotelApiBackend, function(data) {
            var foo = markerTemplate;

            for (var k in data){
                foo = foo.replace('%' + k + '%', data[k]);
            }

            tooltip.addTip(foo);
            tooltip.getPos2(marker.getPosition());
        });

    });

    google.maps.event.addListener(marker, 'mouseout', function() {
        tooltip.removeTip();
    });

}

var addMarkerWithTooltip = function(options) {

    var marker = new google.maps.Marker(options);
    addMarkerTooltipEvents(marker, options.markerTemplate);

    return marker;
};