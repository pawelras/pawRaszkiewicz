$(document).ready(() => {
    
    $.ajax({
		url: 'libs/php/getAll.php',
		type: 'GET',
		dataType: 'json',
		
		success: function(result) {
				
			if (result.status.name == "ok") {

                console.log(result);
                console.log(typeof(result.data));

            $('#employeesTable').html();
			
            let htmlString = '<thead class="thead-dark"><tr><th scope="col">#</th><th scope="col" id="First">First</th><th scope="col" id="Last" >Last</th><th class="d-none d-lg-table-cell"scope="col" id="Job">Job Title</th><th class="d-none d-lg-table-cell" scope="col" id="Email">Email</th><th class="d-none d-lg-table-cell" scope="col" id+"Department">Department</th><th class="d-none d-lg-table-cell" scope="col" id="Location">Location</th><th scope="col">Actions</th></tr></thead><tbody>';

            let employeesArray = Array.from(result.data);
            
            employeesArray.forEach((element, index) => {
                htmlString += '<tr><th scope="row">' + String(index + 1) + '</th><td>' + element.firstName + '</td><td>' + element.lastName + '</td><td class="d-none d-lg-table-cell">' + element.jobTitle + '</td><td class="d-none d-lg-table-cell">' + element.email + '</td><td class="d-none d-lg-table-cell">' + element.department + '</td><td class="d-none d-lg-table-cell">' + element.location + '</td><td>Actions</td></tbody>';
                
            });
								
            $('#employeesTable').html(htmlString);
				
				
			
			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	})
    .then(() => {
        const headers = $('#employeesTable th').slice(0,7);
        console.log(headers);
        
        for (let i = 0; i <7; i++) {

            console.log(i);
                     
            let selector = '#' + headers[i].innerText.split(' ')[0];
            console.log(selector);

            

            $(selector).on('click', function () {

                console.log('clicked');


                // get rows as array and detach them from the table
                var rows = $('#employeesTable tr:not(:first)').detach();      
                
        
                rows.sort((a,b) => {
                     
                    var tda = $(a).find('td:eq(' + i +')').text(); // can replace 1 with the column you want to sort on
                    var tdb = $(b).find('td:eq(' + i + ')').text(); // this will sort on the second column
                            // if a < b return 1
                    return tda > tdb ? 1 
                           // else if a > b return -1
                           : tda < tdb ? -1 
                           // else they are equal - return 0    
                           : 0;  
                 
                })
            
                                    
                // add each row back to the table in the sorted order (and update the rank)
                ;
                rows.each(function () {
                    
                    $(this).appendTo('#employeesTable');
                });
            });
        
        }

        // headers.forEach((element, index) => {
        //     console.log(element.text())
            
        // })

    }) 

    // function sortColumn() {
    //     console.log('clicked')
    //     var $tbody = $('table tbody');
    //     $tbody.find('tr').sort(function(a,b){ 
    //         var tda = $(a).find('td:eq(5)').text(); // can replace 1 with the column you want to sort on
    //         var tdb = $(b).find('td:eq(5)').text(); // this will sort on the second column
    //                 // if a < b return 1
    //         return tda > tdb ? 1 
    //                // else if a > b return -1
    //                : tda < tdb ? -1 
    //                // else they are equal - return 0    
    //                : 0;           
    //     }).appendTo($tbody);

        
    // }

    $('#button').on('click', function () {
        // get rows as array and detach them from the table
        var rows = $('#employeesTable tr:not(:first)').detach();
        console.log(rows);
        
        

        rows.sort((a,b) => {
             
            var tda = $(a).find('td:eq(0)').text(); // can replace 1 with the column you want to sort on
            var tdb = $(b).find('td:eq(0)').text(); // this will sort on the second column
                    // if a < b return 1
            return tda > tdb ? 1 
                   // else if a > b return -1
                   : tda < tdb ? -1 
                   // else they are equal - return 0    
                   : 0;  
         
        })
    
        console.log(rows);
            
        // add each row back to the table in the sorted order (and update the rank)
        ;
        rows.each(function () {
            
            $(this).appendTo('#employeesTable');
        });
    });

    

    

    



})