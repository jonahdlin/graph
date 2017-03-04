/*-----------------
Tool Select
-----------------*/
function selectTool(tool) {
	operation = tool;
}

function onClick(evt) {
	var rect = canvas.getBoundingClientRect();
	curCoords.x = Math.floor(evt.clientX-rect.left);
	curCoords.y = Math.floor(evt.clientY-rect.top);
	//console.log("Clicked for vertex at: (", curCoords.x, ",", curCoords.y, ")");
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
	}
}

function endClick(evt) {
	switch (operation) {
		case "node":
			var rect = canvas.getBoundingClientRect();
			curCoords.x = Math.floor(evt.clientX-rect.left);
			curCoords.y = Math.floor(evt.clientY-rect.top);
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
			x: evt.clientX-rect.left,
			y: evt.clientY-rect.top
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
			var nodeToRemove1=edges[lineClick].v1;
			var nodeToRemove2=edges[lineClick].v2;
			var indexToRemove1=vtcs[nodeToRemove1].neighbours.indexOf(vtcs[nodeToRemove2]);
			var indexToRemove2=vtcs[nodeToRemove2].neighbours.indexOf(vtcs[nodeToRemove1]);
			vtcs[nodeToRemove1].neighbours.splice(indexToRemove1,1);
			vtcs[nodeToRemove2].neighbours.splice(indexToRemove1,2);
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
			x: evt.clientX-rect.left,
			y: evt.clientY-rect.top
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
		vtcs[selected].neighbours.push(vtcs[new_selected]);
		vtcs[new_selected].neighbours.push(vtcs[selected]);
		if (!inEdgeSet(new_edge)) {
			edges.push(new_edge);
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
	edgedNodes = []

	for(var i=0;i<vtcs.length;i++){
		var curr=vtcs[i];
		if(curr.neighbours.length!=0) edgedNodes.push(curr);
	}

	if(vtcs.length == 0 || edgedNodes.length==0) return; //guard against weird edge cases
	var seed=vtcs[0];
	Avtc.push(seed);
	addToA=false; //where the next batch of vertices should be added

	//Create complete partitions of A and B
	while(Avtc.concat(Bvtc).length!=edgedNodes.length){
		if(addToA){
			for(var i=0;i<Bvtc.length;i++){
				var curr=Bvtc[i];
				for(var j=0;j<curr.neighbours.length;j++){
					if(!inVertexSet(curr.neighbours[j],Avtc)){
						Avtc.push(curr.neighbours[j]);
					}
				}
			}
			addToA=!addToA;
		}else{
			for(var i=0;i<Avtc.length;i++){
				var curr=Avtc[i];
				for(var j=0;j<curr.neighbours.length;j++){
					if(!inVertexSet(curr.neighbours[j],Bvtc)){
						Bvtc.push(curr.neighbours[j]);
					}
				}
			}
			addToA=!addToA;
		}
	}

	//Check to see if partitions are actually bipartite
	for(var i=0;i<edgedNodes.length;i++){
		var curr=edgedNodes[i];
		for(var j=0;j<curr.neighbours.length;j++){
			var neighbour=curr.neighbours[j];
			if( (inVertexSet(curr,Avtc) && inVertexSet(neighbour,Avtc)) ||
				(inVertexSet(curr,Bvtc) && inVertexSet(neighbour,Bvtc))){
				console.log("NOT BIPARRITE");
				return;
			}
		}
	}

	//Move vertices to show bipartism
	//For laziness I will assume vertices will go only in two straight vertical lines
	var thirdWidth=window.innerWidth*0.8/3;
	var height=50;
	for(var i=0;i<Avtc.length;i++){
		Avtc[i].move(2000,thirdWidth,height);
		height+=4*vProps.r;
	}
	height=50;
	for(var i=0;i<Bvtc.length;i++){
		Bvtc[i].move(2000,2*thirdWidth,height);
		height+=4*vProps.r;
	}
	console.log("Avtc=",Avtc);
	console.log("Bvtc=",Bvtc);
}