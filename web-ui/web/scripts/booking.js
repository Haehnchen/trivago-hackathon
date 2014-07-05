$(function() {

    $( document ).on( "click", ".remove-circle", function() {
        $(this).closest('.hotel-result').remove();
    });

    $( "#hotel-result" ).click(function(e) {

        e.preventDefault();

        $.ajax({
            url: "/hotel/result"
        }).done(function(data) {
            $( "body" ).append($(data));
        });

    });

});