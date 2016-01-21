/**
 * @file Gomoku game
 * Interaction between the js and the html
 * @author Amandine Fouillet <amandinefouillet@gmail.com>
 * @author Laura Guillemot <laura.guillemot@insa-rennes.fr>
 */

function init_graph(){
   var game = localStorage.getItem('game');
   if(game) game = JSON.parse(game);
   if(game) {
     changeLogo(game);
   }
}

/**
 * @function openThat
 * Open the settings "pop up" 
 */
function openThat() {
	document.getElementById('princ').className = 'col-xs-8';
	document.getElementById('config').className = 'col-xs-4 text-right';
	document.getElementById('config').textAlign = 'right';
	document.getElementById('config').style.display = 'inline-block';
	document.getElementById('btnOpen').style.display = 'none';
	document.getElementById('btnClose').style.display = 'inline-block';
	document.getElementById('foot').style.left = '0';
}

/**
 * @function closeThat
 * Close the settings "pop up" 
 */
function closeThat() {
	document.getElementById('princ').className = 'col-xs-12';
	document.getElementById('config').style.display = 'none';
	document.getElementById('btnClose').style.display = 'none';
	document.getElementById('btnOpen').style.display = 'inline-block';
	document.getElementById('foot').style.right = '0';
	document.getElementById('foot').style.left = 'inherit';
}

/**
 * @function inc
 * Increment one variable in the html element
 * @params id -  Html container
 * @params max - Limit 
 */
function inc(id, max){
	var span = document.getElementById(id);
	var old = span.innerHTML;
	if(old < max){
		while(span.firstChild)
		    span.removeChild( span.firstChild );
		old++;
		document.getElementById(id).appendChild(document.createTextNode(old));
	}
}

/**
 * @function dec
 * Decrement one variable in the html element
 * @params id -  id of the html container
 * @params min - Limit 
 */
function dec(id, min){
	var span = document.getElementById(id);
	var old = span.innerHTML;
	if(old>min){
		while(span.firstChild)
		    span.removeChild( span.firstChild );
		old--;
		document.getElementById(id).appendChild(document.createTextNode(old));
	}
}

/**
 * @function setValue
 * Insert a value in a html element
 * @params id - id of the html container
 * @params value - The value to insert
 */
function setValue(id, value){
	var span = document.getElementById(id);
	while(span.firstChild)
	    span.removeChild(span.firstChild);
	document.getElementById(id).appendChild(document.createTextNode(value));
}

/**
 * @function showComp
 * Show ia settings
 */
function showComp(){
	document.getElementById('color').style.display = 'inline-block';
	document.getElementById('difficulty').style.display = 'inline-block';
}

/**
 * @function hideComp
 * Hide ia settings
 */
function hideComp(){
	document.getElementById('color').style.display = 'none';
	document.getElementById('difficulty').style.display = 'none';
}

/**
 * @function displayContinue
 * Display the continue button
 * @params bool - 1 red, 2 blue, 3 green
 */
function displayContinue(bool){
	document.getElementById('continue').style.display = 'inline-block';
	if(bool == 1)
		document.getElementById('continue').style.backgroundColor = '#ed5564';
	else if(bool == 2)
		document.getElementById('continue').style.backgroundColor = '#5c9ded';
	else if(bool == 4)
		document.getElementById('continue').style.backgroundColor = '#f1c40f';
	else
		document.getElementById('continue').style.backgroundColor = '#99d468';

}

/**
 * @function hideContinue
 * Hide the continue button 
 */
function hideContinue(){
	document.getElementById('continue').style.display = 'none';
}

function saveData(id){
   var game = id;
   game = JSON.stringify(game);
   localStorage.setItem('game', game);
}


function deleteData(){
	 localStorage.removeItem('game');
}

function changeLogo(id){
	switch(id){
		case 3: //GOMOKU
			document.getElementById('logo').src = "images/gomoku.png";
			document.getElementById('div_nb').style.display = 'none';
			document.getElementById('random_btn').style.display = 'none';
			document.getElementById('restart_btn').className = 'col-xs-12';
	 		setValue('nb_rows', 15);
			setValue('nb_cols', 15);
			setValue('nb_win', 5);
			get_configuration(true);
			break;
		case 1: //TIC TAC TOE
			document.getElementById('logo').src = "images/tictactoe.png";
			document.getElementById('div_nb').style.display = 'none';
			document.getElementById('random_btn').style.display = 'none';
			document.getElementById('restart_btn').className = 'col-xs-12';
			setValue('nb_rows', 3);
			setValue('nb_cols', 3);
			setValue('nb_win', 3);
			get_configuration(true);
			break;
		case 2: //CONNECT4
			document.getElementById('logo').src = "images/connect4.png";
			document.getElementById('playerLeft').src = "images/redPlayer.png";
			document.getElementById('playerRight').src = "images/yellowPlayer.png";
			document.getElementById('logo').style.width = '200px';
			document.getElementById('div_nb').style.display = 'none';
			document.getElementById('random_btn').style.display = 'none';
			document.getElementById('restart_btn').className = 'col-xs-12';
			document.getElementById('colorPlayer2').innerHTML = '<span></span> Yellow';
			setConnect4(true);
			setValue('nb_rows', 6);
			setValue('nb_cols', 7);
			setValue('nb_win', 4);
			get_configuration(true);
			break;
		default: //YOUR OWN GRID
			document.getElementById('logo').src = "images/yourowngrid.png";
			document.getElementById('div_nb').style.display = 'inline-block';
			document.getElementById('random_btn').style.display = 'inline-block';
			document.getElementById('random_btn').className = 'col-xs-6';
			document.getElementById('restart_btn').className = 'col-xs-6';
			random_configuration();
			get_configuration(true);
			break;
	}

}