/**
 * @file Gomoku game
 * @author Amandine Fouillet <amandinefouillet@gmail.com>
 * @author Laura Guillemot <laura.guillemot@insa-rennes.fr>
 */

//Array variables
var nb_rows, nb_rows, nb_win;

//Players variables
var player, red_human, red_random, red_ia, black_random, black_human, black_ia;

//Game variables
var end_game, grille, searchDepth;


get_configuration(true);

 
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
		document.getElementById("img_turn").src = "images/delete.png";
		if(red_random || red_ia)
			document.getElementById("player_round").innerHTML = "It is the computer turn, wait..";
		else
			document.getElementById("player_round").innerHTML = "It is red turn";
	}else{
		document.getElementById("img_turn").src = "images/geometry.png";
		if(black_random || black_ia)
			document.getElementById("player_round").innerHTML = "It is the computer turn, wait..";
		else
			document.getElementById("player_round").innerHTML = "It is blue turn";

	}
}

/**
 * @function get_configuration
 * Set a random configuration
 */
function get_configuration(bool){
	if(bool){
		setValue("blue_points",0);
		setValue("red_points",0);
	}

	nb_rows = document.getElementById("nb_rows").innerHTML;
	nb_cols = document.getElementById("nb_cols").innerHTML;
	nb_win = document.getElementById("nb_win").innerHTML;

	//Human 
	red_human = document.getElementById("blue").checked;
	black_human = document.getElementById("red").checked;

	//Random
	red_random = document.getElementById("red").checked && 
				document.getElementById("computer").checked &&
				document.getElementById("random").checked;

	black_random = document.getElementById("blue").checked && 
				document.getElementById("computer").checked &&
				document.getElementById("random").checked;

	//IA
	red_ia = document.getElementById("red").checked && 
				document.getElementById("computer").checked &&
				(document.getElementById("medium").checked || document.getElementById("hard").checked);

	black_ia = document.getElementById("blue").checked && 
				document.getElementById("computer").checked &&
				(document.getElementById("medium").checked || document.getElementById("hard").checked);

	console.log(red_random);
	console.log(black_random);
	console.log(red_ia);
	console.log(black_ia);
	searchDepth = document.getElementById("hard").checked? 8 : 4;


	//Aleatoire 
	player = Math.random() >= 0.5 ? 1 : 2;
	set_player();

	end_game = 1;
	grille = new Array(nb_rows);
	for(i=0; i<nb_rows; i++)
		grille[i] = new Array(nb_cols);

	create_table();

	if(red_random && (player == 1)){
		random_player();
	}else if(black_random && !(player == 1)){
		random_player();
	}
	if(red_ia && (player == 1)){
		iaPlay(grille, searchDepth);
	}else if(black_ia && !(player == 1)){
		iaPlay(grille, searchDepth);
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
			//cell.width = size;
			//cell.height = size;
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
        play(x,y);
    };
}

/**
 * @function play(i,j)
 * Play the token at the coordinates x and y 
 * @param i - abscissa of the token 
 * @param j -  ordinate of the token 
 */
function play(i, j){	
	if(end_game == 1 && get_col(i,j) != "red" && get_col(i,j) != "black"){
		if(player == 1){
			grille[i][j] = 1;
			document.getElementById("game" + i + "_" + j).className = "red";
		}else{
			grille[i][j] = 2;
			document.getElementById("game" + i + "_" + j).className = "black";
		}
		end_game = check_win(i, j, get_col(i,j));
		if(end_game == 0){
			if(player == 1){
				document.getElementById("img_turn").src = "images/delete.png";
				document.getElementById("player_round").innerHTML = "Red win !";
				inc("red_points", Infinity);
				displayContinue(1);
			}else{
				document.getElementById("img_turn").src = "images/geometry.png";
				document.getElementById("player_round").innerHTML = "Blue win !";
				inc("blue_points",Infinity);
				displayContinue(2);
			}
		
		}else if(end_game == 1){
			if(player == 1)
			 	player = 2;
			 else
			 	player = 1;
			set_player();
			if((player == 1) && red_random){
				setTimeout(function(){ random_player() }, 500);
			}else if((player == 2) && black_random){
				setTimeout(function(){ random_player() }, 500);
			}

			if((player == 1)  && red_ia){
				setTimeout(function(){ iaPlay(grille, searchDepth); }, 500);
			}else if((player == 2) && black_ia){
				setTimeout(function(){ iaPlay(grille, searchDepth); }, 500);
			}			

		}else{
			document.getElementById("img_turn").src = "images/egality.png";
			document.getElementById("player_round").innerHTML = "Egality";
			displayContinue(3);
		}
	}
}


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
	/*
	if(Math.max(checkH, checkV, checkNOSE, checkSONE) >= nb_win)
		return 0;
*/
	for(i = 0; i < nb_rows; i++)
		for(j = 0; j < nb_cols; j++)
			if(get_col(i,j) != "red" && get_col(i,j) != "black")
				return 1;

	return 2;
}

function display_lines(x, y, col, id){
	var classe, xt, yt;
	if(col == "red")
		classe = 'redWin';
	else
		classe = 'blackWin';
	
	switch(id){
		case 0:
			for(var i = x; i < nb_rows; i++){
				if(get_col(i,y) == col)
					document.getElementById("game" + i + "_" + y).className = classe;
				else
					break;
			}
			for(var i = 0; i < x; i++){
				if(get_col(i,y) == col)
					document.getElementById("game" + i + "_" + y).className = classe;
				else
					break;
			}
			break;

		case 1:
			for(var j = y; j < nb_cols; j++){
				if(get_col(x,j) == col)
					document.getElementById("game" + x + "_" + j).className = classe;
				else 
					break;
			}
			for(var j = 0; j < y; j++){
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


function pasteGrid(grid) {
	var newGrid = [];
	for(var i = 0; i < nb_rows; i++)
		newGrid[i] = grid[i].concat([]);
	return newGrid;
}

function display_grid(grid) {
	console.log("Grid - " + grid.length + " x " + grid[0].length);
	var s;
	for(var i = 0; i < grid.length; i++){
		for(var j = 0; j < grid[0].length; j++){
			s+= grid[i][j] + " ";
		}
		s+= "\n";
	}
}
var serie1, serie2;

function iaPlay(originalGrid, depth) {
	var iaGrid = pasteGrid(originalGrid);
	iaPlayer(iaGrid, depth);
}

function iaPlayer(grid, depth) {
	//console.log("------------------------------------------");

	var tmp, xplay, yplay;
	var max = -Infinity;
	var alpha = - Infinity;
	var beta = Infinity;
	for(var x = 0; x < grid.length; x++){
		for(var y = 0; y < grid[0].length; y++){
			if(grid[x][y] == 0){
				grid[x][y] = player;
				//console.log("IA PLayer play " + player + " - " + x + "-" + y+ " - depth : " + (depth-1));

				tmp = iaMin(grid, depth-1, alpha, beta);
				//console.log("TMP : " + tmp)
				if(tmp > max || ((tmp == max) && (Math.random() >= 0.5))) {
					max = tmp; 
					xplay = x; 
					yplay = y;
					//console.log("NEW MAX : " + max);
				}
				/*if(max >= beta){
					play(xplay, yplay);
				}
				alpha = Math.max(alpha, max);*/
				grid[x][y] = 0;
			}
		}
	}
	play(xplay, yplay);
}

function iaMax(grid, depth, alpha, beta) {
	if(depth == 0 | winner(grid) != 0)
		return iaRanting(grid);

	var max = -Infinity;
	var tmp = 0;
	for(var i = 0; i < grid.length; i++){
		for(var j = 0; j < grid[0].length; j++){
			if(grid[i][j] == 0){
				grid[i][j] = player;
				//console.log("MAX play " + player  + "- "   + i + "-" + j + " - depth : " + (depth-1));
				tmp = iaMin(grid, depth-1, alpha, beta);
				if(tmp > max || ((tmp == max) && (Math.random() >= 0.5)))
					max = tmp; 
				/*if(max >= beta)
					return max;
				alpha = Math.max(alpha, max);*/
				grid[i][j] = 0;
			}
		}
	}
	return max;
}


function iaMin(grid, depth, alpha, beta) {
	var token = 0;
	if(depth == 0 | winner(grid) !=0)
		return iaRanting(grid);

	if(player == 1)
		token = 2;
	else
		token = 1;

	var min = Infinity;
	var tmp = 0;
	for(var i = 0; i < grid.length; i++){
		for(var j = 0; j < grid[0].length; j++){
			if(grid[i][j] == 0){
				grid[i][j] = token;
				//console.log("MIN play " + token + "- " + i + "-" + j + " - depth : " + (depth-1));
				tmp = iaMax(grid, depth-1, alpha, beta);
				if(tmp < min || ((tmp == min) && (Math.random() >= 0.5)))
					min = tmp; 
				/*if(alpha >= min)
					return min;
				beta = Math.min(beta, min);*/
				grid[i][j] = 0;

			}
		}
	}
	return min;
}

function iaRanting(grid) {
	var nbPions = 0;

	for(var i = 0; i < grid.length; i++)
		for(var j = 0; j < grid[0].length; j++)
			if(grid[i][j] != 0)
				nbPions++;

	var theWinner = winner(grid);
	if(theWinner != 0 && theWinner != 3){
		if(theWinner == player){
			return 1000 - nbPions;
		}else{
			return -1000 + nbPions;
		}
	}

	alignToken(grid, nb_win-1);
	var res;
	if(player == 1)
		res = serie1-serie2;
	else 
		res = serie2-serie1;
	return res;
}

function winner(grid){
    alignToken(grid, nb_win);
    if(serie1 >= 1)
        return 1;
    else if(serie2 >= 1)
        return 2;
    else
    {
	    for(var i=0;i<grid.length;i++)
	        for(var j=0;j<grid[0].length;j++)
	            if(grid[i][j] == 0)
	                return 0;
    }
    return 3;
}

function alignToken(grid, nb_align){
	var cpt1 = cpt2 = 0;
	serie1 = serie2 = 0;

	//NO-SE
	for(var i = 0; i < grid.length; i++){
		if(grid[i][i] == 1){
			cpt1++;
			cpt2 = 0;
			if(cpt1 == nb_align)
				serie1++;
		} else if(grid[i][i] == 2){
			cpt2++;
			cpt1 = 0;
			if(cpt2 == nb_align)
				serie2++;
		}
	}
	cpt1 = cpt2 = 0;

	//SO-NE
	for(var i = 0; i < grid.length; i++){
		if(grid[i][2-i] == 1){
			cpt1++;
			cpt2 = 0;
			if(cpt1 == nb_align)
				serie1++;
		} else if(grid[i][2-i] == 2){
			cpt2++;
			cpt1 = 0;
			if(cpt2 == nb_align)
				serie2++;
		}
	}

	//In line
	for(var i = 0; i < grid.length; i++){
		cpt1 = cpt2 = 0;

		//Horizontalement
		for(var j = 0; j < grid[0].length; j++){
			if(grid[i][j] == 1){
				cpt1++;
				cpt2 = 0;
				if(cpt1 == nb_align)
					serie1++;
			} else if(grid[i][j] == 2){
				cpt2++;
				cpt1 = 0;
				if(cpt2 == nb_align)
					serie2++;
			}
		}

		cpt1 = cpt2 = 0;

		//Verticalement
		for(var j = 0; j < grid[0].length; j++){
			if(grid[j][i] == 1){
				cpt1++;
				cpt2 = 0;
				if(cpt1 == nb_align)
					serie1++;
			} else if(grid[j][i] == 2){
				cpt2++;
				cpt1 = 0;
				if(cpt2 == nb_align)
					serie2++;
			}
		}
	}
}




