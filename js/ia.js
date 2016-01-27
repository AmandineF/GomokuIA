/**
 * @file ia.js
 * Artificial intelligence
 * @author Amandine Fouillet <amandinefouillet@gmail.com>
 * @author Laura Guillemot <laura.guillemot@insa-rennes.fr>
 */

var searchDepth, nb_rows, nb_cols, nb_win, cptWin;

/**Worker**/
onmessage = function(e) {
	var data = e.data;
	searchDepth = data.depth;
	nb_rows = data.grid.length;
	nb_cols = data.grid[0].length;
	nb_win = data.nb_win;
	player = data.player;
	connect4 = data.connect4;
	lastx = data.lastx;
	lasty = data.lasty;

	switch(data.cmd){
		case "random":
			setTimeout(function(){ random_player(data.grid) }, 500);
			break;
		case "ia":
			if(connect4){
				setTimeout(function(){ iaPlay(data.grid, searchDepth) }, 200);
			} else{
				iaPlay(data.grid, searchDepth);
			}
			break;
	}
};

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
	var tmp, xplay = -1, yplay = -1;
	var max = -Infinity;
	var alpha = -Infinity;
	var beta = Infinity;
	for(var x = 0; x < grid.length; x++){
		for(var y = 0; y < grid[0].length; y++){
			postMessage({cmd:"update",value:(x*nb_cols+y)*100/(nb_rows*nb_cols), x:x, y:y});
			if((x == 5) || ((x+1 < 6) && connect4 && grid[x + 1][y] != 0) || !connect4) {
				if(grid[x][y] == 0){
					grid[x][y] = player;
					tmp = iaMin(grid, depth-1, alpha, beta);
					if(tmp > max) {
						max = tmp; 
						xplay = x; 
						yplay = y;
					}
					if(tmp >= beta){
						xplay = x; 
						yplay = y;
						play(xplay, yplay);
						grid[x][y] = 0;
						return 0;
					}
					if(tmp > alpha){
						alpha = tmp;
					}
					grid[x][y] = 0;
				}
			}
		}
	}
	postMessage({cmd:"coup",x:xplay,y:yplay});
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
			if((i == 5) || ((i+1 < 6) && connect4 && grid[i + 1][j] != 0) || !connect4) {
				if(grid[i][j] == 0){
					grid[i][j] = player;
					tmp = iaMin(grid, depth-1, alpha, beta);
					if(tmp > max){
						max = tmp; 
					}
					if(tmp >= beta){
						grid[i][j] = 0;
						return tmp;
					}
					if(tmp > alpha){
						alpha = tmp;
					}
					grid[i][j] = 0;
				}
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
			if((i == 5) || ((i+1 < 6) && connect4 && grid[i + 1][j] != 0) || !connect4) {
				if(grid[i][j] == 0){
					grid[i][j] = token;
					tmp = iaMax(grid, depth-1, alpha, beta);
					if(tmp < min){
						min = tmp; 
					}
					if(tmp <= alpha){
						grid[i][j] = 0;
						return tmp;
					}
					if(tmp < beta){
						beta = tmp;
					}
					grid[i][j] = 0;
				}
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
	var res = 0;
	for(var i = 0; i < grid.length; i++)
		for(var j = 0; j < grid[0].length; j++)
			if(grid[i][j] != 0)
				nbPions++;

	var estimation1 = alignToken(grid, nb_win, 1);
	if(cptWin >= 1){
		if(player == 1)
			return 10000 - nbPions;
		else
			return -10000 + nbPions;
	}

	var estimation2 = alignToken(grid, nb_win, 2);
	if(cptWin >= 1){
		if(player == 2)
			return 10000 - nbPions;
		else
			return -10000 + nbPions;
	}	


	if(player == 1)
		return estimation1-estimation2;
	else
		return estimation2-estimation1;
}

/**
 * @function winner
 * Return the winner of the game
 * @param grid - The grid of the game
 * @return 1 if the winner is the red player, 2 if it is the black player, 
 *			0 if they are neck and neck, 3 if the game is not finish
 */
function winner(grid){
    alignToken(grid, nb_win, 1);
    if(cptWin >= 1)
        return 1;
  
    alignToken(grid, nb_win, 2);
    if(cptWin >= 1)
        return 2;


    for(var i=0;i<grid.length;i++)
        for(var j=0;j<grid[0].length;j++)
            if(grid[i][j] == 0)
                return 0;
    return 3;
}


/**
 * @function random_player()
 * Play a token randomly
 * @param grid - The grid of the actual game
 */
function random_player(grid) {
	var i = -1, j = -1;
	if(!connect4) {
		do{
			i =  Math.floor((Math.random() * nb_rows));
			j = Math.floor((Math.random() * nb_cols));
		}while(grid[i][j] != 0);
	}else{
		do{
			i = Math.floor((Math.random() * nb_rows));
			j = Math.floor((Math.random() * nb_cols));
		}while(grid[i][j] != 0 || (i + 1 < 6 && grid[i + 1][j] == 0));
	}
	postMessage({cmd:"coup",x:i, y:j});
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

/**
 * @function pasteGrid
 * Copy a grid 
 * @param grid - The grid of the actual game
 * @param nb_align - The number of aligned token 
 * @param player - The id of the player
 */
function alignToken(grid, nb_align, player){
	var cpt = token = estimation = x = y = 0;
	cptWin = 0;
	//NO-SE
	for(y = 0; y < grid[0].length; y++){
		var j = y;
		x=0;
		cpt = token = 0;
		while(j < grid[0].length && x < grid.length){
			switch(grid[x][j]){
				case 0:
					cpt++;
					break;
				case player:
					token++;
					if(token == nb_align)
						cptWin++;
					break;
				default:
					cpt = 0; 
					token = 0;
					break;
			} 
			j++;
			x++;
		}
		if(cpt >= nb_align)
			estimation += cpt + token;
	}

	cpt = token = x = y = 0;
	for(x = 1; x < grid.length; x++){
		var i = x;
		y=0;
		cpt = token = 0;
		while(y < grid[0].length && i < grid.length){
			switch(grid[i][y]){
				case 0:
					cpt++;
					break;
				case player:
					token++;
					if(token == nb_align)
						cptWin++;
					break;
				default:
					cpt = 0; 
					token = 0;
					break;
			} 
			i++;
			y++;
		}
		if(cpt >= nb_align)
			estimation += cpt + token;
	}

	cpt1 = cpt2 = x = y = 0;

	//SO-NE
	for(y = grid[0].length-1; y >= 0; y--){
		var j = y;
		x=0;
		cpt = token = 0;
		while(j >= 0 && x < grid.length){
			switch(grid[x][j]){
				case 0:
					cpt++;
					break;
				case player:
					token++;
					if(token == nb_align)
						cptWin++;
					break;
				default:
					cpt = 0; 
					token = 0;
					break;
			} 
			j--;
			x++;
		}
		if(cpt >= nb_align)
			estimation += cpt + token;
	}

	cpt1 = cpt2 = x = y = 0;
	for(x = 1; x < grid.length; x++){
		var i = x;
		y=grid[0].length-1;
		cpt = token = 0;
		while(y >= 0 && i < grid.length){
			switch(grid[i][y]){
				case 0:
					cpt++;
					break;
				case player:
					token++;
					if(token == nb_align)
						cptWin++;
					break;
				default:
					cpt = 0; 
					token = 0;
					break;
			} 
			i++;
			y--;
		}
		if(cpt >= nb_align)
			estimation += cpt + token;
	}

	//Lines
	for(var i = 0; i < grid.length; i++){
		cpt = token = 0;
		for(var j = 0; j < grid[0].length; j++){
			switch(grid[i][j]){
				case 0:
					cpt++;
					break;
				case player:
					token++;
					if(token == nb_align)
						cptWin++;
					break;
				default:
					cpt = 0; 
					token = 0;
					break;
			} 
		}
		if(cpt >= nb_align)
			estimation += cpt + token;
	}

	//Columns
	for(var j = 0; j < grid[0].length; j++){
		cpt = token = 0;
		for(var i = 0; i < grid.length; i++){
			switch(grid[i][j]){
				case 0:
					cpt++;
					break;
				case player:
					token++;
					if(token == nb_align)
						cptWin++;
					break;
				default:
					cpt = 0; 
					token = 0;
					break;
			} 
		}
		if(cpt >= nb_align)
			estimation += cpt + token;
	}
	return estimation;
}
