/**
 * @file game.js
 * Setting up of the game introduction
 * @author Amandine Fouillet <amandinefouillet@gmail.com>
 * @author Laura Guillemot <laura.guillemot@insa-rennes.fr>
 */

//Array variables
var nb_rows, nb_rows, nb_win;

//Players variables
var player, red_human, red_random, red_ia, black_random, black_human, black_ia, humanToPlay;

//Game variables
var end_game, grille, searchDepth, serie1, serie2, connect4 = false, progressIA = 0, lastRoundPlayer = -1;

var worker; 

init_game();

/**
 * @function init_game
 * Initialisation of the the game
 */
function init_game(){
	if(worker && worker.playing){ 
		worker.terminate();
	}
	createWorker();
	get_configuration(true);
}

/**
 * @function setConnect4
 * @param bool - true if the connect4 game is select, false otherwise
 */
function setConnect4(bool){
	connect4 = bool;
}

/**
 * @function createWorker
 * Creation of the worker for the artificial intelligence
 */
function createWorker(){
	if(window.Worker){
	    worker = new Worker("js/ia.js");
	    worker.playing = false;
	}else{
	    worker = document.createElement("script");
	    worker.src = "js/ia.js";
	    document.body.appendChild(worker);
	    worker = null;
	}

	worker.onmessage = function(e){
		var data = e.data;
		switch(data.cmd){
			case "update":
				progressIA.value = data.value;
				break;
			case "coup":
				play(data.x,data.y);
				break;
			default:
				break;
		}
	};
}

/**
 * @function get_configuration
 * @param bool - true if we need to reset the scores, false otherwise
 */
function get_configuration(bool){
	if(bool){
		setValue("blue_points",0);
		setValue("red_points",0);
		lastRoundPlayer = -1;
	}

	nb_rows = document.getElementById("nb_rows").innerHTML;
	nb_cols = document.getElementById("nb_cols").innerHTML;
	nb_win = document.getElementById("nb_win").innerHTML;

	if(document.getElementById("2computer").checked) {
		red_ia = true;
		black_ia = true;
		searchDepth = 2;
	}else{
		//Human 
		red_human = document.getElementById("red").checked;
		black_human = document.getElementById("blue").checked;

		//Random
		red_random = document.getElementById("blue").checked && 
					document.getElementById("computer").checked &&
					document.getElementById("random").checked;

		black_random = document.getElementById("red").checked && 
					document.getElementById("computer").checked &&
					document.getElementById("random").checked;

		//IA
		red_ia = document.getElementById("blue").checked && 
					document.getElementById("computer").checked &&
					(document.getElementById("medium").checked || document.getElementById("hard").checked);

		black_ia = document.getElementById("red").checked && 
					document.getElementById("computer").checked &&
					(document.getElementById("medium").checked || document.getElementById("hard").checked);

		searchDepth = document.getElementById("hard").checked? 6 : 4;
	}

	//Random first player 
	if(lastRoundPlayer == -1) {
		player = Math.random() >= 0.5 ? 1 : 2;
	}else if(lastRoundPlayer == 1){
		player = 2;
	} else {
		player = 1;
	}
	lastRoundPlayer = player;
	set_player();

	end_game = 1;
	grille = new Array(nb_rows);
	for(i=0; i<nb_rows; i++)
		grille[i] = new Array(nb_cols);

	create_table();
	if((player == 1 && red_human) || (player == 2 && black_human)) {
		humanToPlay = true;
	}

	if((red_random && player == 1) || (black_random && player == 2)){
		humanToPlay = false;
		if(worker){
			worker.playing = true;
			worker.postMessage({cmd:"random", grid:grille,player:player,depth:searchDepth,nb_win:nb_win, connect4:connect4, lastx:0, lasty:0});
		}else{
			random_player();
		}
	}

	if((red_ia && player == 1) || (black_ia && player == 2)){
		humanToPlay = false;
		if(worker){
			worker.playing = true;
			worker.postMessage({cmd:"ia", grid:grille,player:player,depth:searchDepth,nb_win:nb_win, connect4:connect4, lastx:0, lasty:0});
		}else{
			iaPlay(grille, searchDepth);
		}
	}
} 

/**
 * @function reset_vars
 * Reset the configuration variables
 */
function reset_vars(){
	red_human = red_random = red_ia = black_random = black_human = black_ia = 
	document.getElementById("human").checked =
	document.getElementById("computer").checked =
	document.getElementById("red").checked =
	document.getElementById("blue").checked =
	document.getElementById("random").checked =
	document.getElementById("medium").checked = 
	document.getElementById("hard").checked = false;	
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

	setValue('nb_rows', nb_rows);
	setValue('nb_cols', nb_cols);
	setValue('nb_win', nb_win);
	document.getElementById("computer").checked = true;
	//Color 
	var color = Math.floor((Math.random() * 2));
	switch(color){
		case 0:
			document.getElementById("red").checked = true;
			break;
		default:
			document.getElementById("blue").checked = true;
	}

	var level = Math.floor((Math.random() * 3));
	switch(level){
		case 0:
			document.getElementById("random").checked = true;
			break;
		case 1:
			document.getElementById("medium").checked = true;
			break;
		case 2:
			document.getElementById("hard").checked = true;
			break;
	}
}

/**
 * @function set_player()
 * Update the html element player_round
 */
function set_player(){
	if(player == 1){
		if(connect4){
			document.getElementById("img_turn").src = "images/redPlayer.png";
		} else {
			document.getElementById("img_turn").src = "images/delete.png";
		}
		if(red_random || red_ia){
			document.getElementById("player_round").innerHTML = "It is the computer turn, wait..";
			progressIA = document.createElement("progress");
			progressIA.max = 100;
			document.getElementById("player_round").appendChild(progressIA);
		}else{
			document.getElementById("player_round").innerHTML = "It is red turn";
		}
	}else{
		if(connect4){
			document.getElementById("img_turn").src = "images/yellowPlayer.png";
		} else {
			document.getElementById("img_turn").src = "images/geometry.png";
		}
		if(black_random || black_ia){
			document.getElementById("player_round").innerHTML = "It is the computer turn, wait..";
			progressIA = document.createElement("progress");
			progressIA.max = 100;
			document.getElementById("player_round").appendChild(progressIA);
		}else{
			if(connect4)
				document.getElementById("player_round").innerHTML = "It is yellow turn";
			else
				document.getElementById("player_round").innerHTML = "It is blue turn";
		}

	}
}

/**
 * @function create_table()
 * Create the html table
 */
function create_table(){
	var size;
	if(document.getElementById("table_game")){
		document.getElementById("table_game").remove();
	}else if(document.getElementById("table_game_4")){
		document.getElementById("table_game_4").remove();
	}
	var table_game = document.createElement("table");
	if(connect4)
		table_game.id = "table_game_4";
	else
		table_game.id = "table_game";

	table_game.align = "center";
	
	if(nb_rows <= 5 && nb_cols <= 5)
		table_game.className = "bigTable";
	else if((nb_rows > 5 || nb_cols > 5) && nb_rows <= 10 && nb_cols <= 10)
		table_game.className = "mediumTable";
	else if(nb_rows > 10 || nb_cols > 10)
		table_game.className = "smallTable";

	var row, cell;
	for(i = 0; i < nb_rows; i++) {
		row = table_game.insertRow(i);
		for(j = 0; j < nb_cols; j++) {
			cell = row.insertCell(j);
			cell.id = "game" + i + "_" + j;
			if(connect4)
				cell.className = "connect4";
			cell.onclick = setClick(i, j);
			grille[i][j] = 0;
		}
	}
	document.getElementById("game").appendChild(table_game);
}

/**
 * @function setClick(x,y)
 * Handle the event when the user click on a cell
 * @param x - abscissa of the token 
 * @param y -  ordinate of the token 
 */
function setClick(x,y){
    return function(){
        	play(x,y, true);
    };
}

function getRightCell(i, j){
	if(grille[5][j] == 0) {
		play(5,j,true);
		return false;
	}

	for(var x = 0; x < nb_rows; x++){
		if(grille[x][j] == 0) {
			if(x+1 < 6){
				if(grille[x+1][j] != 0){
					play(x,j,true);
					return false;
				}
			}
		}
	}

	return false;
}
/**
 * @function play(i,j)
 * Play the token at the coordinates x and y 
 * @param i - abscissa of the token 
 * @param j -  ordinate of the token 
 */
function play(i, j, bool){	
	if(!humanToPlay && bool) return false;
	if((i+1 < 6) && connect4 && grille[i + 1][j] == 0) {
		getRightCell(i,j);
		return false;
	}
	if(end_game == 1 && get_col(i,j) != "red" && get_col(i,j) != "black" && get_col(i,j) != "connect4_yellow" && get_col(i,j) != "connect4_red"){
		if(player == 1){
			grille[i][j] = 1;
			if(!connect4){
				document.getElementById("game" + i + "_" + j).className = "red";
			}else{
				document.getElementById("game" + i + "_" + j).className = "connect4_red";
			}
		}else{
			grille[i][j] = 2;
			if(!connect4){
				document.getElementById("game" + i + "_" + j).className = "black";
			}else{
				document.getElementById("game" + i + "_" + j).className = "connect4_yellow";
			}
		}
		end_game = check_win(i, j, get_col(i,j));
		if(end_game == 0){
			if(player == 1){
				document.getElementById("img_turn").src = "images/delete.png";
				document.getElementById("player_round").innerHTML = "Red win !";
				inc("red_points", Infinity);
				displayContinue(1);
			}else{
				if(connect4){
					document.getElementById("img_turn").src = "images/yellowPlayer.png";
					document.getElementById("player_round").innerHTML = "Yellow win !";
					inc("blue_points",Infinity);
					displayContinue(4);
				} else {
					document.getElementById("img_turn").src = "images/geometry.png";
					document.getElementById("player_round").innerHTML = "Blue win !";
					inc("blue_points",Infinity);
					displayContinue(2);
				}
				
			}
		
		}else if(end_game == 1){
			if(player == 1)
			 	player = 2;
			 else
			 	player = 1;

			set_player();

			if((red_random && player == 1) || (black_random && player == 2)){
				humanToPlay = false;
				if(worker){
					worker.playing = true;
					worker.postMessage({cmd:"random", grid:grille,player:player,depth:searchDepth,nb_win:nb_win, connect4:connect4, lastx:i, lasty:j});
				}else{
					setTimeout(function(){ random_player() }, 500);
				}
			}else if((red_ia && player == 1) || (black_ia && player == 2)){
				humanToPlay = false;
				if(worker){
					worker.playing = true;
					worker.postMessage({cmd:"ia", grid:grille,player:player,depth:searchDepth,nb_win:nb_win, connect4:connect4, lastx:i, lasty:j});
				}else{
					setTimeout(function(){ iaPlay(grille, searchDepth); }, 500);
				}
			}else{
				humanToPlay = true;
			}	

		}else{
			document.getElementById("img_turn").src = "images/egality.png";
			document.getElementById("player_round").innerHTML = "Egality";
			displayContinue(3);
		}
	}
}

/**
 * @function continueGame()
 * Hide the continue button and reset the table game without reset the scores
 */
function continueGame(){
	hideContinue();
	get_configuration(false);
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

	//horizontal verification
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

	//vertical verification
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

	//NO-SE verification
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

	//SO-NE verification
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

	if(checkH >= nb_win){
		display_lines(x, y, col, 0)
		return 0;
	}else if(checkV >= nb_win){
		display_lines(x, y, col, 1)
		return 0;
	}else if(checkNOSE >= nb_win){
		display_lines(x, y, col, 2)
		return 0;
	}else if(checkSONE >= nb_win){
		display_lines(x, y, col, 3)
		return 0;
	}

	for(i = 0; i < nb_rows; i++)
		for(j = 0; j < nb_cols; j++)
			if(get_col(i,j) != "red" && get_col(i,j) != "black")
				return 1;

	return 2;
}

/**
 * @function display_lines()
 * Coloring the winning line
 * @param x - abscissa of the last token 
 * @param y - ordinate of the last token 
 * @param col - color of the last token
 * @param id - 1 horizontal line, 2 vertical line, 3 NOSE line, SONE line
 */
function display_lines(x, y, col, id){
	var classe, xt, yt;
	if(col == "red")
		classe = 'redWin';
	else if(col == "black")
		classe = 'blackWin';
	else if(col == "connect4_yellow")
		classe = 'yellowWin';
	else if(col == "connect4_red")
		classe = 'red4win';
	
	switch(id){
		case 0:
			for(var i = x+1; i < nb_rows; i++){
				if(get_col(i,y) == col)
					document.getElementById("game" + i + "_" + y).className = classe;
				else
					break;
			}
			for(var i = x; i >= 0; i--){
				if(get_col(i,y) == col)
					document.getElementById("game" + i + "_" + y).className = classe;
				else
					break;
			}
			break;

		case 1:
			for(var j = y+1; j < nb_cols; j++){
				if(get_col(x,j) == col)
					document.getElementById("game" + x + "_" + j).className = classe;
				else 
					break;
			}
			for(var j = y; j >= 0; j--){
				if(get_col(x,j) == col)
					document.getElementById("game" + x + "_" + j).className = classe;
				else
					break;
			}
			break;
		case 2:
			xt=x;
			yt=y;
			while(xt>=0 && yt>=0 && get_col(xt,yt)===col){
				document.getElementById("game" + xt + "_" + yt).className = classe;
				xt--;
				yt--;
			}

			xt=x+1;
			yt=y+1;
			while(xt<nb_rows && yt<nb_cols && get_col(xt,yt)===col){
				document.getElementById("game" + xt + "_" + yt).className = classe;
				xt++;
				yt++;
			}
			break;
		case 3:
			xt=x;
			yt=y;
			while(xt>=0 && yt<nb_cols && get_col(xt,yt)===col){		
				document.getElementById("game" + xt + "_" + yt).className = classe;
				xt--;
				yt++;
			}

			xt=x+1;
			yt=y-1;
			while(xt<nb_rows && yt>=0 && get_col(xt,yt)===col){
				document.getElementById("game" + xt + "_" + yt).className = classe;
				xt++;
				yt--;
			}
			break;
	}
	document.getElementById("game" + x + "_" + y).className = classe;
}