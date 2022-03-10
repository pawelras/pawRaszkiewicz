export function renderCountryDetails(data) {
		
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

export function renderCountryPhotos(urlArray) {

    console.log(urlArray);
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


export function renderWeather(data) {

    $('#temp').html(Math.round(data.main.temp - 271) + '&#176; C');
    $('#weatherDescr').html(data.weather[0].main);
    $('#weather').html('<img src="http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png" >');
    $('#humidity').html(data.main.humidity + '%');
    $('#pressure').html(data.main.pressure+ 'hPa');
    
}