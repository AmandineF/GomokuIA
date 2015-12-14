var player_red;
var nb_rows, nb_rows, nb_win;
var end_game;
get_configuration();


function get_configuration(){
	//console.clear();
	nb_rows = document.getElementById("nb_rows").value;
	nb_cols = document.getElementById("nb_cols").value;
	nb_win = document.getElementById("nb_win").value;

	//Random
	red_random = document.getElementById("red_random").checked;
	black_random = document.getElementById("black_random").checked;

	//IA
	red_ia = document.getElementById("red_ia").checked;
	black_ia = document.getElementById("black_ia").checked;

	//Aleatoire 
	player_red = Math.random() >= 0.5;
	if(player_red)
		document.getElementById("player_round").innerHTML = "Au rouge de jouer";
	else
		document.getElementById("player_round").innerHTML = "Au noir de jouer";

	if(red_random && black_random)
		random_player();

	end_game = 1;
	create_table();
} 

function create_table(){
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
		}
	}
	document.getElementById("game").appendChild(table_game);
	document.getElementById("winner").remove();
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
		if(player_red)
			document.getElementById("game" + i + "_" + j).className = "red";
		else
			document.getElementById("game" + i + "_" + j).className = "black";
		end_game = check_win(i, j, get_col(i,j));
		if(end_game == 0){
			if(player_red)
				document.getElementById("winner").innerHTML = "Red win";
			else
				document.getElementById("winner").innerHTML = "Black win";
		}else if(end_game == 1){
			player_red = ! player_red;
			if(player_red)
				document.getElementById("player_round").innerHTML = "Au rouge de jouer";
			else
				document.getElementById("player_round").innerHTML = "Au noir de jouer";
			if(player_red && red_random){
				random_player();
			}else if(!player_red && black_random){
				random_player();
			}

		}else{
			document.getElementById("winner").innerHTML = "Egality";
		}
	}
}

function get_col(i, j) {
	return document.getElementById("game" + i + "_" + j).className;
}

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


function random_player() {
	do{
		var i =  Math.floor((Math.random() * nb_rows));
		var j = Math.floor((Math.random() * nb_cols));
	}while(get_col(i, j) == "red" || get_col(i, j) == "black");
	play(i,j);
}

/*

function get_estimate_min(x, y, col){
	if(check_win(x, y, col) == 0)
		return 1;
	else if(check_win(x, y, col) == 2)
		return 0;

	var min = Infinity;

	for(i = 0; i < nb_rows; i++){
		for(j = 0; j < nb_cols; j++){
			if(get_col(x,y) != "red" && get_col(x,y) != "black")
				var val = get_estimate_max(x, y, col);
				if(val < min)
					min = val;
		}
	}
	return min;
} 


function min(grille, col){
	if(check_win(x,y,col) == 0)
		return 

}*/

/*TO DO
Check win in line
Check win in col
Check win in diag
Check egality
Display result
*/

/*

Profondeur de recherche ?
*/

