<?php


    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true) / 1000;

    $decode = json_decode(file_get_contents('../../geoData/countryBorders.geo.json'), true);
    $countries_array = $decode["features"];
	
   function getBorderCoordinates($element) {
       return $element["properties"]["iso_a2"] == $_REQUEST['countryISO'];

  }

  $data = array_filter($countries_array, "getBorderCoordinates");
  $decode["features"] = $data;
    
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $decode;

    header('Content-Type: application/json; charset=UTF-8');

    

    echo json_encode($output);

?>
