$(function() {


    var ids = [];

    var hotel_result = function(data) {

        if ($("#hotel-result").length > 0){
            $("#hotel-result").remove();
        }

        $('body').append($(data));
    }

    $(document).on("click", ".remove-circle", function() {
        $(this).closest('.hotel-result').remove();
    });

    $("#maps_canvas").on("selectMarker", function(event, param1) {
        console.log(param1);
        ids.push({'id': Math.floor((Math.random() * 100) + 1)});
        $.post("/hotel/result", { hotels: ids }).done(hotel_result);
    });

    $( "#hotel-result-button" ).click(function(e) {

        e.preventDefault();

        $.ajax({
            url: "/hotel/result"
        }).done(hotel_result);

    });

});