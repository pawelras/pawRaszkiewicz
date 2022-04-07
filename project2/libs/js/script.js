$(document).ready(() => {
    
    $('#clearSearchButton').on('click', () => {
        $('#searchBar').val('');
        $('#searchDepartment').prop("selectedIndex", 0).val();
        $('#searchLocation').prop("selectedIndex", 0).val();
        fetchEmployeesDetails();
    })
    
// Employees Section 

    //Fetching Employees Data and Render Table
    fetchEmployeesDetails();

   
    

    // Binding on click functions
    $('#addEmployeeButton').on('click', addNewEmployee);
    $('#employeeDeleteButton').on('click', deleteEmployee);

    // Resetting All Modals after previous edits
    $('.modal').on('show.bs.modal', () => {
        $('.detailsEditField').show();
        $('.modal-footer').show();
        $('.alert').hide();
        $('.error').html('');
        

      })
    // Clearing Add Employee Modal Fields
    $('#addEmployee').on('show.bs.modal', () => {
        
        $('#newEmployeeFirstName, #newEmployeeLastName, #newEmployeeJobTitle, #newEmployeeEmail').val('');
        $('#newEmployeeDepartment').prop("selectedIndex", 0).val();

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

    $('#editEmployeeButton').on('click', updateEmployeeDetails);
    $('#employeeEditModal').on('show.bs.modal', function(){
 
        let currentRow = $(event.target).closest('tr');
        let employeeId = currentRow.find("th:eq(0)").text();
        let firstName = currentRow.find("td:eq(0)").text();
        let lastName = currentRow.find("td:eq(1)").text();
        let jobTitle = currentRow.find("td:eq(2)").text();
        let email = currentRow.find("td:eq(3)").text();
        let department = currentRow.find("td:eq(4)").text();
                
        $('#ee-id').val(employeeId);
        $('#ee-firstName').val(firstName);
        $('#ee-lastName').val(lastName);
        $('#ee-jobTitle').val(jobTitle);           
        $('#ee-department option:selected').html(department);
        $('#ee-email').val(email);

       
    });
    
    $('#employeeDeleteModal').on('show.bs.modal', function(){

        
        let currentRow = $(event.target).closest('tr');
        let employeeId = currentRow.find("th:eq(0)").text();
        let firstName = currentRow.find("td:eq(0)").text();
        let lastName = currentRow.find("td:eq(1)").text();
                 
        $('#eDel-id').html(employeeId);
        $('#eDel-fullName').html(firstName + ' ' + lastName);
               
    });

    // Adding Sorting Functions on Click
    $('#firstName, #lastName, #jobTitle, #email, #d\\.name, #l\\.name', ).on("click", sortEmployeesTable);

    // Searching and filtering
    $('#searchBar').on('keyup', filterEmployees)
    $('#searchDepartment').on('change', filterEmployees);
    $('#searchLocation').on('change', filterEmployees);

    

// Departments Section

    // Fetching Departments Details and Render Table

    fetchDepartments();    

    $('#addDepartmentButton').on('click', addNewDepartment);
    $('#departmentDeleteButton').on('click', checkEmployeeCount);
    $('#editDepartmentButton').on('click', editDepartment);

    $('#addDepartment').on('show.bs.modal', () => {
        $('#newDepartmentErrors').html('');
        $('#newDepartmentName').val('');
        $('.detailsEditField').show();
        $('.modal-footer').show();
        $('.alert').hide();
        $('#newDepartmentLocationID').prop("selectedIndex", 0).val();
    })

    $('#departmentDeleteModal').on('show.bs.modal', () => {
        $('.detailsEditField').show();
        $('.modal-footer').show();
        $('.alert').hide();
        $('.error').html('')
        let currentRow = $(event.target).closest('tr');
        let departentId = currentRow.find("th:eq(0)").text();
        let departmentName = currentRow.find("td:eq(0)").text();
        $('#depDelName').html(departmentName);
        $('#delDepartmentId').html(departentId);
     

      });

      $('#departmentEditModal').on('show.bs.modal', () => {
        $('.detailsEditField').show();
        $('.modal-footer').show();
        $('.alert').hide();
        $('.error').html('');

        
        let currentRow = $(event.target).closest('tr');
        let departmentId = currentRow.find("th:eq(0)").text();
        let departmentName = currentRow.find("td:eq(0)").text();
        let locationID = currentRow.find("td:eq(2)").text()
        $('#editDepartmentName').val(departmentName);
        $('#editDepartmentID').val(departmentId);
        $('#editDepartmentLocationID').val(locationID).change();
        
      })

      
    
// Locations Section

    // Fetching Locations and Render Table
    fetchLocations();   
    

    $('#addLocationButton').on('click', addLocation);

    $('#addLocation').on('show.bs.modal', () => {
       
        $('.alert').hide()
        $('.detailsEditField').show();
        $('.modal-footer').show();
        $('#newLocationErrors').html('');
        $('#newLocationName').val('')
        
                
      })

    $('#locationDeleteModal').on('show.bs.modal', () => {
        let currentRow = $(event.target).closest('tr');
        let locationId = currentRow.find("th:eq(0)").text();
        let locationName = currentRow.find("td:eq(0)").text();
        $('#locationDeleteErrors').html('')
        $('.alert').hide()
        $('.detailsEditField').show();
        $('.modal-footer').show();
        $('#delLocationName').html(locationName);
        $('#delLocationId').html(locationId);
        
                
      })

      $('#locationEditModal').on('show.bs.modal', function(){

        $('.modal-footer').show();
        $('.detailsEditField').show();
        $('#editEmployeeErrors').html('');
        $('.alert').hide();
        
        let currentRow = $(event.target).closest('tr');
        let locationId = currentRow.find("th:eq(0)").text();
        let locationName = currentRow.find("td:eq(0)").text();
                  
        $('#editLocationName').val(locationName);
        $('#editLocationID').val(locationId);
        

       
    });
        $('#editLocationButton').on('click', editLocation)
        $('#locationDeleteButton').on('click', checkDepartmentCount);
    


    // ==================== HELPER FUNCTIONS=================================

    // Employees Helper functions

    function fetchEmployeesDetails() {
        $.ajax({
            url: 'libs/php/getAll.php',
            type: 'GET',
            dataType: 'json',
            
            success: function(result) {
                    
                if (result.status.name == "ok") {
    
                  
                $('#employeesTableBody').html();
                
                
                renderEmployeesTable(result.data);
                    
                    
                
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        })
    }

    function renderEmployeesTable(employeesArray) {

        $('#employeesTableBody').html();
                
                
        let htmlString = ''
        employeesArray = Array.from(employeesArray);
                        
                employeesArray.forEach((element, index) => {
                    htmlString += '<tr data-id=e' + index  +  '><th scope="row">' + element.id + '</th><td>' + element.firstName + '</td><td>' + element.lastName + '</td><td class="d-none d-lg-table-cell">' + element.jobTitle + '</td><td class="d-none d-lg-table-cell">' + element.email + '</td><td class="d-none d-lg-table-cell">' + element.department + '</td><td class="d-none d-lg-table-cell">' + element.location + '</td><td><div class="d-flex justify-content-between"><i title="Details" data-bs-toggle="modal" data-bs-target="#employeeDetailsModal" class="fa-solid fa-user cursor-pointer"></i><i title="Delete" data-bs-toggle="modal" data-bs-target="#employeeDeleteModal" class="fa-solid fa-trash cursor-pointer text-danger" ></i><i title="Edit Details" data-bs-toggle="modal" data-bs-target="#employeeEditModal" class="fa-solid fa-pen-to-square cursor-pointer"></i></div></td>';
                    
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

                        $('.error').html('');
                        $('.alert').show();
                        $('.detailsEditField').hide();
                        $('.modal-footer').hide();

                        setTimeout(function(){
                            // hiding modal and clearing form for next use
                            $('.modal').modal('hide');
                            
                          }, 3000);
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

                        $('.alert').show();
                        $('.detailsEditField').hide();
                        $('.modal-footer').hide();
                        // $('#editEmployeeModalBody').html('Details successfully updated.')
                        setTimeout(function(){
                            $('.modal').modal('hide');
                            $('#ee-alert').hide();
                          }, 3000);
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
                    

                    $('.alert').show();
                    $('.detailsEditField').hide();
                    $('.modal-footer').hide();
                        
                
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        })

    }

    function filterEmployees() {
        
        // console.log(event.target.value);
        
        let searchString = $('#searchBar').val()
        let locationID = $('#searchLocation option:selected').val(); 
        let departmentID = $('#searchDepartment option:selected').val();
        
        // counting number of parameters
        let counter = 0;
        if (locationID !== '') {counter +=1}
        if (departmentID !== '') {counter +=1}
        console.log(counter);            

        $.ajax({
            url: 'libs/php/filterEmployees.php',
            type: 'POST',
            dataType: 'json',
            data: {
                
                searchString: searchString,
                locationID: locationID,
                departmentID: departmentID,
                numFilters: counter
                
                

            },
            
            success: function(result) {
                    
                
                    console.log(result);
                    renderEmployeesTable(result.data);
                                           
                
                
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        })
    }


    // Department Helper Functions


    function fetchDepartments() {

        $.ajax({
            url: 'libs/php/getAllDepartments.php',
            type: 'GET',
            dataType: 'json',
            
            success: function(result) {
                    
                if (result.status.name == "ok") {
    
                   
                renderDepartmentsTable(result.data);
                populateDepartmentsSelect(result.data);
                
                                
                
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        })

    }

    function renderDepartmentsTable(departmentsArray) {

        $('#departmentsTableBody').html();
                
                
        let htmlString = ''
        departmentsArray = Array.from(departmentsArray);
        
         
        // hidden td with location id
        departmentsArray.forEach((element) => {
            htmlString += '<tr><th scope="row">' + element.id + '</th><td>' + element.name + '</td><td>' + element.lName + '</td><td class="collapse">' + element.locationID + '</td><td><div  class="d-flex justify-content-between"><i data-bs-toggle="modal" data-bs-target="#departmentDeleteModal" class="fa-solid fa-trash text-danger cursor-pointer"></i><i data-bs-toggle="modal" data-bs-target="#departmentEditModal"class="fa-solid fa-pen-to-square cursor-pointer"></i></div></td>';
                    
                });
                                    
                $('#departmentsTableBody').html(htmlString);
                    
    
    }

    function populateDepartmentsSelect(departmentsArray) {

                
                htmlString = ''
                departmentsArray.forEach(element => {
                    htmlString+= '<option value ="' + element.id  + '">' + element.name +   '</option>'
                })
                $('#newEmployeeDepartment').html(htmlString);
                $('#ee-department').html(htmlString);
                $('#searchDepartment').html('<option value="">All Departments</option>' + htmlString);
                
               
            }

    
    function addNewDepartment() {
        let newDepartmentName = $('#newDepartmentName').val();
        let newDepartmentLocationId = $('#newDepartmentLocationID option:selected').val();
        
                        
        
                if (! newDepartmentName ) {
                    $('#newDepartmentErrors').html('Please fill out required fields');
                }else if ($('#departmentsTable td:contains(' + newDepartmentName + ')').length) {

                    $('#newDepartmentErrors').html('Departments already exists');
                    return

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

                                fetchDepartments();
                                $('.error').html('');
                                $('.detailsEditField').hide();
                                $('.modal-footer').hide();
                                $('.alert').show();
                                
                                
                                setTimeout(function(){
                                    $('.modal').modal('hide')
                                  }, 3000);          
                            
                            }
                        
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR);
                        }
                    })
                }
        
        
            }
        
    function deleteDepartment() {

        let departmentId = $('#delDepartmentId').text();
        console.log(departmentId);
        
        $.ajax({
                url: 'libs/php/deleteDepartmentByID.php',
                type: 'POST',
                dataType: 'json',
                data: {
                        
                    departmentId: departmentId  
        
                },
                    
                    success: function(result) {
                            
                        if (result.status.name == "ok") {
                            
                            fetchDepartments();
                            $('.error').html('');
                            $('.detailsEditField').hide();
                            $('.modal-footer').hide();
                            $('.alert').show();
                            console.log(result);
                                                    
                        }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                    }
                })
        
            }
    

    function editDepartment() {
        console.log('edit clicked');

        let departmentName = $('#editDepartmentName').val();
        let locationID = $('#editDepartmentLocationID').val();
        let departmentID = $('#editDepartmentID').val();   
        
        console.log(departmentName, departmentLocation, departmentID);

        if (!departmentName) {
            $('#editDepartmentErrors').html('Please Provide Department Name');
            return
        }

        $.ajax({
            url: 'libs/php/editDepartment.php',
            type: 'POST',
            dataType: 'json',
            data: {
                    
                name: departmentName,
                locationID: locationID,
                id: departmentID
    
            },
                
                success: function(result) {
                        
                    if (result.status.name == "ok") {
                        
                        fetchDepartments();
                        $('.error').hide();
                        $('.detailsEditField').hide();
                        $('.modal-footer').hide();
                        $('.alert').show();
                        console.log(result);
                                                
                    }
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            })
        
                           
                            
    }

    // Check if department can be deleted
    function checkEmployeeCount() {

        $.ajax({
            url: 'libs/php/checkEmployeeCount.php',
            type: 'POST',
            dataType: 'json',
            data: {
                id: $('#delDepartmentId').text()
            },
            
            success: function(result) {
                    
                if (result.status.name == "ok") {                                   
                
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        })
        .then(result => {

            
            if (result.data[0]["COUNT(id)"] > 0) {
                console.log('can\'t delete');
                
                $('#departmentDeleteErrors').html('Cannot Delete Department. '  + result.data[0]["COUNT(id)"] + ' employee(s) still assigned.')
            } else {
                console.log('can delete');
                deleteDepartment()
            }
        })

    }
    
    // Locations Helper Functions

    function fetchLocations() {
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
    }

    fetchLocations();

    

    function renderLocations(locationsArray) {

        
        $('#locationsTableBody').html();
                
                
        let htmlString = ''
        locationsArray = Array.from(locationsArray);
        
                        
        locationsArray.forEach((element) => {
            htmlString += '<tr><th scope="row">' + element.id + '</th><td>' + element.name + '</td><td><div  class="d-flex justify-content-between"><i data-bs-toggle="modal" data-bs-target="#locationDeleteModal" class="fa-solid fa-trash text-danger cursor-pointer"></i><i data-bs-toggle="modal" data-bs-target="#locationEditModal "class="fa-solid fa-pen-to-square cursor-pointer"></i></div></td>';
                    
                });
                                    
                $('#locationsTableBody').html(htmlString);

    }


    function populateLocationSelect(locationsArray) {
   
        htmlString = '';

        for (const location of locationsArray) {
            
            htmlString+= '<option value =' + location.id  + '>' + location.name +   '</option>'
        }
        
        $('#newDepartmentLocationID').html(htmlString);
        $('#editDepartmentLocationID').html(htmlString);
        $('#searchLocation').html('<option value="">All Locations</option>' + htmlString);

        
       
    }
    

    function addLocation() {
        let locationName = $('#newLocationName').val();
        console.log(locationName);

        if (! locationName ) {
            $('#newLocationErrors').html('Please provide location name.');

        } else if ($('#locationTable td:contains(' + locationName + ')').length) { 
            
            $('#newLocationErrors').html('Location Already Exists.');

        }
        else { 
            $.ajax({
                url: 'libs/php/insertLocation.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    locationName: locationName,
                    
                    

                },
                
                success: function(result) {
                        
                    if (result.status.name == "ok") {

                        
                        fetchLocations(); 
                        $('.alert').show();
                        $('#newLocationName').val('');
                        $('.detailsEditField').hide();
                        $('.modal-footer').hide();


                        setTimeout(function(){
                            
                            $('.modal').modal('hide');
                            
                      }, 3000);          
                    
                    }
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                }
            })
        }

    }


    // Check if location can be deleted
    function checkDepartmentCount() {
        console.log('Counting Departments');
        console.log($('#delLocationId').text());
        $.ajax({
            url: 'libs/php/checkDepartmentCount.php',
            type: 'POST',
            dataType: 'json',
            data: {
                id: $('#delLocationId').text()
            },
            
            success: function(result) {
                    
                if (result.status.name == "ok") {                                   
                
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        })
        .then(result => {

            console.log(result);
            if (result.data[0]["COUNT(id)"] > 0) {
                console.log('can\'t delete');
                $('.error').show();
                $('#locationDeleteErrors').html('Cannot Delete Location. '  + result.data[0]["COUNT(id)"] + ' department(s) still assigned.');

            } else {
                console.log('can delete');
                deleteLocation()
            }
        })

    }


    function deleteLocation() {

        let locationId = $('#delLocationId').text();
        console.log(locationId);
        
        $.ajax({
                url: 'libs/php/deleteLocationByID.php',
                type: 'POST',
                dataType: 'json',
                data: {
                        
                    locationId: locationId  
        
                },
                    
                    success: function(result) {
                            
                        if (result.status.name == "ok") {
                            
                            fetchLocations()
                            $('.error').html('');
                            $('.detailsEditField').hide();
                            $('.modal-footer').hide();
                            $('.alert').show();
                           
                                                    
                        }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                    }
                })
        
            }

            function editLocation() {
    

                let locationName = $('#editLocationName').val();
                let locationID = $('#editLocationID').val();
                
                
                if (!locationName) {
                    $('#editLocationErrors').html('Please Provide Location Name');
                    return
                }
            
                $.ajax({
                    url: 'libs/php/editLocation.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                            
                        name: locationName,
                        locationID: locationID,
                        
            
                    },
                        
                        success: function(result) {
                                
                            if (result.status.name == "ok") {
                               fetchLocations()
                                $('.error').html('');
                                $('.detailsEditField').hide();
                                $('.modal-footer').hide();
                                $('.alert').show();
                                
                                                        
                            }
                        
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR);
                        }
                    })
                
                                   
                                    
            }


})


