$( document ).ready(function() {

	//preloader removal
	function preLoaderHandler(){
		document.getElementById('loader').style.display = 'none';
		}

	preLoaderHandler();

	
	//leaflet map and buttons

	let map = L.map('map').locate({setView: true, maxZoom: 12, minZoom: 5});

	let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 12,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	L.easyButton('<img width="30px" src="img/details.png">', function(btn, map) {

		$('#sidebar').show(1000);
		$('#showInfoButton').hide(1000);
		
	}, 'Show Details', 'showInfoButton').addTo(map);


	$('#hideInfoButton').on('click', function() {
		$('#sidebar').hide(1000);
		$('#showInfoButton').show(1000);

		//reload the map after hiding sidebar
		setTimeout(() => {
			map.invalidateSize();
		}, 1000);
		
	})

	//Loading country list
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
	//Setting current location
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
			//Changing dropdown value to current country and triggering onchange events
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
				$('#locationBar').html('Could not obtain your location and some features might be disabled. Please choose a country from the dropdow menu or click on the map.');
			
			}
	})
	.catch(error => console.log(error));

	
	//Start of onchange events
	let capitalMarker;
	$('#countryList').on('change', function getCountryInfo() {
		//Getting country info
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
			
			//Retrieving capital's coordinates
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
				//Retrieving and renderig current weather
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
				//Retrieving and rendering airports
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

			})
			.catch(error => console.log(error));

		}).catch(error => console.log(error));
	})

	//Retrieving and rendering country photos
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
		});

	});

	//Choosing country on click

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


	//Redering Functions

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


	let countryBorder;
	function renderCountryBorders(coordinates) {

				
		if (countryBorder) {
			countryBorder.remove();
		}
		countryBorder = L.geoJSON(coordinates, {color:'green'}).addTo(map);
		map.fitBounds(countryBorder.getBounds());
		
	}

	

	function renderCountryDetails (data) {
		
		$('#country-name-header').html($('#countryList option:selected').text());
		$('#loader').remove();
		$('#area').html(data.areaInSqKm);	
		$('#capitalCity').html(data.capital);
	
		renderLanguageNames(data.languages);
	
		$('#population').html(data.population);
		$('#continent').html(data.continentName);
		$('#currency').html(data.currencyCode);
	
	};
	
	function renderLanguageNames(langCodes) {
	
		let langCodesArray = langCodes.split(',');
	
		const unsupportedLanguageCodes = ['ay', 'rom', 'mos', 'iu', 'sg', 'sre', 'wuu', 'dta', 'pap', 'ktu', 'aa', 'sid', 'fj', 'frp', 'man', 'wof', 'ff', 'kl', 'pov', 'cab', 'miq', 'as', 'bho', 'sat', 'ks', 'kok', 'do', 'mni', 'sit', 'sa', 'lus', 'nc', 'sc', 'rmm', 'swk', 'bm', 'snk', 'mey', 'gag', 'ber', 'vmw', 'hz', 'se', 'brh', 'ho', 'mey', 'tpi', 'ay', 'lo', 'hil', 'war', 'pam', 'bik', 'pag', 'mrw', 'tsg', 'mdh', 'cbk', 'krj', 'sgd', 'msb', 'akl', 'ibg', 'yka', 'mta', 'mwl', 'xal', 'cau', 'ady', 'kv', 'ce', 'tyv', 'cv', 'udm', 'tut', 'mns', 'bua', 'myv', 'mdf', 'chm', 'ba', 'inh', 'tut', 'kbd', 'krc', 'av', 'sah', 'nog', 'tem', 'men', 'tpi', 'ts', 'ss', 've', 'nr', 'fia', 'srn', 'hns', 'se', 'sma', 'arc', 'nan', 'hak', 'hna', 'kbp', 'dag', 'zza', 'lun', 'lue', 'nd', 'bal', 'ilo', 'abx', 'za', 'toi', 'bi', 'zza', 'tet', 'bho'];
		
		let filteredLanguages = langCodesArray.filter(element => !unsupportedLanguageCodes.includes(element))
		
		let languageName = new Intl.DisplayNames(['en'], {
			type: 'language'
		});
	
		$('#languages').html('');  
	
		let array = [];
		filteredLanguages.forEach(element => {
				
			array.push(languageName.of(element))
			return array;	 	
	
		})
	
		$('#languages').html(array.join(', '));
	
	}
	
	function renderCountryPhotos(urlArray) {
			
		$('#carouselControls').html('');
	
		let htmlString = '<div class="carousel-inner">'
		
		urlArray.forEach((element, index) => {
	
				if (index=== 0) {
	
				htmlString += '<div class="carousel-item active"><img height="300px" src=' + element.webformatURL + 'class="d-block w-100 img-fluid" alt="..."></div>';
	
			} else {
				htmlString += '<div class="carousel-item"><img height="300px" src=' + element.webformatURL + ' class="d-block w-100 img-fluid" alt="..."></div>';
			}
	
			
	
		})
	
		htmlString += '<button class="carousel-control-prev" type="button" data-bs-target="#carouselControls" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselControls" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>';
	
		$('#carouselControls').html(htmlString);
		
	}
	
	
	function renderWeather(data) {
	
		$('#temp').html(Math.round(data.main.temp - 271) + '&#176; C');
		$('#weatherDescr').html(data.weather[0].main);
		$('#weather').html('<img src="http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png" >');
		$('#humidity').html(data.main.humidity + '%');
		$('#pressure').html(data.main.pressure+ 'hPa');
		
	}

});
