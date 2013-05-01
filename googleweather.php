<?php 
/** fetches weather data by given coordinates and returns xml **/

if (isset($_GET['la']) AND isset($_GET['lo'])) {
	google_weather_api_coordinates($_GET['la'], $_GET['lo'], $_GET['lang']);
} else if (isset($_GET['city'])) {
	google_weather_api_city($_GET['city'], $_GET['lang']);
}
	
function google_weather_api_coordinates($latitude, $longitude, $language) {
	header("Content-type: text/xml; charset=utf-8"); 
	
	$la = $latitude*10000000;
	$lo = $longitude*10000000;
	$la = substr($la.'', 0, 8);
	$lo = substr($lo.'', 0, 8);
	$language = substr($language, 0, 2);
	
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_URL, "http://www.google.com/ig/api?weather=,,,".$la.",".$lo."&hl=".$language."&referrer=googlecalendar"); 
	//curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30); 
	//curl_setopt($ch, CURLOPT_TIMEOUT, 30); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
	//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	$xmlContents = utf8_encode(curl_exec($ch)); 
	curl_close($ch); 
	
	echo $xmlContents; 
	
}

function google_weather_api_city($city, $language) {
	header("Content-type: text/xml; charset=utf-8"); 
	
	$city = urlencode($city);
	$language = substr($language, 0, 2);
	
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_URL, "http://www.google.com/ig/api?weather=".$city."&hl=".$language."&referrer=googlecalendar"); 
	//curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30); 
	//curl_setopt($ch, CURLOPT_TIMEOUT, 30); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
	//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	$xmlContents = utf8_encode(curl_exec($ch)); 
	curl_close($ch); 
	
	echo $xmlContents; 
	
}


?> 
