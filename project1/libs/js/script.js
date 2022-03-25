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


	L.easyButton('<img width="30px" src="img/geography.png">', function(btn, map) {

		$('#geographyModal').modal('show');
		
	}, 'Geography', 'geographyButton').addTo(map);


	L.easyButton('<img width="30px" src="img/demographic.png">', function(btn, map) {

		$('#demographicsModal').modal('show');
		
	}, 'Demographics', 'demographicsButton').addTo(map);


	L.easyButton('<img width="30px" src="img/weather.png">', function(btn, map) {

		$('#weatherModal').modal('show');
		
	}, 'Weather', 'weatherButton').addTo(map);


	L.easyButton('<img width="30px" src="img/gallery.png">', function(btn, map) {

		$('#galleryModal').modal('show');
		
	}, 'Photo Gallery', 'galleryButton').addTo(map);


	L.easyButton('<img width="30px" src="img/event.png">', function(btn, map) {

		$('#holidayModal').modal('show');
		
	}, 'Public Holidays', 'holidayButton').addTo(map);
	

	L.easyButton('<img width="30px" src="img/live.png">', function(btn, map) {

		$('#newsModal').modal('show');
		
	}, 'Recent News', 'newsButton').addTo(map);
	
	
	L.easyButton('<i class="fa-solid fa-building"></i>', function(btn, map) {

		if(map.hasLayer(citiesMarkers)){
			map.removeLayer(citiesMarkers)
		 }
		 else {map.addLayer(citiesMarkers)}
		
	}, 'Hide/Show Citites', 'toggleCitiesButton').setPosition('bottomleft').addTo(map);


	L.easyButton('<i class="fa-solid fa-plane-departure"></i>', function(btn, map) {

		if(map.hasLayer(airportMarkers)){
			map.removeLayer(airportMarkers)
		 }
		 else {map.addLayer(airportMarkers)}
		
	}, 'Hide/Show Airports', 'toggleAirportsButton').setPosition('bottomleft').addTo(map);


	L.easyButton('<i class="fa-solid fa-landmark-flag"></i>', function(btn, map) {

		if(map.hasLayer(capitalMarker)){
			map.removeLayer(capitalMarker)
		 }
		 else {map.addLayer(capitalMarker)}
		
	}, 'Hide/Show Capital', 'toggleCapitalButton').setPosition('bottomleft').addTo(map);

	map.setView(new L.LatLng(40.52, 34.34), 2);


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
		
			$('.alert').show()
		}
		
		function success(position) {

			let lat = position.coords.latitude;
			let lng = position.coords.longitude;

			$('#lat').html(lat);
			$('#lng').html(lng);

			// let locationIcon = L.ExtraMarkers.icon({
			// 	icon: 'fa-person',
			// 	markerColor: 'red',
			// 	shape: 'square',
			// 	prefix: 'fa'
			//   });

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

						let countryCode = result.data.results[0].components["ISO_3166-1_alpha-2"];

						//Changing dropdown value to current country and triggering onchange events
				
						$('#countryList').val(countryCode).change();

						L.easyButton('<i class="fa-solid fa-location-arrow"></i>', function(btn, map) {
		
						$('#countryList').val(countryCode).change();		
		
						}, 'Take me to my country', 'locationyButton').setPosition('bottomleft').addTo(map);
					
					}
				
				},
				error: function(jqXHR, textStatus, errorThrown) {
					
					console.log(jqXHR);
				}
		
				})
	
				}
		
				function fail() {

					$('.alert').show()
						
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

		})
		.then(result => {	

			$.ajax({
				url: 'libs/php/getCities.php',
				type: 'POST',
				dataType: 'json',
				data: {
					countryISO: $('#countryList').val(),
					north: result.data[0].north,
					south: result.data[0].south,
					east: result.data[0].east,
					west: result.data[0].west
				},
	
				success: function(result) {

										
					if (result.status.name == "ok") {

													
					renderCities(result.data.geonames);
								
					}
				
				},
				error: function(jqXHR, textStatus, errorThrown) {
					
					console.log(jqXHR);
				}
			})

			return result;

		})	
		.then(result => {
			
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

						
						let capitalIcon = L.ExtraMarkers.icon({
							icon: 'fa-landmark-flag',
							markerColor: 'orange',
							shape: 'square',
							prefix: 'fa'
						  });
						
						capitalMarker = L.marker([capitalCoordinates.lat, capitalCoordinates.lng], {icon: capitalIcon}).addTo(map).bindTooltip(capitalName, 
							{
								permanent: true, 
								direction: 'bottom'
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

	$('#countryList').on('change', function getNews() {

		let countryName = $('#countryList option:selected').text()
		let countryNameString = countryName.split(' ').length <= 1 ? countryName : countryName.split(' ').join('%20');
		
		$.ajax({
			url: 'libs/php/getNews.php',
			type: 'POST',
			dataType: 'json',
			data: {
				countryName: countryNameString,
			},

			success: function(result) {
				
				if (result.status.name == "ok") {
					
					
				renderNews(result.data.articles)
							
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				
				console.log(jqXHR);
			}
		});

	});
	

	$('#countryList').on('change', function getPublicHolidays() {

		
		$.ajax({
			url: 'libs/php/getPublicHolidays.php',
			type: 'POST',
			dataType: 'json',
			data: {
				
				countryISO: $('#countryList').val()
			},

			success: function(result) {
				
				if (result.status.name == "ok") {

					renderHolidays(result.data)
					
											
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
	let citiesMarkers;

	function renderCities(data) {
		
		if (citiesMarkers) {
			citiesMarkers.clearLayers()
		}

		let cityIcon = L.ExtraMarkers.icon({
			icon: 'fa-building',
			markerColor: 'green-dark',
			shape: 'square',
			prefix: 'fa'
		  })


		citiesMarkers = new L.MarkerClusterGroup();

		
		data.forEach(element => {
			
			if (element.countrycode !== $('#countryList').val()) {
				
				return
			}

			if (element.fcodeName === "capital of a political entity") {
				
				return
			}
			
			let marker = L.marker([element.lat, element.lng], {icon: cityIcon});
			
			let htmlString = '<a target="_blank" href="http://' + element.wikipedia + '"><div class="text-center"><img width="30px" style="border-radius: 20px;" src="img/wikipedia.jpg"></div><p class="text-center">' + element.name + '</p></a>'
				
			marker.bindPopup(htmlString);
			citiesMarkers.addLayer(marker);
		});


		map.addLayer(citiesMarkers);
	}


	let airportMarkers;
	function renderAirports(data) {
		
		if (airportMarkers) {
			airportMarkers.clearLayers()
		}

		
		let airportIcon = L.ExtraMarkers.icon({
			icon: 'fa-plane-departure',
			markerColor: 'blue',
			shape: 'square',
			prefix: 'fa'
		  })


		airportMarkers = new L.MarkerClusterGroup();

		data.forEach(element => {

			let marker = L.marker([element.lat, element.lng], {icon: airportIcon});
			marker.bindTooltip(element.name, 
    			{direction: 'right'
    			});

			airportMarkers.addLayer(marker);
		});


		map.addLayer(airportMarkers);
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
		$('#area').html(Number(data.areaInSqKm).toLocaleString());	
		$('#capitalCity').html(data.capital);
	
		renderLanguageNames(data.languages);
	
		$('#population').html(Number(data.population).toLocaleString());
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

		if (urlArray.length === 0 ) {
			$('#carouselControls').html('No Photos Currently Available');
			return
		}
			
		$('#carouselControls').html('');
	
		let htmlString = '<div class="carousel-inner">'
		
		urlArray.forEach((element, index) => {
	
				if (index=== 0) {
	
				htmlString += '<div class="carousel-item active"><div class="text-center"><img src=' + element.webformatURL + 'class="d-block w-100 img-fluid" alt="..."></div></div>';
	
			} else {
				htmlString += '<div class="carousel-item"><img height="300px" src=' + element.webformatURL + ' class="d-block w-100 img-fluid" alt="..."></div>';
			}
	
			
	
		})
	
		htmlString += '<button class="carousel-control-prev" type="button" data-bs-target="#carouselControls" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselControls" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>';
	
		$('#carouselControls').html(htmlString);
		
	}
	
	
	function renderWeather(data) {
		// removing region and underscore
		let capitalName = data.timezone.split('/')[1].replace('_', ' ');

		$('#weatherLocation').html(capitalName);

		$('#todayWeatherImage').html('<img src="http://openweathermap.org/img/wn/' + data.daily[0].weather[0].icon + '@2x.png">');
		$('#todayMax').html(Math.round(data.daily[0].temp.max));
		$('#todayMin').html(Math.round(data.daily[0].temp.min));

		let htmlString = '';

		for (let i=1; i<5; i ++) {
			
			if (i ===1) {
				
				htmlString += '<div class="col me-2" style="background-image: url(\'img/darkoverlay.png\')"><div class="text-center"><p>Tomorrow</p><div><img src="http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png"></div><div class="text-start"><p><i class="fa-solid fa-temperature-arrow-up"></i>&nbsp;' + Math.round(data.daily[i].temp.max) + '&#176C&nbsp;&nbsp;</p><p><i class="fa-solid fa-temperature-arrow-down"></i>&nbsp;' + Math.round(data.daily[i].temp.min) + '&#176C</p></div></div></div>'

			} else if (i === 4) {
				//no margin in last background
				let date = String(new Date(data.daily[i].dt * 1000));
				htmlString += '<div class="col" style="background-image: url(\'img/darkoverlay.png\')"><div class="text-center"><p>' + date.substring(0,4) + '</p><div><img src="http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png"></div><div class="text-start"><p><i class="fa-solid fa-temperature-arrow-up"></i>&nbsp;' + Math.round(data.daily[i].temp.max) + '&#176C&nbsp;</p><p><i class="fa-solid fa-temperature-arrow-down"></i>&nbsp;' + Math.round(data.daily[i].temp.min) + '&#176C</p></div></div></div>'


			}
			
			
			else {

				// converting unix time
				let date = String(new Date(data.daily[i].dt * 1000));
								
				htmlString += '<div class="col me-2" style="background-image: url(\'img/darkoverlay.png\')"><div class="text-center"><p>' + date.substring(0,4) + '</p><div><img src="http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png"></div><div class="text-start"><p><i class="fa-solid fa-temperature-arrow-up"></i>&nbsp;' + Math.round(data.daily[i].temp.max) + '&#176C&nbsp;</p><p><i class="fa-solid fa-temperature-arrow-down"></i>&nbsp;' + Math.round(data.daily[i].temp.min) + '&#176C</p></div></div></div>'
			}

		}
		
		$('#weatherFollowingDays').html(htmlString);

		
	}

	function renderNews(array) {

		// filter out duplicates
		array = array.filter((value, index, self) =>
		index === self.findIndex((t) => (
		t.title === value.title ))
		)
		
		$('#carouselExampleCaptions').html('');

		let htmlString = '<div class="carousel-inner">';

			
		array.forEach((element, index) => {

			if (index === 0 ) {

				htmlString+= '<div class="carousel-item active"><img width="500px" src="' + element.image + '"class="d-block w-100" alt="..."><div class="carousel-caption d-md-block"><a class="text-decoration-none " href="' + element.url + '" target="_blank"><h5>' + element.title + '</h5></a><p></p></div></div>'

			} else  {

				htmlString+= '<div class="carousel-item"><img src="' + element.image + '"class="d-block w-100" alt="..."><div class="carousel-caption d-md-block"><a class="text-decoration-none" href="' + element.url + '" target="_blank"><h5>' + element.title + '</h5></a><p></p></div></div>'
		
		}

		});

		htmlString += '</div><button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span>	<span class="visually-hidden">Previous</span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>';

		$('#carouselExampleCaptions').html(htmlString);
	}




	function renderHolidays(holidaysArray) {

		if (!holidaysArray) {
			$('#holidayModalBody').html('<p>No data currently available for chosen country</p>');
			return

		}

		//filtering out duplicate holidays
		holidaysArray = holidaysArray.filter((value, index, self) =>
		index === self.findIndex((t) => (
		t.name === value.name ))
		)

		
		$('#holidayModalBody').html('');

		let htmlString = '<table class="table table-striped"><thead><th>Date</th><th>Name</th></thead><tbody>'


		for (let i = 0; i < holidaysArray.length; i++) {

			if (holidaysArray[i].name === "Regional Holiday") {continue};

			let formatedDate = String(Date.parse(holidaysArray[i].date)).substring(4,10);
			
			htmlString += '<tr><td>' + formatedDate + '</td><td>' + holidaysArray[i].name + '</td></tr>'

		}

		htmlString += '</tbody></table>'
		$('#holidayModalBody').html(htmlString );

		

}

});
