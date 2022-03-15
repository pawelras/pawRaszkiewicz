<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true) / 1000;

    $decode = json_decode(file_get_contents('../../geoData/countryBorders.geo.json'), true);

	$countries_array = $decode["features"];
 

    foreach($countries_array as $element) {
        $key = $element["properties"]["name"];
        $value = $element["properties"]["iso_a2"];
        $result_array[$key] = $value;

    }
    
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $result_array;
    

    header('Content-Type: application/json; charset=UTF-8');

    

    echo json_encode($output);

?>

