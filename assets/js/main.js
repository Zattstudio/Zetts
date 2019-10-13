var content_sections;
var links;
var parsedData;
var mode;
var wordBox;
var inputBox;
var answerBox;


var currentPair = 0;
var currentWordColumn;
var currentFlashcard = 0;

var pairsConfirmed = [];


var cardContainer;
var cardFrontLabel;
var cardBackLabel;

function init(){
	content_sections = document.getElementsByClassName("section");
	links = document.getElementsByClassName("link");
	wordBox = document.getElementById("to-match");
	inputBox = document.getElementById("inputBox");
	answerBox = document.getElementById("answer-box");
	inputBox.value = ""; //clear input field

	cardContainer = document.getElementById("flip-container");
	cardFrontLabel = document.getElementById("card_front");
	cardBackLabel = document.getElementById("card_back");

	var csvData;
	requestSetCsv(setFile, function(opt){
		csvData = opt.replace(/^.*\n/g,""); //trim first line with meta since we do not need it
		parsedData = CSV.parse(csvData);
		wordBox.innerHTML = "test";

		setNextFlashcard();
		setNextPair();
	});

	inputBox.onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13' && inputBox.readOnly == false){
      // Enter pressed
      onCheckPressed();
      return false;
    }
    else if (inputBox.readOnly == true)
    {
    	setNextPair();
    }
  }


}


function setMode(mode)
{
	if (mode == "flashcards") {
		links[0].classList.add("active");
		links[1].classList.remove("active");
		mode = 0;
		content_sections[0].style.display = "block";
		content_sections[1].style.display = "none";
	}
	else if (mode == "learn"){
		links[1].classList.add("active");
		links[0].classList.remove("active");
		mode = 1;
		content_sections[1].style.display = "block";
		content_sections[0].style.display = "none";
	}
}

function flipCard(object) {
	var flip = object;
	flip.classList.toggle("flip-horizontal-bottom");
}

function requestSetCsv(file, callback){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = "text";
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
        if (xmlHttp.status == 404){
        	document.body.style.display = "none";
        	alert("No set with this name found");
        }
    }
    xmlHttp.open("GET", "sets/" + file, true); // true for asynchronous 
    xmlHttp.send(null);


}

function getEntry(col, row){
	return parsedData[row][col];
}

function getPair(row){
	return [parsedData[row][0], parsedData[row][1]];
}



function matchInput(input, match){
	input = input.trim();

	// remove brackets and content from match
	match = match.replace(/\(.*?\)/g, "");
	match = match.trim();

	if(input == match){
		// perfect input
		return 1;
	}
	else if (input.toUpperCase() == match.toUpperCase()) // case insensitive comparison
	{
		// case incorrect
		return 0;
	}
	else if (match.indexOf(", ") > -1){
		// only executed if correct match has multiple forms that are correct
		// forms are seperated by ", " (space is neccessary)
		var matches = match.split(", ");
		for (var i = 0; i < matches.length; i++) {
			if (input == matches[i]) {
				// one option is matched perfectly

				return 2;
			}
			else if (input.toUpperCase() == matches[i].toUpperCase())
			{
				return 0;
			}		
		}

	}
	return -1; // mostly wrong
}

function getDifference(first, second){
	return first.split(second).join('').length;
	//returns amt of different characters
}

function onRevealPressed(event){
	document.getElementById("btnCheck").disabled = true;
	document.getElementById("btnReveal").disabled = true;
	document.getElementById("btnContinue").style.display = "";
	answerBox.innerHTML = getPair(currentPair)[1-currentWordColumn];
	inputBox.readOnly = true;

}

function setInputStyle(style){
	inputBox.classList.remove("incorrect");
	inputBox.classList.remove("correct");
	if (style == "incorrect"){
		inputBox.classList.add("incorrect");
	}
	else if (style == "correct") {
		inputBox.classList.add("correct");
	}
}

function onCheckPressed(){
	document.getElementById("btnCheck").disabled = true;
	document.getElementById("btnReveal").disabled = true;
	document.getElementById("btnContinue").style.display = "";
	inputBox.readOnly = true;

	var matchResult = matchInput(inputBox.value, getPair(currentPair)[1-currentWordColumn]);
	if(matchResult >= 1){
		setInputStyle("correct");
		// add it to confirmed when correct
		pairsConfirmed.push(currentPair);

		if (matchResult == 2) {
			answerBox.innerHTML = getPair(currentPair)[1-currentWordColumn] + " - partly correct";
		}
	}
	else if (matchResult == 0){
		setInputStyle("correct");
		// do not add to confirmed since case was incorrect
		answerBox.innerHTML = getPair(currentPair)[1-currentWordColumn] + " -  almost correct";
	}
	else {
		setInputStyle("incorrect");
		answerBox.innerHTML = getPair(currentPair)[1-currentWordColumn];
	}

}


function isConfirmed(val){
	return pairsConfirmed.includes(val);
}

function setNextPair(){
	// set display types for buttons
	document.getElementById("btnCheck").disabled = false;
	document.getElementById("btnReveal").disabled = false;
	document.getElementById("btnContinue").style.display = "none";
	inputBox.value = "";
	inputBox.readOnly = false;

	answerBox.innerHTML = "";
	setInputStyle("normal");

	// implements small algorithm for improved learning by utilizing all pairs that have not been answered before
	var randomNext = Math.floor(Math.random() * parsedData.length);
	if (randomNext == currentPair) { //Check if pair was the latest one to avoid duplicates
		setNextPair();
	}
	else{
		if (pairsConfirmed.length == parsedData.length) pairsConfirmed = []; // reset confirmed pairs | put *2 when there are two combinations for each pair duplicates are possible but less likely
		if(isConfirmed(randomNext) && pairsConfirmed.length <= parsedData.length){ // if the pair was already answered before, skip to different
			setNextPair();
		}
		else{
			var pair = getPair(randomNext);
			currentPair = randomNext;
			// Set can be used
			var binRnd = Math.round(Math.random()); // binary random value for which column to use
			currentWordColumn = binRnd;
			wordBox.innerHTML = escapeHtml(pair[binRnd]);
		}
	}

}

function setNextFlashcard(){


	// if (cardContainer.classList.contains("hover")) cardContainer.classList.remove("hover"); // flip card to original side
	currentFlashcard %= parsedData.length; // repeat if end of set is reached
	var pair = getPair(currentFlashcard);
	cardFrontLabel.innerHTML = escapeHtml(pair[0]);
	cardBackLabel.innerHTML = escapeHtml(pair[1]);
	document.getElementById("card-indicator").innerHTML = currentFlashcard+1 + "/" + parsedData.length;
	currentFlashcard++;
}

function escapeHtml(text) {
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}