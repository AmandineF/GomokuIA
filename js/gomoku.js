/**
 * @file Gomoku game
 * @author Amandine Fouillet <amandinefouillet@gmail.com>
 * @author Laura Guillemot <laura.guillemot@insa-rennes.fr>
 */

//Array variables
var nb_rows, nb_rows, nb_win;

//Players variables
var player_red, red_human, red_random, red_ia, black_random, black_human, black_ia;

//Game variables
var end_game, grille, grilleIA;


get_configuration();

 
/**
 * @function reset_vars
 * Reset the configuration variables
 */
function reset_vars(){
	red_human = red_random = red_ia = black_random = black_human = black_ia = 
	document.getElementById("red_human").checked =
	document.getElementById("red_random").checked =
	document.getElementById("red_ia").checked =
	document.getElementById("black_random").checked =
	document.getElementById("black_human").checked =
	document.getElementById("black_ia").checked = false;
}

/**
 * @function random_configuration
 * Set a random configuration
 */
function random_configuration(){
	reset_vars();
	nb_rows = Math.floor((Math.random() * 15) + 1);
	nb_cols = Math.floor((Math.random() * 15) + 1);
	do{
		nb_win = Math.floor((Math.random() * 15) + 2);
	}while(nb_win > nb_rows && nb_win > nb_cols);

	document.getElementById("nb_rows").value = nb_rows;
	document.getElementById("nb_cols").value = nb_cols;
	document.getElementById("nb_win").value = nb_win;

	var redp = Math.floor((Math.random() * 3));
	switch(redp){
		case 0:
			red_human = true;
			document.getElementById("red_human").checked = true;
			break;
		case 1:
			red_random = true;
			document.getElementById("red_random").checked = true;
			break;
		case 2:
			red_ia = true;
			document.getElementById("red_ia").checked = true;
			break;
	}
	var blackp = Math.floor((Math.random() * 3));
	switch(blackp){
		case 0:
			black_human = true;
			document.getElementById("black_human").checked = true;
			break;
		case 1:
			black_random = true;
			document.getElementById("black_random").checked = true;
			break;
		case 2:
			black_ia = true;
			document.getElementById("black_ia").checked = true;
			break;
	}
}

/**
 * @function set_player()
 * Update the html element player_round
 */
function set_player(){
	if(player_red){
		document.getElementById("img_turn").src = "images/cross.png";
		if(red_human)
			document.getElementById("player_round").innerHTML = "Its red turn";
		if(red_random || red_ia)
			document.getElementById("player_round").innerHTML = "Its the computer turn, wait..";
	}else{
		document.getElementById("img_turn").src = "images/circle.png";
		if(black_human)
			document.getElementById("player_round").innerHTML = "Its black turn";
		if(black_random || black_ia)
			document.getElementById("player_round").innerHTML = "Its the computer turn, wait..";
	}
}

/**
 * @function get_configuration
 * Set a random configuration
 */
function get_configuration(){
	nb_rows = document.getElementById("nb_rows").value;
	nb_cols = document.getElementById("nb_cols").value;
	nb_win = document.getElementById("nb_win").value;

	//Human 
	red_human = document.getElementById("red_human").checked;
	black_human = document.getElementById("black_human").checked;

	//Random
	red_random = document.getElementById("red_random").checked;
	black_random = document.getElementById("black_random").checked;

	//IA
	red_ia = document.getElementById("red_ia").checked;
	black_ia = document.getElementById("black_ia").checked;

	//Aleatoire 
	player_red = Math.random() >= 0.5;
	set_player();

	end_game = 1;
	grille = new Array(nb_rows);
	for(i=0; i<nb_rows; i++)
		grille[i] = new Array(nb_cols);

	create_table();

	if(red_random && player_red){
		random_player();
	}else if(black_random && !player_red){
		random_player();
	}
} 

/**
 * @function create_table()
 * Create the html table
 */
function create_table(){
	var size;
	if(nb_rows <= 5)
		size = "60px";
	if(nb_rows > 5 && nb_rows <= 10)
		size = "40px";
	if(nb_rows > 10)
		size = "30px";
	document.getElementById("table_game").remove();
	var table_game = document.createElement("table");
	table_game.id = "table_game";
	table_game.align = "center";
	var row, cell;
	for(i = 0; i < nb_rows; i++) {
		row = table_game.insertRow(i);
		for(j = 0; j < nb_cols; j++) {
			cell = row.insertCell(j);
			cell.id = "game" + i + "_" + j;
			cell.onclick = setClick(i, j);
			cell.width = size;
			cell.height = size;
			grille[i][j] = 0;
		}
	}
	document.getElementById("game").appendChild(table_game);
	var winner_text = document.createElement("winner");
	winner_text.id = "winner";
	document.body.appendChild(winner_text);
}

function setClick(x,y){
    return function(){
        play(x,y);
    };
}

function play(i, j){	
	if(end_game == 1 && get_col(i,j) != "red" && get_col(i,j) != "black"){
		if(player_red){
			grille[i][j] = 1;
			document.getElementById("game" + i + "_" + j).className = "red";
		}else{
			grille[i][j] = 2;
			document.getElementById("game" + i + "_" + j).className = "black";
		}
		end_game = check_win(i, j, get_col(i,j));
		if(end_game == 0){
			if(player_red){
				document.getElementById("img_turn").src = "images/cross.png";
				document.getElementById("player_round").innerHTML = "Red win !";
				document.getElementById("start_again").class = "show";
			}else{
				document.getElementById("img_turn").src = "images/circle.png";
				document.getElementById("player_round").innerHTML = "Black win !";
				document.getElementById("start_again").class = "show";
			}
		}else if(end_game == 1){
			player_red = ! player_red;
			set_player();
			if(player_red && red_random){
				random_player();
			}else if(!player_red && black_random){
				random_player();
			}

			if(player_red && red_ia){
				ia_player(2);
			}else if(!player_red && black_ia){
				ia_player(2);
			}

		}else{
			document.getElementById("img_turn").src = "images/circleandcross.png";
			document.getElementById("player_round").innerHTML = "Egality";
			document.getElementById("start_again").class = "show";
		}
	}
}

/**
 * @function get_col()
 * Get the color of token in the cell
 * @param i - abscissa of the token 
 * @param j -  ordinate of the token 
 */
function get_col(i, j) {
	return document.getElementById("game" + i + "_" + j).className;
}

/**
 * @function check_win()
 * Check if the last player won the game
 * @param x - abscissa of the last token 
 * @param y - ordinate of the last token 
 * @param col - color of the last token
 */
function check_win(x, y, col){
	var checkH = 0, checkV = 0, checkNOSE = 0, checkSONE = 0;
	var xt, yt;

	//vérification horizontale
	xt=x;
	yt=y;
	while(xt>=0 && get_col(xt,yt)===col){
		xt--;
		checkH++;
	}
	xt=x+1;
	yt=y;
	while(xt<nb_rows && get_col(xt,yt)===col){
		xt++;
		checkH++;
	}

	//vérification verticale
	xt=x;
	yt=y;
	while(yt>=0 && get_col(xt,yt)===col){
		yt--;
		checkV++;
	}
	xt=x;
	yt=y+1;
	while(yt<nb_cols && get_col(xt,yt)===col){
		yt++;
		checkV++;
	}

	//vérification diagonale NO-SE
	xt=x;
	yt=y;
	while(xt>=0 && yt>=0 && get_col(xt,yt)===col){
		xt--;
		yt--;
		checkNOSE++;
	}

	xt=x+1;
	yt=y+1;
	while(xt<nb_rows && yt<nb_cols && get_col(xt,yt)===col){
		xt++;
		yt++;
		checkNOSE++;
	}

	//vérification diagonale SO-NE
	xt=x;
	yt=y;
	while(xt>=0 && yt<nb_cols && get_col(xt,yt)===col){
		xt--;
		yt++;
		checkSONE++;
	}

	xt=x+1;
	yt=y-1;
	while(xt<nb_rows && yt>=0 && get_col(xt,yt)===col){
		xt++;
		yt--;
		checkSONE++;
	}

	if(Math.max(checkH, checkV, checkNOSE, checkSONE) >= nb_win)
		return 0;

	for(i = 0; i < nb_rows; i++)
		for(j = 0; j < nb_cols; j++)
			if(get_col(i,j) != "red" && get_col(i,j) != "black")
				return 1;

	return 2;
}

/**
 * @function random_player()
 * Play a token randomly
 */
function random_player() {
	do{
		var i =  Math.floor((Math.random() * nb_rows));
		var j = Math.floor((Math.random() * nb_cols));
	}while(get_col(i, j) == "red" || get_col(i, j) == "black");
	play(i,j);
}

function display_grilleIA() {
	var res;
	res += "[" 
	for(i = 0; i<nb_rows; i++){
		res += i + " : {"
		for(j=0; j<nb_cols; j++){
			res += grilleIA[i][j] + " "
		}
		res += "} "
	}
	res += "]"

	console.log("grilleIA :" + res + "\n");
}

/*
	IA Player 
	Qui regarde jusqu'à une certaine profondeur
	Pour donner les meilleurs x et y à jouer et appelle play(x,y)
*/

function winner(){
	var vic1, vic2;
	for(i=0; i<nb_rows; i++){
		vic1=vic2=0;
		for(j=0; j<nb_cols; j++){
			if(grilleIA[i][j] == 1){
				vic1++;
				vic2=0;
			}else if(grilleIA[i][j] == 2){
				vic2++;
				vic1=0;
			}else{
				vic1=0; 
				vic2=0;
			}
		}
		if(vic1 == nb_win)
			return 1;
		if(vic2 == nb_win)
			return 2;
	}
	return 0;
}
function ia_player(profondeur) {
    grilleIA = new Array(nb_rows);
	for(i=0; i<nb_rows; i++)
		grilleIA[i] = new Array(nb_cols+1);

	for(i = 0; i<nb_rows; i++)
		for(j=0; j<nb_cols; j++)
			grilleIA[i][j] = grille[i][j];

	display_grilleIA();

	var tmp, maxi, maxj;
	var max = -Infinity;

	for(i = 0; i < nb_rows; i++){
		for(j = 0; j < nb_cols; j++){
			if(grilleIA[i][j] == 0){
				grilleIA[i][j] = 1;
				tmp = ia_min(profondeur-1);
				if(tmp > max){
					max = tmp; 
					maxi = i; 
					maxj = j;
				}
				grilleIA[i][j] = 0;
			}
		}
	}
	console.log(maxi + " - " + maxj);
	play(maxi, maxj);
}
function ia_max(profondeur) {
	console.log("max");
	if(profondeur == 0 | winner(grilleIA) != 0)
		return eval(grilleIA);

	var max = -Infinity;
	var tmp;
	for(i = 0; i < nb_rows; i++){
		for(j = 0; j < nb_cols; j++){
			if(grilleIA[i][j] == 0){
				grilleIA[i][j] = 2;
				tmp = ia_min(profondeur-1);
				if(tmp > max){
					max = tmp; 
				}
				grilleIA[i][j] = 0;
			}
		}
	}

	return max;
}

function ia_min(profondeur) {
	console.log("min");
	if(profondeur == 0 | winner(grilleIA) != 0)
		return eval();

	var min = Infinity;
	var tmp;
	for(i = 0; i < nb_rows; i++){
		for(j = 0; j < nb_cols; j++){
			if(grilleIA[i][j] == 0){
				grilleIA[i][j] = 1;
				tmp = ia_max(profondeur-1);
				if(tmp > min){
					min = tmp; 
				}
				display_grilleIA();
				grilleIA[i][j] = 0;

			}
		}
	}

	return min;
}


/*Automatiser 1 2 player ia
*/
function eval() {
	var winners;
	var nbPions = 0;

	for(i = 0; i < nb_rows; i++)
		for(j = 0; j < nb_cols; j++)
			if(grilleIA[i][j] != 0)
				nbPions++;

	if(winners = winner() != 0){
		if(winners == 1)
			return 1000 - nbPions;
		else
			return -1000 + nbPions;
	}
}