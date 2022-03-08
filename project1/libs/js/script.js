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


$.ajax({
	url: 'libs/php/getCountries.php',
	type: 'GET',
	dataType: 'json',
	
	success: function(result) {
            
		if (result.status.name == "ok") {
			
			console.log(result);
			let countryNames = Object.keys(result.data);
			countryNames.sort();
			
			for (const property of countryNames) {
				
				
				$('#countryList').append($('<option></option>').val(result.data[property]).text(property)); 
			}
		
		}
	
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(errorThrown);
	}
})
.then(function getLocation() {

	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(success, fail);

	} else {
	  
	  $('#locationBar').html('Geolocation is not supported by this browser and some features might be disabled. Please choose a country from the dropdow menu ');
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
				
				console.log(errorThrown);
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
			$('#locationBar').html('Could not obtain locationnd and some eatures might be disabled. Please choose a country from the dropdow menu ');
		  
		 }
  })
  
;

//Fetching Country info from API


let capitalMarker;
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
			
			console.log(result.data);
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
					
					console.log(result);
					$('#flag').html('<img width=50px src="' + result.data[0].flags.svg + '" />'); 
					$('#coatOfArms').html('<img width=50px src="' + result.data[0].coatOfArms.svg + '" />')
					
								
					}
				
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(errorThrown);
				}
			})


			return result
			
				
				
			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
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
			
			
					})

					
					capitalMarker = L.marker([capitalCoordinates.lat, capitalCoordinates.lng], {icon: capitalIcon}).addTo(map).bindTooltip(capitalName, 
						{
							permanent: true, 
							direction: 'right'
						});

		
				
				return result;					
					
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(errorThrown);
			}
	
		})
		.then(result =>{

			console.log(result.data.results[0].geometry.lat);
			console.log(result.data.results[0].geometry.lng);

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
					
					console.log(result);
					renderWeather(result.data);
								
					}
				
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(errorThrown);
				}
			})
		})

		

	})
	
	
})

function renderCountryDetails(result) {
	
	$('#country-name-header').html($('#countryList option:selected').text());
	$('#loader').remove();
	$('#area').html(result.areaInSqKm);	
	$('#capitalCity').html(result.capital);

	renderLanguageNames(result.languages);

	$('#population').html(result.population);
	$('#continent').html(result.continentName);
	$('#currency').html(result.currencyCode);

}

function renderLanguageNames(langCodes) {

	langCodesArray = langCodes.split(',');

	const unsupportedLanguageCodes = ['ay', 'rom', 'mos', 'iu', 'sg', 'sre', 'wuu', 'dta', 'pap', 'ktu', 'aa', 'sid', 'fj', 'frp', 'man', 'wof', 'ff', 'kl', 'pov', 'cab', 'miq', 'as', 'bho', 'sat', 'ks', 'kok', 'do', 'mni', 'sit', 'sa', 'lus', 'nc', 'sc', 'rmm', 'swk', 'bm', 'snk', 'mey', 'gag', 'ber', 'vmw', 'hz', 'se', 'brh', 'ho', 'mey', 'tpi', 'ay', 'lo', 'hil', 'war', 'pam', 'bik', 'pag', 'mrw', 'tsg', 'mdh', 'cbk', 'krj', 'sgd', 'msb', 'akl', 'ibg', 'yka', 'mta', 'mwl', 'xal', 'cau', 'ady', 'kv', 'ce', 'tyv', 'cv', 'udm', 'tut', 'mns', 'bua', 'myv', 'mdf', 'chm', 'ba', 'inh', 'tut', 'kbd', 'krc', 'av', 'sah', 'nog', 'tem', 'men', 'tpi', 'ts', 'ss', 've', 'nr', 'fia', 'srn', 'hns', 'se', 'sma', 'arc', 'nan', 'hak', 'hna', 'kbp', 'dag', 'zza', 'lun', 'lue', 'nd', 'bal', 'ilo', 'bik', 'abx', 'za', 'toi', 'bi', 'zza', 'tet', 'bho'];
	
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
            //let coordinates = Object.values(result.data.features)[0].geometry.coordinates; //removes country number key
            
            //console.log(coordinates);
            renderCountryBorders(result.data);
                        
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
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


function renderWeather (data) {

	console.log(data);

		$('#temp').html(Math.round(data.main.temp - 271) + '&#176; C');
		$('#weatherDescr').html(data.weather[0].main);
		$('#weather').html('<img src="http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png" >');
		$('#humidity').html(data.main.humidity + '%');
		$('#pressure').html(data.main.pressure+ 'hPa');
		// $('#sunrise').html(result);
		// $('#sunset').html(result);

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
			console.log(errorThrown);
		}

	})
});

$.ajax({
	url: 'libs/php/getCapitalPhotos.php',
	type: 'GET',
	dataType: 'json',
	data: {
		cityName: 'London'
	},

	success: function(result) {

		
		if (result.status.name == "ok") {
					
		console.log(result)
			
			
		}
	
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(errorThrown);
	}

})
