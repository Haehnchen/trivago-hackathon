var hotelApiBackend = '/Webservice/hotel/dortmund?callback=?';

var markerTemplate = '<div class="row"><div class="col-md-6"><h2 class="name">%name%</h2><div class="rating">Rating: %rating%</div><div class="price rating">Preis: %price%</div></div><div class="col-md-6"><img src="%imageURL%"></div></div><div class="description">%description%</div>';


var addMarkerTooltipEvents = function(marker, markerTemplate) {

    var tooltip = new Tooltip({map: marker.map}, marker);
    tooltip.bindTo("text", marker, "tooltip");

    google.maps.event.addListener(marker, 'mouseover', function() {

        $.getJSON(hotelApiBackend, function(data) {
            var foo = markerTemplate;

            data['price'] = (Math.round(parseFloat(data['price']) * 100) / 100) + ' &euro;';

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

};

var addMarkerWithTooltip = function(options) {

    var marker = new google.maps.Marker(options);
    addMarkerTooltipEvents(marker, options.markerTemplate);

    return marker;
};


$(function() {

    $("#maps_canvas").on("markerAdded", function(event, param1) {
        addMarkerTooltipEvents(param1.marker, markerTemplate);
    });

});