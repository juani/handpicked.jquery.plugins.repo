<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<title>listDirectory</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<link rel="stylesheet" type="text/css" href="listDirectory/assets/css/style.css" />
	<script src="listDirectory/assets/js/jquery-1.3.2.min.js" type="text/javascript"></script>
</head>
<body>
<div class="dir">
<?php

	include('listDirectory/core.php');
	echo dirContents();

?>
</div>
</body>
</html>