var hotelApiBackend = '/Webservice/hotel/';

var markerTemplate = '<div class="row"><div class="col-md-6"><h2 class="name">%name%</h2><div class="rating">Rating: %rating%</div><div class="price rating">Preis: %price%</div></div><div class="col-md-6"><img src="%imageURL%"></div></div><div class="description">%description%</div>';

var addMarkerTooltipEvents = function(marker, markerTemplate, id) {

    var tooltip = new Tooltip({map: marker.map}, marker);
    tooltip.bindTo("text", marker, "tooltip");

    var myVar;
    var xhr;

    google.maps.event.addListener(marker, 'mouseover', function() {

        $('.gmap-tooltip').remove();
        clearTimeout(myVar);

        myVar = setTimeout(function(){
            xhr = $.getJSON(hotelApiBackend + id + '?callback=?', function(data) {
                var foo = markerTemplate;


                data['price'] = (Math.round(parseFloat(data['price']) * 100) / 100) + ' &euro;';

                for (var k in data){
                    foo = foo.replace('%' + k + '%', data[k]);
                }

                $('.gmap-tooltip').remove();

                tooltip.addTip(foo);
                tooltip.getPos2(marker.getPosition());
            });
        }, 200);

    });

    google.maps.event.addListener(marker, 'mouseout', function() {
        if(xhr){
            xhr.abort();
        }
        clearTimeout(myVar);
        tooltip.removeTip();
        $('.gmap-tooltip').remove();
    });

};

var addMarkerWithTooltip = function(options) {

    var marker = new google.maps.Marker(options);
    addMarkerTooltipEvents(marker, options.markerTemplate);

    return marker;
};


$(function() {

    $("#maps_canvas").on("markerAdded", function(event, param1) {

        if(param1.additional.type == 'selected') {
            return;
        }

        addMarkerTooltipEvents(param1.marker, markerTemplate, param1.additional.id);
    });

});