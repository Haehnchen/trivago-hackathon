/*
 {"kmPerDay":10,"startDate":1404566640529,"position":{"lat":100.0,"lon":10.0},"priceRange":{"min":20,"max":100}}
 */


$(document).ready(function(){
	var $sl = $('#sl2');
	$sl.slider();
	$sl.on('slide', function (ev) {
		var $sl2 = $('#sl2');
		$("#minPrice").val($sl2.val().split(',')[0]);
		$("#maxPrice").val($sl2.val().split(',')[1]);
	});

	var minmax = $sl.attr("data-slider-value").replace("[","");
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
			url: "/Webservice/city/"+city,
			success: function( msg ) {
				var $mapscanvas = $("#maps_canvas");
				$mapscanvas.trigger('reset');
				console.log("submitData:"+JSON.stringify(msg));
				thrown = false;
				$mapscanvas.trigger('addMarker', {position: msg.lat + "," + msg.lon, additional:{ id:"start", type:'initial' }});
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
			type: "POST",
			dataType: 'jsonp',
			url: "/Webservice/search",
			data: JSON.stringify(data),
			success: function( msg ) {
				console.debug("sendData"+msg);
				$(msg.list).each(function () {
					console.log(this);
					$("#maps_canvas").trigger('addMarker', {position: this.position.lat + "," + this.position.lon,additional:{id:this.id, type:'additional'}});
				})
			}
		});
	}
	var input = /** @type {HTMLInputElement} */(
		document.getElementById('pac-input'));

	var $mapscanvas2 = $("#maps_canvas");
	$mapscanvas2.on('selectMarker', function(e, data){
		console.log(data);
		if(data.position != undefined && typeof data.position != "string")
		{
			if(data.additional != undefined && data.additional.type == 'initial')
				return;
			sendData({lat: data.position.k, lon: data.position.B});
		} else {
			if(data.options.additional != undefined && data.options.additional.type == 'initial')
				return;
			sendData({lat: data.options.position.k, lon: data.options.position.B});
		}
	});

	var thrown = false;
	$mapscanvas2.on('markerAdded', function(e, data){
		if(data.additional.type == 'initial' && !thrown)
		{
			thrown = true;
			$mapscanvas2.trigger('selectMarker', data);
		}
	});

	var autocomplete = new google.maps.places.Autocomplete(input);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
	});
});
