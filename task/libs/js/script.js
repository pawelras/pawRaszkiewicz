$('#getNeigboursBttn').click(function() {

    console.log($('#neigboursCountry').val());

    $.ajax({
        url: "libs/php/getNeighbours.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#neigboursCountry').val(),
        },
        success: function(result) {
            
            if (result.status.name == "ok") {

                const countries = result.data.map(element => '<li>' + element.asciiName + '</li>');
                $("#neighboursResults").html('<ol>' + countries.join('') + '</ol>');
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});

$('#getChildrenBttn').click(function() {

    $.ajax({
        url: "libs/php/getChildren.php",
        type: 'POST',
        dataType: 'json',
        data: {
            geonameId: $('#childrenContinent').val(),
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                const countries = result.data.map(element => '<li>' + element.asciiName + '</li>');
                $("#childrenResults").html('<ol>' + countries.join('') + '</ol>');
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});

$('#getWikiBttn').click(function() {

    $.ajax({
        url: "libs/php/getWiki.php",
        type: 'POST',
        dataType: 'json',
        data: {
            query: $('#query').val(),
        },
        success: function(result) {

            
            if (result.status.name == "ok") {

                if (result.data.length === 0) { 
                    $("#wikiResults").html("no results")

                } else {


                console.log(result.data);
                const countries = result.data.map(element => '<li><h3>' + element.title + '</h3><img src="' + element.thumbnailImg + '"/><p>' + element.summary + '</li>');
                $("#wikiResults").html('<ol>' + countries.join('') + '</ol>');
                
                
                }
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    }); 

});