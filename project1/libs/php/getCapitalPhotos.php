<?php

	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
    
	$url= 'https://api.pexels.com/v1/search?query=London' .  $_REQUEST['cityName'];
    
    $headers = array(
        "Authorization: 563492ad6f91700001000001529c5624ed2a490fb8a60b7b62fd329f",
        "Content-Type: application/json",
     );

	$ch = curl_init();
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode["geonames"];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
