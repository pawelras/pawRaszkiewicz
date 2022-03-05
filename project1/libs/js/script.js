//Creating a map

let map = L.map('map').locate({setView: true, maxZoom: 7, minZoom: 6});

// L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=X3eTl1pQfAaR1PxRqddg', {
// 	attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
// 	maxZoom: 7
// }).addTo(map);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 8,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Getting user's location

function getLocation() {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(success, fail);
	} else {
	  console.log("Geolocation is not supported by this browser.");
	}
	function success(position) {

		$('#lat').html(position.coords.latitude);
		$('#lng').html(position.coords.longitude);
		$.ajax({
			url: 'libs/php/countryLookup.php',
			type: 'POST',
			dataType: 'json',
			data: {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			},
	
			success: function(result) {
	
				
				if (result.status.name == "ok") {
		
				console.log(result);
				$('#city').html(result.data.results[0].components.city);
				$('#country').html(result.data.results[0].components["ISO_3166-1_alpha-2"]);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				
				console.log(errorThrown);
			}
	
		})
	
		
		
	  }
	
	  function fail()
		 {
		  Console.log("Could not obtain location");
		 }
  }
  
// Fetching Countries List

// $(document).ready(getLocation())
$.ajax({
	url: 'libs/php/getCountries.php',
	type: 'GET',
	dataType: 'json',
	
	success: function(result) {
            
		if (result.status.name == "ok") {

			
			for (const property in result.data) {
				
				
				$('#countryList').append($('<option></option>').val(result.data[property]).text(property)); 
			}

			
			
		}
	
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(errorThrown);
	}
})
.then(getLocation())
.then( () => {

	 $('#countryList').val('GB').change()

});

//Fetching Country info from API

$('#countryList').on('change', function getCountryInfo() {
	
	$.ajax({
		url: 'libs/php/GetCountryInfo.php',
		type: 'POST',
		dataType: 'json',
		data: {
			countryISO: $('#countryList').val()
		},

		success: function(result) {

			
			if (result.status.name == "ok") {
	
			renderCountryDetails(result);
			
				
				
			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		}

	})
})

function renderCountryDetails(result) {

	$('#country-name-header').html($('#countryList option:selected').text());
	$('#area').html(result.data[0].areaInSqKm);
	$('#capital').html(result.data[0].capital);
	$('#languages').html(result.data[0].languages);
	$('#population').html(result.data[0].population);
	$('#continent').html(result.data[0].continent);

}

$('#countryList').on('change', function getCountryBorders() {

	$.ajax({
		url: 'libs/php/getCountryBorders.php',
		type: 'POST',
		dataType: 'json',
		data: {
			countryISO: $('#countryList').val()
		},


		success: function(result) {
			
			if (result.status.name == "ok") {
			
			let coordinates = Object.values(result.data.features)[0].geometry.coordinates; //removes country number key
			
			renderCountryBorders(coordinates);
						
			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	})

})

let countryBorder;

function renderCountryBorders(coordinates) {

	if (coordinates.length <=1) {
			for (let i = 0; i < coordinates[0].length; i++) {
   			let temp = coordinates[0][i][0]
    		coordinates[0][i][0] = coordinates[0][i][1];
    		coordinates[0][i][1] = temp;}
			console.log(coordinates);
	} else 


	{for (let i = 0; i < coordinates.length; i++) {
		
		for (let j = 0; j < coordinates[i][0].length; j++) {
			let temp = coordinates[i][0][j][0];
			coordinates[i][0][j][0] = coordinates[i][0][j][1];
			coordinates[i][0][j][1] = temp;

		}
		// console.log(coordinates[0][0]);
	}}

	console.log(coordinates);

	// coordinates.forEach(element => {

	// 	element.forEach(subElement => {
	// 		let temp = subElement[0];
    // 		subElement[0] = subElement[1];
    // 		subElement[1] = temp;})

	// 	})
		
	
	// let array = coordinates[0];
	// console.log(array);
		
// 	for (let i = 0; i < array.length; i++) {
//    let temp = array[i][0];
//     array[i][0] = array[i][1];
//     array[i][1] = temp;}
// 	console.log(array);

	var multiPolyLineOptions = {color:'red'};
	

	if (countryBorder) {
		countryBorder.remove();
	}
	countryBorder = L.polyline(coordinates, multiPolyLineOptions).addTo(map);
	map.fitBounds(countryBorder.getBounds());
	
}
