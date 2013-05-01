/*
gets position by geolocation api
then reverse geocoding using google maps api
then asking google weather api for current weather condition and temperature
*/

var position; // computed position object 
var browserSupportsGeolocation; // flag for browser support
var time; // start time (constant) for timestamps

var timeoutCity;
var timeoutWeather;

/* HTML Elements*/
var cityname; 
var temperature;
var condition;

var language; // language (e.g. 'en')

/* helpers */
var langstrings;
var tempInnerHTML;


function init() { // let's go!
	/* init timer */
	var d = new Date();
	time = d.getTime();
	timestamp("Initializing...");
	
	initLanguageStrings();
	
	/* initialize variables */
	language = document.documentElement.getAttribute("lang");
	
	cityname = document.getElementById("cityname");
	temperature = document.getElementById("temperature");
	condition = document.getElementById("condition");
	
	/* hide error textnodes and show progress indicator */
	cityname.style.visibility = "hidden";
	tempInnerHTML = temperature.innerHTML;
	temperature.innerHTML = langstrings['pleaseallow'][language];
	
	condition.style.visibility = "hidden";	
	document.getElementById("city").style.background = "url('spinning_wheel150.gif') no-repeat center bottom";
	
	timeoutCity = setTimeout('cityTimeout()', 10000);
	
	if (navigator.geolocation) { // Geolocation is supported
	    browserSupportsGeolocation = true;
	    timestamp("Geolocation is supported. Asking for location...");
	    navigator.geolocation.getCurrentPosition( 
	    	function(pos) { startGeoStuff(pos); }, // locating was successful
	    	function() { noGeolocation(browserSupportsGeolocation); } // … was not successful
	    );
	
	} else { // Geolocation is not supported
		browserSupportsGeolocation = false;
		noGeolocation(browserSupportsGeolocation);
	}
}

function startGeoStuff(position) { // translate coordinates to city name and display
	
	var la = position.coords.latitude;
	var lo = position.coords.longitude;
	timestamp("Location found: "+la+", "+lo);
	
	var latlng = new google.maps.LatLng(la, lo);
	var geocoder = new google.maps.Geocoder();
	
	timestamp("Calling Google Maps API Geocoder...");
	
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      	if (status == google.maps.GeocoderStatus.OK) {
        	if (results[1]) {
        		timestamp("Processing geocoder results...");
          		var ac = results[0].address_components;
         	 	for (i=0; i<ac.length; i++) {
          			if (ac[i].types[0] == "locality") {
          				var city = ac[i].long_name;
          				timestamp("City found: "+city);
     					clearTimeout(timeoutCity);
          				cityname.innerHTML = city;
          				cityname.style.visibility = "visible";
						temperature.style.visibility = "hidden";
          				temperature.innerHTML = tempInnerHTML;
          				document.getElementById("city").style.background = "none";
          				document.getElementById("weather").style.background = "url('spinning_wheel50.gif') no-repeat center bottom";
          				showWeather(la, lo, city);
          			}
          		}
          		timestamp("Finished.");
       	 	}
		} else {
        	timestamp("Geocoder failed due to: " + status);
      	}
    });
	
}


function showWeather(la, lo, city) {

	timeoutWeather = setTimeout('weatherTimeout()', 3000);
	
	timestamp("Calling Google Weather API...");
	
	http_request = new XMLHttpRequest();
	if (http_request != null) {
		/* calling adapter php file */
		var xmlfile = 'googleweather.php?la='+la+'&lo='+lo+'&lang='+language;
		timestamp("XMLHttpRequest established: "+xmlfile);
		http_request.open('GET', xmlfile, false);
    	http_request.send(null);
		var x = http_request.responseXML.documentElement;
		timestamp("Interpreting XML...");
		try {
			var error = x.getElementsByTagName("problem_cause")[0];
			if (error != undefined) {
				timestamp("No weather data found using coordinates. Trying city name instead...");
				var xmlfile = 'googleweather.php?city='+city+'&lang='+language;
				timestamp("XMLHttpRequest established: "+xmlfile);
				http_request.open('GET', xmlfile, false);
    			http_request.send(null);
				var x = http_request.responseXML.documentElement;
				timestamp("Interpreting XML...");
			}
		} catch (e) { }
		
		
		/* getting data out of xml file */
		var current = x.getElementsByTagName("current_conditions")[0];		
		var celsius = current.getElementsByTagName("temp_c")[0].getAttribute("data"); 
		var wetter = current.getElementsByTagName("condition")[0].getAttribute("data"); 
		
		timestamp("Weather found.");
		clearTimeout(timeoutWeather);
		
		/* display temperature and condition */
		temperature.innerHTML = celsius+' °C';
		condition.innerHTML = wetter;
		
		temperature.style.visibility = "visible";
		condition.style.visibility = "visible";
		
		document.getElementById("weather").style.background = "none"; // hide progress indicator
		
	} else {
		timestamp("HTTP Request failed.");
		clearTimeout(timeoutWeather);
    	weatherTimeout();
	}

}


function noGeolocation(browserSupport) { // Error handling if no location is found
	if (browserSupport == true) {
      	timestamp("Geolocation service failed.");
    } else {
      	timestamp("Browser doesn't support geolocation.");
    }
    clearTimeout(timeoutCity);
    cityTimeout();
}


function timestamp(string) { // output on console
	d = new Date();
	t = d.getTime() - time;
	console.log(t+"ms: "+string);
}


function cityTimeout() { // City is not found
	temperature.innerHTML = langstrings['cityTimeout'][language];
	document.getElementById("city").style.background = "none";
	timestamp("cityTimeout");
}

function weatherTimeout() { // Weather data is not found
	temperature.innerHTML = langstrings['weatherTimeout'][language];
	document.getElementById("weather").style.background = "none";
	temperature.style.visibility = "visible";
	timestamp("weatherTimeout");
}

function initLanguageStrings() {
	langstrings = new Array();
	
	langstrings['pleaseallow'] = new Array();
	langstrings['pleaseallow']['en'] = "Please accept the geolocation request, if asked.";
	langstrings['pleaseallow']['de'] = "Bitte erlauben Sie die Geolokalisierung, wenn danach gefragt wird.";
	
	langstrings['cityTimeout'] = new Array();
	langstrings['cityTimeout']['en'] = "Couldn't find your location.";
	langstrings['cityTimeout']['de'] = "Ihr Aufenthaltsort konnte leider nicht festgestellt werden.";
	
	langstrings['weatherTimeout'] = new Array();
	langstrings['weatherTimeout']['en'] = "No weather data available.";
	langstrings['weatherTimeout']['de'] = "Keine Wetterdaten gefunden.";
	
}
