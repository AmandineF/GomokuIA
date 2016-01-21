

//permet d'estimer la position
function iaEstimation(grille){
	var estimation = 0; //estimation globale de la position

	for(var x=0;x<nb_rows;x++){
		for(var y=0;y<nb_cols;y++){
			if(!grille[x][y]) continue;
			//estimation de la valeur de ce jeton et ajout au calcul d'estimation global
			switch(grille[x][y]){
				case 1:
					estimation += iaAnalyse(grille,x,y);
					break;
				case 2: 
					estimation -= iaAnalyse(grille,x,y);
					break;
			}
		}
	}
	if(player == 1)
		return estimation;
	else 
		return -estimation;
}

//permet de calculer le nombre de "libertés" pour la case donnée
function iaAnalyse(grille,x,y){
	var couleur = grille[x][y];
	var estimation = 0; //estimation pour toutes les directions
	var compteur = 0; //compte le nombre de possibilités pour une direction
	var centre = 0; //regarde si le jeton a de l'espace de chaque côté
	var bonus = 0; //point bonus liée aux jetons alliés dans cette même direction
	var i,j; //pour les coordonnées temporaires
	var pass=false; //permet de voir si on a passé la case étudiée
	var pLiberte = 1; //pondération sur le nombre de liberté
	var pBonus = 1; //pondération Bonus
	var pCentre = 2; //pondération pour l'espace situé de chaque côté

	//recherche horizontale
	for(i=0;i<nb_rows;i++){
		if(i==x){
			centre = compteur++;
			pass=true;
			continue;
		}
		switch(grille[i][y]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse
				if(pass){
					i=nb_rows; //il n'y aura plus de liberté supplémentaire, on arrête la recherche ici
				}else{
					//on réinitialise la recherche
					compteur = 0;
					bonus = 0;
				}
		}
	}
	if(compteur>=nb_win){
		//il est possible de gagner dans cette direction
		estimation += compteur*pLiberte + bonus*pBonus + (1-Math.abs(centre/(compteur-1)-0.5))*compteur*pCentre;
	}

	//recherche verticale
	compteur=0;
	bonus=0;
	pass=false;
	for(j=0;j<nb_cols;j++){
		if(j==y){
			centre=compteur++;
			pass=true;
			continue;
		}
		switch(grille[x][j]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse
				if(pass){
					j=nb_cols; //il n'y aura plus de liberté supplémentaire, on arrête la recherche ici
				}else{
					//on réinitialise la recherche
					compteur = 0;
					bonus = 0;
				}
		}
	}
	if(compteur>=nb_win){
		//il est possible de gagner dans cette direction
		estimation += compteur*pLiberte + bonus*pBonus + (1-Math.abs(centre/(compteur-1)-0.5))*compteur*pCentre;
	}

	//recherche diagonale (NO-SE)
	compteur=0;
	bonus=0;
	i=x;
	j=y;
	while(i-- >0 && j-- >0){
		switch(grille[i][j]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse, on arrête de rechercher
				i=0;
		}
	}
	centre=compteur++;
	i=x;
	j=y;
	while(++i<nb_rows && ++j<nb_cols){
		switch(grille[i][j]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse, on arrête de rechercher
				i=nb_rows;
		}
	}
	if(compteur>=nb_win){
		//il est possible de gagner dans cette direction
		estimation += compteur*pLiberte + bonus*pBonus + (1-Math.abs(centre/(compteur-1)-0.5))*compteur*pCentre;
	}

	//recherche diagonale (NE-SO)
	compteur=0;
	bonus=0;
	i=x;
	j=y;
	while(i-- >0 && ++j<nb_cols){
		switch(grille[i][j]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse, on arrête de rechercher
				i=0;
		}
	}
	centre=compteur++;
	i=x;
	j=y;
	while(++i<nb_rows && j-- >0){
		switch(grille[i][j]){
			case 0: //case vide
				compteur++;
				break;
			case couleur: //jeton allié
				compteur++;
				bonus++;
				break;
			default: //jeton adverse, on arrête de rechercher
				i=nb_rows;
		}
	}
	if(compteur>=nb_win){
		//il est possible de gagner dans cette direction
		estimation += compteur*pLiberte + bonus*pBonus + (1-Math.abs(centre/(compteur-1)-0.5))*compteur*pCentre;
	}

	return estimation;
}
