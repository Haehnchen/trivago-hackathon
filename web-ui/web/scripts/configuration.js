/*
 {"kmPerDay":10,"startDate":1404566640529,"position":{"lat":100.0,"lon":10.0},"priceRange":{"min":20,"max":100}}
 */


$(document).ready(function(){
	$('#sl2').slider();
	$('#sl2').on('slide', function (ev) {
		$("#minPrice").val($('#sl2').val().split(',')[0]);
		$("#maxPrice").val($('#sl2').val().split(',')[1]);
	});


	var minmax=$("#sl2").attr("data-slider-value").replace("[","");
	minmax=minmax.replace("]","");

	minmaxsplit = minmax.split(",");

	$("#minPrice").val(minmaxsplit[0]);
	$("#maxPrice").val(minmaxsplit[1]);

	$("#startDate").datepicker({
		format:"dd/mm/yyyy"
	});

	$( "#travelData" ).submit(function( event ) {
		event.preventDefault();
		var city= $('[name=city]').val();
		$.ajax({
			type:"GET",
			dataType: 'jsonp',
			url: "http://dennis-notebook/Webservice/city/"+city,
			success: function( msg ) {
				console.debug("submitData:"+msg)
				sendData(msg);
			}
		});
	});

	function sendData(cityposition){
		var data = {
			"kmPerDay":$('[name=kmPerDay]').val(),
			"startDate":$('[name=startDate]').val(),
			"position":cityposition,
			"priceRange":{
				"min": $("#minPrice").val(),
				"max":$("#maxPrice").val()
			}
		};

		console.debug(data);

		$.ajax({
			type:"POST",
			dataType: 'jsonp',
			url: "http://dennis-notebook/Webservice/search",
			data: data,
			success: function( msg ) {
				console.debug("sendData"+msg);
				$(msg.list).each(function () {
					console.log(this);
					$("#maps_canvas").trigger('addMarker', {position: this.position,additional:this.id});
				})
			}
		});
	}
	var input = /** @type {HTMLInputElement} */(
		document.getElementById('pac-input'));


	var autocomplete = new google.maps.places.Autocomplete(input);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
	});
})