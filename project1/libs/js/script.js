let map = L.map('map').locate({setView: true, maxZoom: 6});


L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=X3eTl1pQfAaR1PxRqddg', {
	attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
	maxZoom: 6
}).addTo(map);;

$.ajax({
	url: 'libs/php/getCountries.php',
	type: 'GET',
	
	success: function(result) {

		console.log(result);
		
		// if (result.status.name == "ok") {

		// 	if (result.data.length === 0) { 
		// 		console.log("No results")

		// 	} else {


			
			// const countries = result.data.map(element => '<li><h3>' + element.title + '</h3><img src="' + element.thumbnailImg + '"/><p>' + element.summary + '</li>');
			// $("#wikiResults").html('<ol>' + countries.join('') + '</ol>');
			
			
		// 	}
		// }
	
	},
	error: function(jqXHR, textStatus, errorThrown) {
		// your error code
	}
}); 