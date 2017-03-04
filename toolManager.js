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
		var new_v =  new node(curCoords.x,curCoords.y);
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
		vtcs.splice(selected, 1);
	} else {
		var lineClick = onEdge(curCoords, 8);
		//console.log(lineClick);
		//console.log(edges);
		if (lineClick != -1) {
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
		var new_edge = new edge(selected,new_selected);
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