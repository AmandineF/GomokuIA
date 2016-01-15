function openThat() {
	document.getElementById('princ').className = 'col-xs-8';
	document.getElementById('config').className = 'col-xs-4 text-right';
	document.getElementById('config').textAlign = 'right';
	document.getElementById('config').style.display = 'inline-block';
	document.getElementById('btnOpen').style.display = 'none';
	document.getElementById('btnClose').style.display = 'inline-block';
	document.getElementById('foot').style.left = '0';
}

function closeThat() {
	document.getElementById('princ').className = 'col-xs-12';
	document.getElementById('config').style.display = 'none';
	document.getElementById('btnClose').style.display = 'none';
	document.getElementById('btnOpen').style.display = 'inline-block';
	document.getElementById('foot').style.right = '0';
	document.getElementById('foot').style.left = 'inherit';
}

function inc(id, max){
	var span = document.getElementById(id);
	var old = span.innerHTML;
	if(old < max){
		while(span.firstChild){
		    span.removeChild( span.firstChild );
		}
		old++;
		document.getElementById(id).appendChild(document.createTextNode(old));
	}
}

function dec(id, min){
	var span = document.getElementById(id);
	var old = span.innerHTML;
	if(old>min){
		while(span.firstChild){
		    span.removeChild( span.firstChild );
		}
		old--;
		document.getElementById(id).appendChild(document.createTextNode(old));
	}
}

function setValue(id, value){
	var span = document.getElementById(id);
	while(span.firstChild){
	    span.removeChild( span.firstChild );
	}
	document.getElementById(id).appendChild(document.createTextNode(value));
}

function showComp(){
	document.getElementById('color').style.display = 'inline-block';
	document.getElementById('difficulty').style.display = 'inline-block';
}

function hideComp(){
	document.getElementById('color').style.display = 'none';
	document.getElementById('difficulty').style.display = 'none';
}

function displayContinue(bool){
	document.getElementById('continue').style.display = 'inline-block';
	if(bool == 1)
		document.getElementById('continue').style.backgroundColor = '#ed5564';
	else if(bool == 2)
		document.getElementById('continue').style.backgroundColor = '#5c9ded';
	else
		document.getElementById('continue').style.backgroundColor = '#99d468';

}

function hideContinue(){
	document.getElementById('continue').style.display = 'none';
}



