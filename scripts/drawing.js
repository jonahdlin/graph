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
	c.font = "15px Arial";
	c.fillStyle = 'black';
	c.fillText(vtx.name,vtx.x-vProps.r,vtx.y-(15+vProps.r));
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