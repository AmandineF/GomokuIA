/**
 * @file Gomoku game
 * Artificial intelligence
 * @author Amandine Fouillet <amandinefouillet@gmail.com>
 * @author Laura Guillemot <laura.guillemot@insa-rennes.fr>
 */

/**
 * @function get_configuration
 * @param originalGrid - The original grid of the game
 * @param depth - Search depth / difficulty
 */
function iaPlay(originalGrid, depth) {
	var iaGrid = pasteGrid(originalGrid);
	iaPlayer(iaGrid, depth);
}

/**
 * @function iaPlayer
 * @param grid - The grid of the game
 * @param depth - Search depth
 */
function iaPlayer(grid, depth) {
	var tmp, xplay, yplay;
	var max = -Infinity;
	var alpha = -Infinity;
	var beta = Infinity;
	for(var x = 0; x < grid.length; x++){
		for(var y = 0; y < grid[0].length; y++){
			if(grid[x][y] == 0){
				grid[x][y] = player;
				tmp = iaMin(grid, depth-1, alpha, beta);
				//console.log("TMP : " + tmp)
				if(tmp > max) {
					max = tmp; 
					xplay = x; 
					yplay = y;
					//console.log("NEW MAX : " + max);
				}
				if(tmp > beta){
					xplay = x; 
					yplay = y;
					//console.log("max " + tmp + " - beta " + beta);
					play(xplay, yplay);
					grid[x][y] = 0;
					return 0;
				}
				if(tmp >= alpha){
					alpha = tmp;
				}
				grid[x][y] = 0;
			}
		}
	}
	play(xplay, yplay);
}

/**
 * @function iaMax
 * @param grid - The grid of the game
 * @param depth - Search depth
 * @param alpha - Maximum lower bound of possible solutions
 * @param beta - Minimum upper bound of possible solutions
 */
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
				if(tmp > max){
					max = tmp; 
				}
				if(tmp >= beta){
					grid[i][j] = 0;
					//console.log("max " + tmp + " - beta " + beta);
					return tmp;
				}
				if(tmp > alpha){
					alpha = tmp;
				}
				grid[i][j] = 0;
			}
		}
	}
	return max;
}

/**
 * @function iaMin
 * @param grid - The grid of the game
 * @param depth - Search depth
 * @param alpha - Maximum lower bound of possible solutions
 * @param beta - Minimum upper bound of possible solutions
 */
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
				if(tmp < min){
					min = tmp; 
				}
				if(tmp < alpha){
					grid[i][j] = 0;
					//console.log("min " + tmp + " - beta " + alpha);
					return tmp;
				}
				if(tmp <= beta){
					beta = tmp;
				}
				grid[i][j] = 0;

			}
		}
	}
	return min;
}

/**
 * @function iaRanting
 * Return the estimation of the game 
 * @param grid -  The grid of the game
 */
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

/**
 * @function winner
 * Return the winner of the game
 * @param grid - The grid of the game
 * @return 1 if the winner is the red player, 2 if it is the black player, 
 *			0 if they are neck and neck, 3 if the game is not finish
 */
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

/**
 * @function alignToken
 * Count the number of set of nb_align aligned token
 * @param grid - The grid of the game
 * @param nb_align - The number of token in a set
 */
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

		//Horizontally
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

		//Vertically
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

/**
 * @function pasteGrid
 * Copy a grid 
 * @param grid - The grid to be cloned
 */
function pasteGrid(grid) {
	var newGrid = [];
	for(var i = 0; i < nb_rows; i++)
		newGrid[i] = grid[i].concat([]);
	return newGrid;
}