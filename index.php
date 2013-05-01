<?php
$languages = array('de','en'); // possible languages
$language = "en"; // default language

if (isset($_GET['lang']) AND in_array($_GET['lang'], $languages)) {
	$language = $_GET['lang'];
} else {
	$browser_language = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
	if (in_array($browser_language, $languages)) {
		$language = $browser_language;
	}
}

$t = array();

$t['title']['en'] = "Local Weather – Geolocation API Demo";
$t['sorry']['en'] = "Sorry";
$t['yourbrowser']['en'] = "your browser doesn't support geolocation.";
$t['try']['en'] = "Try the latest version of";
$t['or']['en'] = "or";
$t['about']['en'] = "About";

$t['title']['de'] = "Ortswetter – Geolocation API Demo";
$t['sorry']['de'] = "Sorry";
$t['yourbrowser']['de'] = "dein Browser unterstützt leider keine Geolokalisierung.";
$t['try']['de'] = "Probiere die neueste Version von";
$t['or']['de'] = "oder";
$t['about']['de'] = "Info";


$lg = $language;

function get_language_list($languages, $language) {
	foreach ($languages as $l) {
		print "<li>";
		if ($language == $l) {
			print $l;
		} else {
			print '<a href="?lang='.$l.'">'.$l.'</a>';
		}
		print "</li>";
	}
}

?>
<!DOCTYPE html> 
<html lang="<?php echo $language; ?>"> 
	<head> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
		<title><?php echo $t['title'][$lg]; ?></title>
		<link rel="stylesheet" href="geoweather.css" type="text/css" media="all" /> 
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
		<script type="text/javascript" src="geoWeather.js"></script>
	</head>
	<body onload="init();">
		<header id="language">
			<ul>
				<?php get_language_list($languages, $language); ?>
			</ul>
		</header>
		<section id="city">
			<p id="cityname"><?php echo $t['sorry'][$lg]; ?>,</p>
			
		</section>
		<section id="weather">
			<p id="temperature"><?php echo $t['yourbrowser'][$lg]; ?></p>
			<p id="condition">
			<?php echo $t['try'][$lg]; ?> 
			<a href="http://www.google.com/chrome">Chrome</a>,
			<a href="http://www.apple.com/safari">Safari</a>,
			<a href="http://www.mozilla.com/firefox">Firefox</a> <?php echo $t['or'][$lg]; ?>
			<a href="http://www.opera.com">Opera</a>.</p>
		</section>
		<footer><a href="http://sprachkonstrukt.de/geoweather_<?php echo $lg; ?>"><?php echo $t['about'][$lg]; ?></a></footer>
	</body>
</html>
