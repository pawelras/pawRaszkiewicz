//Creating a map

let map = L.map('map').locate({setView: true, maxZoom: 12});

// L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=X3eTl1pQfAaR1PxRqddg', {
// 	attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
// 	maxZoom: 6
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
		let latitude = position.coords.latitude;
		let longitude = position.coords.longitude;
		console.log(latitude, longitude);
	  }
	
	  function fail()
		 {
		  Console.log("Could not obtain location");
		 }
  }
  
  

// Fetching Countries List

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
}); 

//Fetching Country info from API

$('#countryList').on('change', function getCountryInfo() {
	console.log($(this).val());
	$.ajax({
		url: 'libs/php/getCountryInfo.php',
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

//Getting and rendering country borders

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
			console.log(result.data);
			let coordinates = Object.values(result.data.features)[0].geometry.coordinates; //removes country number key
			
			console.log(coordinates);
			renderCountryBorders(coordinates);
						
			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	})

})

let polygon;

function renderCountryBorders(coordinates) {
	console.log(coordinates);

	
	if (polygon) {
		polygon.remove();
	}
	polygon = L.polygon(coordinates, {color:'red'}).addTo(map);
	
}
