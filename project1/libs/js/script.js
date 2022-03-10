import { renderCountryDetails, renderCountryPhotos, renderWeather } from './functions.js';


$( document ).ready(function() {

	
	
	function preLoaderHandler(){
		document.getElementById('loader').style.display = 'none';
		}

	preLoaderHandler();

	//Creating a map
	let map = L.map('map').locate({setView: true, maxZoom: 12, minZoom: 5});

	let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 12,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	L.easyButton('<img width="50px" src="img/details.png">', function(btn, map){

		$('#sidebar').show(1000);

		$('#showInfoButton').hide(1000);
	}, 'Show Details', 'showInfoButton').addTo(map);

	$('#hideInfoButton').on('click', function() {
		$('#sidebar').hide(1000);
		$('#showInfoButton').show(1000);
	})



	$.ajax({
		url: 'libs/php/getCountries.php',
		type: 'GET',
		dataType: 'json',
		
		success: function(result) {
				
			if (result.status.name == "ok") {
				
				
				let countryNames = Object.keys(result.data);
				countryNames.sort();
				
				for (const property of countryNames) {
					
					
					$('#countryList').append($('<option></option>').val(result.data[property]).text(property)); 
				}
			
			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	})
	.then(function getLocation() {

		if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, fail);

		} else {
		
		$('#locationBar').html('Geolocation is not supported by this browser and some features might be disabled. Please choose a country from the dropdow menu or click on the map.');
		}
		function success(position) {

			let lat = position.coords.latitude;
			let lng = position.coords.longitude;

			$('#lat').html(lat);
			$('#lng').html(lng);

			let locationIcon = L.icon({
				iconUrl: "https://img.icons8.com/ios-filled/50/000000/user-location.png",
				iconSize: [25,25],
				iconAchor: [12.5, 25]


			})

			let locationMaker = L.marker([lat, lng], {icon: locationIcon}).addTo(map);

		
			$.ajax({
				url: 'libs/php/reverseGeocoding.php',
				type: 'POST',
				dataType: 'json',
				data: {
					lat: lat,
					lng: lng
				},
		
				success: function(result) {
		
					
					if (result.status.name == "ok") {
			
					
					$('#city').html(result.data.results[0].components.city);
					$('#country').html(result.data.results[0].components["ISO_3166-1_alpha-2"]);
					}
				
				},
				error: function(jqXHR, textStatus, errorThrown) {
					
					console.log(jqXHR);
				}
		
			})
			.then( (result) => {
				let countryCode = result.data.results[0].components["ISO_3166-1_alpha-2"];
				
				$('#countryList').val(countryCode).change();
				$('#radar').on('click', ()=> {
					$('#countryList').val(countryCode).change();
				})
		
			})
			.catch(error => console.log(error));
		
			
			
		}
		
		function fail()
			{
				$('#locationBar').html('Could not obtain location and some eatures might be disabled. Please choose a country from the dropdow menu or click on the map.');
			
			}
	})
	.catch(error => console.log(error));

	
	//Fetching Country info from API
	let capitalMarker;
	$('#countryList').on('change', function getCountryInfo() {
		
		$.ajax({
			url: 'libs/php/getCountryInfo.php',
			type: 'POST',
			dataType: 'json',
			data: {
				countryISO: $('#countryList').val()
			},

			success: function(result) {

				
				if (result.status.name == "ok") {
				
			
				renderCountryDetails(result.data[0]);

				$.ajax({
					url: 'libs/php/getFlags.php',
					type: 'POST',
					dataType: 'json',
					data: {
						countryISO: result.data[0].countryCode
					},
			
			
					success: function(result) {
						
						if (result.status.name == "ok") {
						
						$('#flag').html('<img width=50px src="' + result.data[0].flags.svg + '" />'); 
						$('#coatOfArms').html('<img width=50px src="' + result.data[0].coatOfArms.svg + '" />')
						
									
						}
					
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR);
					}
				})

				return result
				
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}

		}).then(result => {
			
			let capitalName = result.data[0].capital;
		

			let capitalString = capitalName.split(' ').length <= 1 ? capitalName : capitalName.split(' ').join('%20');
			

			$.ajax({
				url: 'libs/php/forwardGeocoding.php',
				type: 'POST',
				dataType: 'json',
				data: {
					capital: capitalString
				},
		
				success: function(result) {
		
					
					if (result.status.name == "ok") {
						
						if (capitalMarker) {
							capitalMarker.remove()
						}
						let capitalCoordinates = result.data.results[0].geometry;

						let capitalIcon = L.icon({
							iconUrl: "https://img.icons8.com/ios/50/000000/city.png",
							iconSize: [30,30],
							iconAchor: [15, 50]
				
				
						});

						
						capitalMarker = L.marker([capitalCoordinates.lat, capitalCoordinates.lng], {icon: capitalIcon}).addTo(map).bindTooltip(capitalName, 
							{
								permanent: true, 
								direction: 'right'
							});
					
					return result;					
						
					}
				
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
				}
		
			})
			.then(result =>{

				$.ajax({
					url: 'libs/php/getWeather.php',
					type: 'POST',
					dataType: 'json',
					data: {
						lat: result.data.results[0].geometry.lat,
						lng: result.data.results[0].geometry.lng
					},
			
			
					success: function(result) {
						
						if (result.status.name == "ok") {
						
						renderWeather(result.data);
						return result;
									
						}
					
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR);
					}
					
				})
							
			})
			.then(() => {
				$.ajax({
					url: 'libs/php/getAirports.php',
					type: 'POST',
					dataType: 'json',
					data: {
						countryISO: $('#countryList').val()
					},
		
					success: function(result) {
		
						
						if (result.status.name == "ok") {
						
							
							renderAirports(result.data.response);	
						
							
							
						}
					
					},
					error: function(jqXHR, textStatus, errorThrown) {
						console.log(jqXHR);
					}
		
				})

			}

			)
			.catch(error => console.log(error))

			

		})
		
		
	})

	
	let markers;

	function renderAirports(data) {
		
		if (markers) {
			markers.clearLayers()
		}

		let airportIcon = L.icon({
			iconUrl: "img/plane.png",
			iconSize: [30,30],
			iconAchor: [15, 50]


		});


		markers = new L.MarkerClusterGroup();

		data.forEach(element => {
			let marker = L.marker([element.lat, element.lng], {icon: airportIcon});
			marker.bindTooltip(element.name, 
    			{permanent: true, 
        		direction: 'right'
    			});

			markers.addLayer(marker);
		});


		map.addLayer(markers);
	};

	$('#countryList').on('change', () => {

			
			$.ajax({
				url: 'libs/php/getCountryPhotos.php',
				type: 'GET',
				dataType: 'json',
				data: {
					countryName: $('#countryList option:selected').text()
				},
			
				success: function(result) {
			
					
					if (result.status.name == "ok") {
								
					renderCountryPhotos(result.data.hits);
						
						
					}
				
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
				}
			
			})
			
			
	})



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
				
								
				
				renderCountryBorders(result.data);
							
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				
				console.log(jqXHR);
			}
		})

	})





	let countryBorder;

	function renderCountryBorders(coordinates) {

		// if (coordinates.length <=1) {
		// 		for (let i = 0; i < coordinates[0].length; i++) {
		// 		let temp = coordinates[0][i][0]
		// 		coordinates[0][i][0] = coordinates[0][i][1];
		// 		coordinates[0][i][1] = temp;} //reversing coordinates for leaflet
				
		// } else 


		// {for (let i = 0; i < coordinates.length; i++) { //for countries with more than one separate teritories
			
		// 	for (let j = 0; j < coordinates[i][0].length; j++) {
		// 		let temp = coordinates[i][0][j][0];
		// 		coordinates[i][0][j][0] = coordinates[i][0][j][1];
		// 		coordinates[i][0][j][1] = temp;

		// 	}
			
		// }}

		
		if (countryBorder) {
			countryBorder.remove();
		}
		countryBorder = L.geoJSON(coordinates, {color:'red'}).addTo(map);
		map.fitBounds(countryBorder.getBounds());
		
	}


	


	//choose country on click

	map.on('click', function(e) {
	
		
		$.ajax({
			url: 'libs/php/reverseGeocoding.php',
			type: 'POST',
			dataType: 'json',
			data: {
				lat: e.latlng.lat,
				lng: e.latlng.lng,
			},

			success: function(result) {

				
				if (result.status.name == "ok") {
				
							
				let countryCode = result.data.results[0].components["ISO_3166-1_alpha-2"];
				
				$('#countryList').val(countryCode).change()
									
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}

		})
	});

});
