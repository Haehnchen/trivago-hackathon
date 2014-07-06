$(document).ready(function () {
	var $mapscanvas3 = $("#maps_canvas");
	var gmap = $mapscanvas3.gmap({'center': new google.maps.LatLng(51.2384547,6.8143503), 'zoom': 11}).gmap('getMap');
	var directionService = new google.maps.DirectionsService();
	var directionDisplay = new google.maps.DirectionsRenderer({preserveViewport: true, hideRouteList: true, suppressInfoWindows: true});
	directionDisplay.setMap(gmap);
	directionDisplay.setPanel($mapscanvas3[0]);

	var defaultIcon = {
		path: 'M -10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
		fillColor: '#663399',
		fillOpacity: 1,
		strokeWeight: 0
	};

	var selectedIcon = {
		path: 'M -10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
		fillColor: 'green',
		fillOpacity: 1,
		strokeWeight: 0
	};

	var markers = [];
	var selected_markers = [];
	var interval = setInterval(function () {
		$("div[style*=' _gm']").each(function () {
			var $this = $(this);
			$this.css('-webkit-animation-name', 'marker_animation')
				.css('-webkit-animation-iteration-count', '1')
				.css('opacity', 1);
		});
		for(var i = 0; i < markers.length; i++)
		{
			markers[i].setOpacity(1);
		}
	}, 100);

	function renderRoute()
	{
		if(selected_markers.length < 2)
			return;
		var waypoints = [];
		for(var i = 0; i < selected_markers.length; i++)
		{
			var current = selected_markers[i];
			waypoints.push({location:current.position.k + "," + current.position.B, stopover:true});
		}
		var request = {
			origin: $(waypoints).first()[0].location,
			destination: $(waypoints).last()[0].location,
			waypoints: waypoints,
			travelMode: google.maps.TravelMode.WALKING,
			avoidHighways: true
		};
		waypoints.splice(0, 1);
		waypoints.splice(waypoints.length-1, 1);
		console.log(request);
		directionService.route(request, function(response, status) {
			console.log(status);
			if (status == google.maps.DirectionsStatus.OK) {
				directionDisplay.setMap(gmap);
				directionDisplay.setDirections(response);
			}
		});
	}

	function selectMarker(marker)
	{
		console.log(marker);
		marker = $.extend({}, marker, { 'animation': 0, 'opacity': 1, icon: selectedIcon });
		selected_markers.push(marker);
		clearMarker();
		renderRoute();
		gmap.panTo(new google.maps.LatLng(marker.position.k, marker.position.B));
	}

	function generateMarkers(ln, la)
	{
		console.log(ln);
		console.log(la);
		if(ln == null || ln == undefined)
			ln = 51.24619;
		if(la == null || la == undefined)
			la =  6.77034;
		for(var i = 0; i < 100; i++)
		{
			ln *= 100000;
			la *= 100000;
			ln += (Math.round(Math.random()*400) + 400) * (Math.pow(-1, Math.round(Math.random() * 100)));
			la += (Math.round(Math.random()*800) + 800) * (Math.pow(-1, Math.round(Math.random() * 100)));

			ln = Math.round(ln);
			la = Math.round(la);

			ln /= 100000;
			la /= 100000;

			addMarker({position: ln + "," + la});
		}
	}

	window.clearMarker = function (){
		$("#maps_canvas").gmap('clear', 'markers');
		markers = [];
		for(var i = 0; i < selected_markers.length; i++)
		{
			var marker = selected_markers[i];
			addMarker(marker);
		}
	};

	window.resetMarker = function(){
		selected_markers = [];
		clearMarker();
		directionDisplay.setMap(null);
	};

	window.addMarker = function (options) {

		options = $.extend({}, {position: "51.24619,6.77034", 'marker': google.maps.Marker, 'additional': {}, 'icon': defaultIcon, 'animation': 1, opacity: 0}, options);
		var $mapscanvas = $("#maps_canvas");
		var marker = $mapscanvas.gmap('addMarker', options);
		marker.click(function (e) {
			var optionsn = $.extend({}, options, { 'animation': 0, 'opacity': 1 });
			$("#maps_canvas").trigger('selectMarker', { position: options.position.k + "," + options.position.B, additional: options.additional, options: optionsn });
		});
		markers.push(marker[0]);
		$mapscanvas.trigger('markerAdded', {'marker': marker[0], 'additional':options.additional, options:options});
	};

	$mapscanvas3.on('addMarker', function (options, data){
		addMarker(data);
	});

	$mapscanvas3.on('selectMarker', function (e, data) {
		selectMarker(data.options);
	});

	$mapscanvas3.on('reset', function (e, data){
		resetMarker();
	});

	$mapscanvas3.on('clearMarker', function () {
		clearMarker();
	});

	$("#mybutton").click(function () {
		clearMarker();
		generateMarkers(51.24619, 6.77034);
	});
});