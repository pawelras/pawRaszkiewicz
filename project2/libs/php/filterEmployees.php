<?php

ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;

    }   


   $sqlStr = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, 
            d.name as department, l.name as location 
            FROM personnel p 
            LEFT JOIN department d ON (p.departmentID = d.id) 
            LEFT JOIN location l ON (d.locationID = l.id)
            WHERE (p.firstName LIKE ? OR p.lastName LIKE ?)";
   
   if(isset($_REQUEST["departmentID"]) and strlen($_REQUEST["departmentID"]) > 0){
        $sqlStr = $sqlStr.' and d.id = ?';
    }
 
    if(isset($_REQUEST["locationID"]) and strlen($_REQUEST["locationID"]) > 0){
        $sqlStr = $sqlStr.' and l.id = ?';
    }

    $query = $conn->prepare($sqlStr);

	$searchString = '%'.$_REQUEST["searchString"].'%';

	if ($_REQUEST["numFilters"] == 0) {
		
		$query->bind_param("ss", $searchString , $searchString);
		

	} elseif ($_REQUEST["numFilters"] == 2) {
		$query->bind_param("ssii", $searchString , $searchString, $_REQUEST["departmentID"], $_REQUEST["locationID"]);
	} else {

		if(isset($_REQUEST["departmentID"]) and strlen($_REQUEST["departmentID"]) > 0){
			$query->bind_param("ssi", $searchString , $searchString, $_REQUEST['departmentID']);
		} elseif (isset($_REQUEST["locationID"]) and strlen($_REQUEST["locationID"]) >0) {
			$query->bind_param("ssi", $searchString , $searchString, $_REQUEST['locationID']);
		}
	}
	
	

	// if(isset($_REQUEST["departmentID"]) and strlen($_REQUEST["departmentID"]) > 0){
    //     $query->bind_param("i", $_REQUEST['departmentID']);
    // }
 
    // if(isset($_REQUEST["locationID"]) and strlen($_REQUEST["locationID"]) > 0){
    //     $query->bind_param("i", $_REQUEST['locationID']);
    // }
	
	
	$query->execute();
    
    if (!$query) {

        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";  
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output); 

        exit;

    }
    

    $result = $query->get_result();

   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;

	echo json_encode($output); 

	mysqli_close($conn);

?>