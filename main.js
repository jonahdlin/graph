/*-----------------
Todo
-----------------*/
/*
- Add style customizability
- Add leniency when dragging edge to tiny radius vertex
- Vertex labelling
- Prettify page (and make canvas size variable)
	- Also make edge dragging and dropping nicer
*/

/*-----------------
Initialization
-----------------*/
var canvas, 			//canvas
	c, 					//context
	curCoords = {		//mouse
		x: -1,
		y: -1
	},
	cProps = {
		colour: "#EFEFEF"
	},
	vProps = {			//vertex properties
		r: 20,
		fColour: "#FF383F",
		bColour: "black",
		bThickness: 1
	},
	eProps = {			//edge properties
		thickness: 2,
		colour: "#A9A9A9"
	},
	vtcs = [],			//set of vertices
	edges = [],			//set of edges
	dragging = false,	//is the user dragging a node?
	selected = -1,		//current selected node (-1 if nothing selected)
	edgeMaking = false,	//is the user making an edge?
	operation = "node",	//what operation is the user performing?
	currEdge = {		//starting position of current animated edge
		x: -1,
		y: -1
	};

window.onload = function(){
	canvas = document.getElementById("mainCanvas");
	c = canvas.getContext("2d");
	canvas.addEventListener("mousedown", onClick, false);
	canvas.addEventListener("mouseup", endClick, false);
	clearCanvas();
};

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
Drawing
-----------------*/
function clearCanvas() {
	c.fillStyle = cProps.colour;
	c.fillRect(0,0,canvas.width, canvas.height);
	vtcs = [];
	edges = [];
}

function refreshCanvas() {
	c.fillStyle = cProps.colour;
	c.fillRect(0,0,canvas.width, canvas.height);
	for (var i = vtcs.length - 1; i >= 0; i--) {
		drawVertex(vtcs[i]);
	}
	for (var i = edges.length - 1; i >= 0; i--) {
		drawLine(vtcs[edges[i].v1], vtcs[edges[i].v2]);
	}
}

// creates the specified vertex
function drawVertex(vtx) {
	c.beginPath();
	c.arc(vtx.x, vtx.y, vProps.r, 0, 2*Math.PI);
	c.fillStyle = vtx.col;
	c.fill();
	c.strokeStyle = vProps.bColour;
	c.lineWidth = vProps.bThickness;
	c.stroke();
}

function drawLine(orig, dest) {
	c.beginPath();
	c.moveTo(orig.x, orig.y);
	c.lineTo(dest.x, dest.y);
	c.strokeStyle = eProps.colour;
	c.lineWidth = eProps.thickness;
	c.stroke();
}

function animateVertex(vtx, dest) {
	vtcs[vtx].x = dest.x;
	vtcs[vtx].y = dest.y;
	refreshCanvas();
}

function animateLine(orig, dest) {
	refreshCanvas();
	c.beginPath();
	c.moveTo(orig.x, orig.y);
	c.lineTo(dest.x, dest.y);
	c.strokeStyle = eProps.colour;
	c.lineWidth = eProps.thickness;
	c.stroke();
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
		var new_v = {
			x: curCoords.x,
			y: curCoords.y,
			col: vProps.fColour,
			name: ""
		};
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
		var new_edge = {
			v1: selected,
			v2: new_selected
		};
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

/*-----------------
Vertex/edge recognition
-----------------*/
// returns the index of the vertex if passed coordinates are in a vertex, or -1 if it is not in a vertex
// currently O(n), can later make O(logn)
function inVertex(coords) {
	for (var i = vtcs.length - 1; i >= 0; i--) {
		if (Math.sqrt(Math.pow((coords.x - vtcs[i].x), 2) + Math.pow((coords.y - vtcs[i].y), 2)) <= vProps.r) {
			return i; 
		}
	}
	return -1;
}

function onEdge(coords, tol) {
	for (var i = edges.length - 1; i >= 0; i--) {
		var v1 = {
				x: vtcs[edges[i].v1].x,
				y: vtcs[edges[i].v1].y
			},
			v2 = {
				x: vtcs[edges[i].v2].x,
				y: vtcs[edges[i].v2].y
			};
		// there's probably a better way to do this ....
		if (v1.x < v2.x) {
			var left = v1.x,
				right = v2.x;
		} else {
			var left = v2.x,
				right = v1.x;
		}
		if (v1.y > v2.y) {
			var top = v1.y,
				bottom = v2.y;
		} else {
			var top = v2.y,
				bottom = v1.y;
		}

		var slope = (v1.y-v2.y)/(v1.x-v2.x);
		var yint = (v1.y - slope*v1.x);

		if (coords.y < top && coords.y > bottom && coords.x < right && coords.x > left
			&& Math.abs(coords.y - slope*coords.x - yint) <= Math.max(tol, eProps.thickness)) {
			return i;
		}
	}
	return -1;
}

// returns true if the edge given is in the edge set already
function inEdgeSet(edge) {
	for (var i = edges.length - 1; i >= 0; i--) {
		if (edge.v1 == edges[i].v1 && edge.v2 == edges[i].v2 ||
			edge.v1 == edges[i].v2 && edge.v2 == edges[i].v1) {
			return true;
		}
	}
	return false;
}