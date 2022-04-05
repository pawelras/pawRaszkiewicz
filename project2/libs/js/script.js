$(document).ready(() => {
    

    //Fetch Employees Data and Render Table
 

      // Add Sorting Functions on Click
    
      $('#firstName').on("click", sortEmployeesTable);
      $('#lastName').on("click", sortEmployeesTable);
      $('#jobTitle').on("click", sortEmployeesTable);
      $('#email').on("click", sortEmployeesTable);
      $('#d\\.name').on("click", sortEmployeesTable);
      $('#l\\.name').on("click", sortEmployeesTable);

      
  
      $('#addEmployeeButton').on('click', addNewEmployee);

      $('#employeeDeleteButton').on('click', deleteEmployee);

        // Showing edit fields and modal footer again after adding previous employee
      $('#addEmployee').on('show.bs.modal', () => {
        $('.detailsEditField').show();
        $('.modal-footer').show();
      })


    // Fetch Departments Details and Render Table
    function fetchEmployeesDetails() {
        $.ajax({
            url: 'libs/php/getAll.php',
            type: 'GET',
            dataType: 'json',
            
            success: function(result) {
                    
                if (result.status.name == "ok") {
    
                console.log(result);
    
                $('#employeesTableBody').html();
                
                
                renderEmployeesTable(result.data);
                    
                    
                
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        })
    }

    fetchEmployeesDetails();

    $.ajax({
		url: 'libs/php/getAllDepartments.php',
		type: 'GET',
		dataType: 'json',
		
		success: function(result) {
				
			if (result.status.name == "ok") {

            console.log(result);

            renderDepartmentsTable(result.data);
            populateDepartmentsSelect(result.data);
			
            				
			
			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	})

    $('#addDepartmentButton').on('click', addNewDepartment)



    // Fetch Locations and Render Table
    $.ajax({
		url: 'libs/php/getLocations.php',
		type: 'GET',
		dataType: 'json',
		
		success: function(result) {
				
			if (result.status.name == "ok") {

                renderLocations(result.data);
                populateLocationSelect(result.data);
           				
			
			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	})


    $('#employeeDetailsModal').on('show.bs.modal', function(){

        let currentRow = $(event.target).closest('tr');
        let employeeId = currentRow.find("th:eq(0)").text();
        let firstName = currentRow.find("td:eq(0)").text();
        let lastName = currentRow.find("td:eq(1)").text();
        let jobTitle = currentRow.find("td:eq(2)").text();
        let email = currentRow.find("td:eq(3)").text();
        let department = currentRow.find("td:eq(4)").text();
        let location = currentRow.find("td:eq(5)").text();

        

        $('#ed-fullName').html(firstName + ' ' + lastName);
        $('#ed-jobTitle').html(jobTitle || 'Not Provided');
        $('#ed-location').html(location);
        $('#ed-department').html(department);
        $('#ed-email').html(email);
        $('#ed-id').html(employeeId);


       
    });
    
    $('#employeeEditModal').on('show.bs.modal', function(){

        $('.modal-footer').show();
        $('#editEmployeeErrors').html('');
        $('#ee-alert').hide();
        
        

        let currentRow = $(event.target).closest('tr');
        let employeeId = currentRow.find("th:eq(0)").text();
        let firstName = currentRow.find("td:eq(0)").text();
        let lastName = currentRow.find("td:eq(1)").text();
        let jobTitle = currentRow.find("td:eq(2)").text();
        let email = currentRow.find("td:eq(3)").text();
        let department = currentRow.find("td:eq(4)").text();
        
        console.log(employeeId);
        
        $('#ee-id').val(employeeId);
        $('#ee-firstName').val(firstName);
        $('#ee-lastName').val(lastName);
        $('#ee-jobTitle').val(jobTitle);           
        $('#ee-department option:selected').html(department);
        $('#ee-email').val(email);

       
    });

    $('#employeeDeleteModal').on('show.bs.modal', function(){

        // hiding success alert and showing edit after previous deletion
        $('#eDel-alert').hide();
        $('.detailsEditField').show();
        $('.modal-footer').show();

        let currentRow = $(event.target).closest('tr');
        let employeeId = currentRow.find("th:eq(0)").text();
        let firstName = currentRow.find("td:eq(0)").text();
        let lastName = currentRow.find("td:eq(1)").text();
                
        console.log(firstName);
        
        $('#eDel-id').html(employeeId);
        $('#eDel-fullName').html(firstName + ' ' + lastName);
               
    });

    $('#editEmployeeButton').on('click', updateEmployeeDetails)
    

    $('#addLocationButton').on('click', addLocation)
    
    // Employees Helper functions

    function renderEmployeesTable(employeesArray) {

        $('#employeesTableBody').html();
                
                
        let htmlString = ''
        employeesArray = Array.from(employeesArray);
                        
                employeesArray.forEach((element, index) => {
                    htmlString += '<tr data-id=e' + index  +  '><th scope="row">' + element.id + '</th><td>' + element.firstName + '</td><td>' + element.lastName + '</td><td class="d-none d-lg-table-cell">' + element.jobTitle + '</td><td class="d-none d-lg-table-cell">' + element.email + '</td><td class="d-none d-lg-table-cell">' + element.department + '</td><td class="d-none d-lg-table-cell">' + element.location + '</td><td><div class="d-flex justify-content-between"><i title="Details" data-bs-toggle="modal" data-bs-target="#employeeDetailsModal" class="fa-solid fa-user cursor-pointer"></i><i title="Delete" data-bs-toggle="modal" data-bs-target="#employeeDeleteModal" class="fa-solid fa-trash cursor-pointer error"></i><i title="Edit Details" data-bs-toggle="modal" data-bs-target="#employeeEditModal" class="fa-solid fa-pen-to-square cursor-pointer"></i></div></td>';
                    
                });
                                    
                $('#employeesTableBody').html(htmlString);
                    
    
    }


    function sortEmployeesTable() {
                

        $(this).attr("data-sorting") === 'ASC' ? $(this).attr("data-sorting", 'DESC') : $(this).attr("data-sorting", 'ASC');
        
        $.ajax({
            url: 'libs/php/getAllSorted.php',
            type: 'GET',
            dataType: 'json',
            data: {
                parameter: $(this).attr("id"),
                order: $(this).attr("data-sorting")
            },
            
            success: function(result) {

                    
                if (result.status.name == "ok") {
                                    
                renderEmployeesTable(result.data);  
                
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        })

    }

   

    function addNewEmployee() {
        let firstName = $('#newEmployeeFirstName').val();
        let lastName = $('#newEmployeeLastName').val();
        let jobTitle = $('#newEmployeeJobTitle').val() || '';
        let email = $('#newEmployeeEmail').val();
        let departmentID = $('#newEmployeeDepartment').val();
        

        if (! firstName || !lastName || !email ) {
            $('#newEmployeeErrors').html('Please fill out required fields');
        } else {
            $.ajax({
                url: 'libs/php/insertEmployee.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    jobTitle: jobTitle,
                    email: email,
                    departmentID: departmentID,
                    

                },
                
                success: function(result) {
                        
                    if (result.status.name == "ok") {

                        $('#addEmployee-alert').show();
                        $('.detailsEditField').hide();
                        $('.modal-footer').hide();

                        setTimeout(function(){
                            // hiding modal and clearing form for next use
                            $('.modal').modal('hide');
                            $('#addEmployee-alert').hide();
                            $('#newEmployeeFirstName').val('');
                            let lastName = $('#newEmployeeLastName').val('');
                            let jobTitle = $('#newEmployeeJobTitle').val('') || '';
                            let email = $('#newEmployeeEmail').val('');
                            $('#newEmployeeDepartment').val(1);
                          }, 4000);
                          fetchEmployeesDetails()   
                    
                    }
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            })
        }


    }

    function updateEmployeeDetails() {

        let employeeId = $('#ee-id').val();
        let firstName = $('#ee-firstName').val();
        let lastName = $('#ee-lastName').val();
        let jobTitle = $('#ee-jobTitle').val() || '';
        let email = $('#ee-email').val();
        let departmentID = $('#ee-department').val();

        console.log(firstName);
        console.log(departmentID);
        

        if (! firstName || !lastName || !email ) {
            $('#editEmployeeErrors').html('Please fill out required fields');
        } 
        else {
            $.ajax({
                url: 'libs/php/editEmployee.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    jobTitle: jobTitle,
                    email: email,
                    departmentID: departmentID,
                    employeeId: employeeId
                    

                },
                
                success: function(result) {
                        
                    if (result.status.name == "ok") {

                        $('#ee-alert').show()
                        // $('#editEmployeeModalBody').html('Details successfully updated.')
                        setTimeout(function(){
                            $('.modal').modal('hide');
                            $('#ee-alert').hide();
                          }, 4000);
                          fetchEmployeesDetails()     
                    
                    }
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            })
        }
        
    }

    function deleteEmployee() {

        let employeeId = $('#eDel-id').text();
        console.log(employeeId);

        $.ajax({
            url: 'libs/php/deleteEmployeeByID.php',
            type: 'POST',
            dataType: 'json',
            data: {
                
                employeeId: employeeId
                

            },
            
            success: function(result) {
                    
                if (result.status.name == "ok") {
                    console.log(result);
                    fetchEmployeesDetails()
                    

                    $('#eDel-alert').show();
                    $('.detailsEditField').hide();
                    $('.modal-footer').hide();
                    
                    // // $('#editEmployeeModalBody').html('Details successfully updated.')
                    // setTimeout(function(){
                    //     $('.modal').modal('hide');
                    //     $('#ee-alert').hide();
                    //   }, 4000);          
                
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        })

    }




    // Department Helper Functions

    $('#departmentDeleteModal').on('show.bs.modal', () => {
        $('.detailsEditField').show();
        $('.modal-footer').show();
        
        let currentRow = $(event.target).closest('tr');
        let departentId = currentRow.find("th:eq(0)").text();
        let departmentName = currentRow.find("td:eq(0)").text();
        $('#depDelName').html(departmentName);
        $('#delDepartmentId').html(departentId);
        console.log(departentId);
        console.log(departmentName);

      })

    $('#departmentDeleteButton').on('click', () => {
        console.log('clicked');
    })

    function renderDepartmentsTable(departmentsArray) {

        $('#departmentsTableBody').html();
                
                
        let htmlString = ''
        departmentsArray = Array.from(departmentsArray);
                        
        departmentsArray.forEach((element) => {
            htmlString += '<tr><th scope="row">' + element.id + '</th><td>' + element.name + '</td><td>' + element.lName + '</td><td><div  class="d-flex justify-content-between"><i data-bs-toggle="modal" data-bs-target="#departmentDeleteModal" class="fa-solid fa-trash error cursor-pointer"></i><i class="fa-solid fa-user"></i><i class="fa-solid fa-pen-to-square"></i></div></td>';
                    
                });
                                    
                $('#departmentsTableBody').html(htmlString);
                    
    
    }

    function populateDepartmentsSelect(departmentsArray) {

                console.log(departmentsArray);
                htmlString = ''
                departmentsArray.forEach(element => {
                    htmlString+= '<option value ="' + element.id  + '">' + element.name +   '</option>'
                })
                $('#newEmployeeDepartment').html(htmlString)
                $('#ee-department').html(htmlString);
                
               
            }

    
    function addNewDepartment() {
        let newDepartmentName = $('#newDepartmentName').val();
        let newDepartmentLocationId = $('#newDepartmentLocationID option:selected').val();
        
                        
        
                if (! newDepartmentName ) {
                    $('#newDepartmentErrors').html('Please fill out required fields');
                } else {
                    $.ajax({
                        url: 'libs/php/insertDepartment.php',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            name: newDepartmentName,
                            locationID: newDepartmentLocationId
                                                       
        
                        },
                        
                        success: function(result) {
                                
                            if (result.status.name == "ok") {
                
                                console.log(result);
                                $('#newDepartmentModalBody').html('New ' + newDepartmentName + ' department successfully added.' )
                                setTimeout(function(){
                                    $('.modal').modal('hide')
                                  }, 4000);          
                            
                            }
                        
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR);
                        }
                    })
                }
        
        
            }
        
            function deleteDepartment() {

                let departmentId = $('#eDel-id').text();
                console.log(employeeId);
        
                $.ajax({
                    url: 'libs/php/deleteEmployeeByID.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        
                        employeeId: employeeId
                        
        
                    },
                    
                    success: function(result) {
                            
                        if (result.status.name == "ok") {
                            console.log(result);
                            fetchEmployeesDetails()
                            
        
                            $('#eDel-alert').show();
                            $('.detailsEditField').hide();
                            $('.modal-footer').hide();
                            
                            // // $('#editEmployeeModalBody').html('Details successfully updated.')
                            // setTimeout(function(){
                            //     $('.modal').modal('hide');
                            //     $('#ee-alert').hide();
                            //   }, 4000);          
                        
                        }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                    }
                })
        
            }

    // Locations Helper Functions

    function renderLocations(locationsArray) {

        console.log(locationsArray);
        $('#locationsTableBody').html();
                
                
        let htmlString = ''
        locationsArray = Array.from(locationsArray);
                        
        locationsArray.forEach((element) => {
            htmlString += '<tr><th scope="row">' + element.id + '</th><td>' + element.name + '</td><td><div  class="d-flex justify-content-between"><i class="fa-solid fa-trash error"></i><i class="fa-solid fa-pen-to-square"></i></div></td>';
                    
                });
                                    
                $('#locationsTableBody').html(htmlString);

    }


    function populateLocationSelect(locationsArray) {

        console.log(locationsArray)
   
        htmlString = '';

        for (const location of locationsArray) {
            
            htmlString+= '<option value =' + location.id  + '>' + location.name +   '</option>'
        }
        
        $('#newDepartmentLocationID').html(htmlString);
        
       
    }
    

    function addLocation() {
        let locationName = $('#newLocationName').val();
        console.log(locationName);

        if (! locationName ) {
            $('#newLocationErrors').html('Please provide location name.');
        } else {
            $.ajax({
                url: 'libs/php/insertLocation.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    locationName: locationName,
                    
                    

                },
                
                success: function(result) {
                        
                    if (result.status.name == "ok") {

                        console.log('Location added')
        
                        $('#addLocationAlert').show();
                        setTimeout(function(){
                            // hiding modal and clearing form for next use
                            $('.modal').modal('hide');
                            $('#addLocationAlert').hide();
                            $('#newLocationName').val('');
                      }, 4000);          
                    
                    }
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            })
        }

    }

    

   
    


})