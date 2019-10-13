<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Zetts</title>
	<link rel="icon" href="assets/gfx/logo.svg">
	<link rel="stylesheet" type="text/css" href="assets/css/style.css">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
</head>
<style type="text/css">
	body{
		background: url('assets/gfx/bg.svg'); background-position: top; background-repeat: no-repeat; background-attachment: fixed;
		padding-top: 40px;
	}
</style>
<body >

	<?php  
	require_once("set.php");
	if (setDirChanged()){
		writeIndex();

	}
	$index = getIndex();
	foreach ($index as $key => $value) {
		echo("<div class='menu_card'><h1>" . $value->n . "</h1><br>"
			. $value->a . "<br>" . $value->d . "<br style='line-height:6'><a class='button primary' style='display:block;' href='learn.php?f=". htmlspecialchars($value->f, ENT_QUOTES, 'UTF-8'));
		echo "'>Open</a></div>";
	}




	?>
</body>
</html>