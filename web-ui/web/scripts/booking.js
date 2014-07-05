$(function() {

    $( document ).on( "click", ".remove-circle", function() {
        $(this).closest('.hotel-result').remove();
    });

    $( "#hotel-result-button" ).click(function(e) {

        e.preventDefault();

        $.ajax({
            url: "/hotel/result"
        }).done(function(data) {

            if ($("#hotel-result").length > 0){
                $("#hotel-result").remove();
            }

            $('body').append($(data));

        });

    });

});