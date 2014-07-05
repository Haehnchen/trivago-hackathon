$(document).ready(function () {
	$("#maps_canvas").gmap({'center': new google.maps.LatLng(51.2384547,6.8143503), 'zoom': 11});
	window.addMarker = function (options){
		var $mapscanvas = $("#maps_canvas");
		var icon = {
			path: 'M -10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
			fillColor: 'yellow',
			fillOpacity: 0.8,
			scale: 1,
			strokeColor: 'gold',
			strokeWeight: 14
		};
		$.extend(options, {'map': $mapscanvas});
		$mapscanvas.gmap('addMarker', { 'position': '51.2384545,6.8143501', 'marker': google.maps.MarkerWithLabel, 'icon': icon });
	};
	addMarker();
});