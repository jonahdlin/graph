/*-----------------
Tool Select
-----------------*/
function selectTool(tool) {
	operation = tool;
}

function onClick(evt) {
	var rect = canvas.getBoundingClientRect();
	curCoords.x = Math.floor(evt.clientX-rect.left)*canvas.width/rect.width;
	curCoords.y = Math.floor(evt.clientY-rect.top)*canvas.height/rect.height;
	console.log("Clicked for vertex at: (", curCoords.x, ",", curCoords.y, ")");
	console.log("Rect: (", rect.left, ",", rect.top, ")");
	console.log("EVT: (", evt.clientX, ",", evt.clientY, ")");
	selected = inVertex(curCoords);
	//console.log(selected);
	switch (operation) {
		case "node":
			nodeOnClick();
			break;
		case "edge":
			edgeOnClick();
			break;
		case "del":
			delOnClick();
			break;
		case "vname":
			nodeRename();
			break;
		case "evalue":
			console.log("HI");
			addEdgeValue();
			break;
	}
}

function endClick(evt) {
	switch (operation) {
		case "node":
			var rect = canvas.getBoundingClientRect();
			curCoords.x = Math.floor(evt.clientX-rect.left)*canvas.width/rect.width;
			curCoords.y = Math.floor(evt.clientY-rect.top)*canvas.height/rect.height;
			nodeEndClick();
			break;
		case "edge":
			edgeEndClick();
			break;
		case "del":
			delEndClick();
	}
	console.log("Edges:", edges, "\nVertices:", vtcs);
}



/*-----------------
Dragging (Node)
-----------------*/
function moveNode(evt) {
	if (dragging) {
		var rect = canvas.getBoundingClientRect();
		curCoords = {
			x: (evt.clientX-rect.left)*canvas.width/rect.width,
			y: (evt.clientY-rect.top)*canvas.height/rect.height
		};
		//console.log("Currently at: (", curCoords.x, ",", curCoords.y, ")");
		animateVertex(selected, curCoords);
	}
}

function nodeEndClick() {
	if (dragging) {
		dragging = false;
		canvas.onmousemove = null;
	} else {
		var new_v =  new Node(curCoords.x,curCoords.y);
		vtcs.push(new_v);
	}
	//console.log("Released at: (", curCoords.x, ",", curCoords.y, ")");
	refreshCanvas();
}

function nodeOnClick() {
	if (selected != -1) {
		//console.log("IN VERTEX");
		dragging = true;
		canvas.onmousemove = moveNode;
	}
}

/*-----------------
Deleting
-----------------*/
function delEndClick() {
	refreshCanvas();
}
function delOnClick() {
	if (selected != -1) {
		deleteConnectedEdges(selected);
		for (var i = edges.length - 1; i >= 0; i--) {
			if (edges[i].v1 > selected) { edges[i].v1 -= 1; }
			if (edges[i].v2 > selected) { edges[i].v2 -= 1; }
		}
		//remove the node from the 'list of neighbours' of all of its neighbours
		for(var i=0;i<vtcs[selected].neighbours.length;i++){
			var indexToRemove=vtcs[selected].neighbours[i].neighbours.indexOf(vtcs[selected]);
			vtcs[selected].neighbours[i].neighbours.splice(indexToRemove,1);
		}
		vtcs.splice(selected, 1);
	} else {
		var lineClick = onEdge(curCoords, 8);
		//console.log(lineClick);
		//console.log(edges);
		if (lineClick != -1) {
			var node1=edges[lineClick].v1;
			var node2=edges[lineClick].v2;
			var index1=vtcs[node1].neighbours.indexOf(vtcs[node2]);
			var index2=vtcs[node2].neighbours.indexOf(vtcs[node1]);
			vtcs[node1].neighbours.splice(index1,1);
			vtcs[node2].neighbours.splice(index2,1);
			edges.splice(lineClick, 1);
		}
	}
}

/*-----------------
Edge Making
-----------------*/
function moveEdge(evt) {
	if (edgeMaking) {
		var rect = canvas.getBoundingClientRect();
		curCoords = {
			x: (evt.clientX-rect.left)*canvas.width/rect.width,
			y: (evt.clientY-rect.top)*canvas.height/rect.height
		};
		//console.log("Currently at: (", curCoords.x, ",", curCoords.y, ")");
		animateLine(currEdge, curCoords);
	}
}

function edgeEndClick() {
	edgeMaking = false;
	currEdge = {
		x: -1,
		y: -1
	};
	canvas.onmousemove = null;
	//console.log(curCoords);
	var new_selected = inVertex(curCoords);
	if (new_selected != -1 && new_selected != selected) {
		var new_edge = new Edge(selected,new_selected);
		
		if (!inEdgeSet(new_edge)) {
			edges.push(new_edge);
			vtcs[selected].neighbours.push(vtcs[new_selected]);
			vtcs[new_selected].neighbours.push(vtcs[selected]);
		}
	}
	//console.log(edges);
	refreshCanvas();
	//console.log("Released at: (", curCoords.x, ",", curCoords.y, ")");
}

function edgeOnClick() {
	if (selected != -1) {
		//console.log("IN VERTEX");
		edgeMaking = true;
		currEdge.x = vtcs[selected].x;
		currEdge.y = vtcs[selected].y;
		canvas.onmousemove = moveEdge;
	}
}

// deletes all edges connected to the vertex with id vtx_id
function deleteConnectedEdges(vtx_id) {
	for (var i = edges.length - 1; i >= 0; i--) {
		if (edges[i].v1 == vtx_id || edges[i].v2 == vtx_id) {
			edges.splice(i, 1);
		}
	}
}

//Renaming a node
function nodeRename(){
	if(selected==-1) return;
	//placeholder code, need to find a better way to read names
	var newName=prompt("Enter a new name","");
	if(newName==null) return;
	vtcs[selected].name=newName;
	refreshCanvas();
}

//Find a bipartition, if one is found, reorganize graph to clearly display it
function bipartition(){
	Avtc = []
	Bvtc = []
	addToA=false; //where the next batch of vertices should be added

	for(var i=0;i<vtcs.length;i++){vtcs[i].coloring="";}

	if(vtcs.length == 0) return; //guard against weird edge cases

	while(Avtc.concat(Bvtc).length<vtcs.length){
		var seed;
		for(var i=0;i<vtcs.length;i++){
			seed=vtcs[i];
			if(!(inVertexSet(seed,Avtc) || inVertexSet(seed,Bvtc))){
				break;
			}
		}
		if(!bipartitionRecurse(seed,"A",Avtc,Bvtc)){
			document.getElementById("bipartiteButton").style.webkitAnimationPlayState = "running";
			setTimeout(function(){
				document.getElementById("bipartiteButton").style.webkitAnimationPlayState = "paused";
			},1500);
			console.log("NOT BIPARTITE");
			return;
		}
	}

	//Move vertices to show bipartism
	var canvasHeight=$("#mainCanvas").height();
	var canvasWidth=$("#mainCanvas").width();
	var shortStart=false;
	var yPos=2*Avtc[0].r;
	var xPos=canvasWidth/3;
	for(var i=0;i<Avtc.length;i++){
		if(yPos>canvasHeight-Avtc[i].r){
			yPos=2*Avtc[0].r;
			shortStart=!shortStart;
			if(shortStart) yPos+=Avtc[0].r;
			xPos-=4*Avtc[i].r;
		}
		Avtc[i].move(500,xPos,yPos);
		yPos+=4*Avtc[i].r;
	}
	yPos=2*Avtc[0].r;
	xPos=2*canvasWidth/3;
	shortStart=false;
	for(var i=0;i<Bvtc.length;i++){
		if(yPos>canvasHeight-Bvtc[i].r){
			yPos=2*Avtc[0].r;
			shortStart=!shortStart;
			if(shortStart) yPos+=Avtc[0].r;
			xPos+=4*Bvtc[i].r;
		}
		Bvtc[i].move(500,xPos,yPos);
		yPos+=4*Bvtc[i].r;
	}
	console.log("Avtc=",Avtc);
	console.log("Bvtc=",Bvtc);
}

function bipartitionRecurse(node,thisColor,Avtc,Bvtc){
	node.coloring=thisColor;
	if(thisColor=="A") Avtc.push(node);
	if(thisColor=="B") Bvtc.push(node);
	var didItWork=true;
	for(var i=0;i<node.neighbours.length;i++){
		if(thisColor=="A" && node.neighbours[i].coloring=="") didItWork=didItWork && bipartitionRecurse(node.neighbours[i],"B",Avtc,Bvtc);
		if(thisColor=="B" && node.neighbours[i].coloring=="") didItWork=didItWork && bipartitionRecurse(node.neighbours[i],"A",Avtc,Bvtc);
		if(thisColor==node.neighbours[i].coloring) return false;
	}
	return didItWork;
}

function addEdgeValue(){
	var lineClick = onEdge(curCoords, 8);
	if(lineClick==-1) return;
	var value=prompt("Enter a new value","");
	if(isNaN(value)) return;
	edges[lineClick].value=value;
	refreshCanvas();
}