<?php
$raw_input = $_GET["f"];

// Prevent any kind of XSS or injection
function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}


?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Zetts</title>
	<link rel="icon" href="assets/gfx/logo.svg">
	<link rel="stylesheet" type="text/css" href="assets/css/style.css">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
</head>
<body onload="init(); setMode('flashcards');">
<nav class="tabs is-full">
  <a class="link active" onclick="setMode('flashcards');">Flashcards</a>
  <a class="link" onclick="setMode('learn');">Learn</a>
</nav>

<div class="section" id="flashcards">
	<br style="line-height: 200%">
	<p id="card-indicator"></p>
	<div class="flip-container" id="flip-container" onclick="this.classList.toggle('hover');">
  	<div class="flipper">    	<div class="front"><span id="card_front"></span></div>

    	<div class="back" ><span id="card_back"></span></div>
  	</div>
	</div>
	<br>
	<button class="button primary" onclick="setNextFlashcard()">Next</button>
</div>

<div class="section" id="learn">
<br style="line-height: 400%">
<h2 id="to-match">Word</h2>
<h2 id="answer-box"></h2>
<input type="text" name="input" id="inputBox" placeholder="Answer"><br style="line-height: 10">
<button id="btnContinue" style="display: none;" onclick="setNextPair();" class="button primary">Continue</button><br><br>
<button id="btnCheck" onclick="onCheckPressed();" class="button primary">Check</button>
<button id="btnReveal" class="button primary outline" onclick="onRevealPressed(event);">Reveal</button>
</div>
<script type="text/javascript">
	<?php
		echo("var setFile = \"" . test_input($raw_input) . "\";");
	?>

</script>
<script type="text/javascript" src="assets/js/csv.min.js"></script>
<script type="text/javascript" src="assets/js/main.js"></script>
</body>
</html>