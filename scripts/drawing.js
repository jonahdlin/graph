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
		drawLine(edges[i]);
	}
}

// creates the specified vertex
function drawVertex(vtx) {
	c.beginPath();
	c.arc(vtx.x, vtx.y, vtx.r, 0, 2*Math.PI);
	c.fillStyle = vtx.col;
	c.fill();
	c.strokeStyle = vtx.bcol;
	c.lineWidth = vtx.bThickness;
	c.stroke();
	c.font = "15px Arial";
	c.fillStyle = 'black';
	c.fillText(vtx.name,vtx.x-vtx.r,vtx.y-(15+vtx.r));
}

function drawLine(edge){
	c.beginPath();
	c.moveTo(vtcs[edge.v1].x, vtcs[edge.v1].y);
	c.lineTo(vtcs[edge.v2].x, vtcs[edge.v2].y);
	c.strokeStyle = edge.colour;
	c.lineWidth = edge.thickness;
	drawValue(edge);
	c.stroke();
}

//calculates and draws the 'value' field of an edge
function drawValue(edge){
	if(isNaN(edge.value)) return;
	c.font = "15px Arial";
	c.fillStyle = 'black';
	var v1=vtcs[edge.v1];
	var v2=vtcs[edge.v2];
	var xPos=(v1.x+v2.x)/2;
	var yPos=(v1.y+v2.y)/2;
	var perpendicularSlope=-xPos/yPos;
	xPos+=5;
	yPos+=5*perpendicularSlope;
	c.fillText(edge.value,xPos,yPos);
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

function createInputBox(obj,title){
	var box = document.createElement("div");
	var boxHeight=50;
	var boxWidth=100;

	box.style.zIndex="2";
	box.style.position="absolute";
	
	box.style.textAlign="center";
	box.style.width=boxWidth+"px";
	box.style.height=boxHeight+"px";
	box.style.opactiy="0.5";
	box.style.backgroundColor="#7799ce";
	box.style.borderRadius="10px";
	box.style.padding="5px";

	var input = document.createElement("input");
	input.style.width=boxWidth-10+"px";
	input.setAttribute("id","derp");
	//input.setAttribute("onfocusout","submit(this,"+title+")");

	$(input).blur(function(){
		submit(this,title,obj);
		refreshCanvas();
	});

	$(input).keypress(function(e){
		if(e.which==13){
			this.blur();
		}
	});

	if(title==1){
		box.innerHTML="Name?";
		box.style.left=obj.x+"px";
		box.style.top=obj.y-50+"px";
	}else if(title==2){
		box.innerHTML="Value?";
		const v1=vtcs[obj.v1];
		const v2=vtcs[obj.v2];
		box.style.left=(v1.x+v2.x)/2+"px";
		box.style.top=((v1.y+v2.y)/2)-50+"px";
	}

	box.appendChild(input);
	document.body.appendChild(box);

	setTimeout(function(){
		input.focus();
	},50);
	//If you're a Software Engineer reading this, I'm sorry. Simply calling focus() doesnt work.
}

function submit(input,title,obj){
	if(input.value!=""){
		switch(title){
			case 1: //name
				obj.name=input.value;
				break;
			case 2: //value
				obj.value=input.value;
				break;
		}
	}
	input.parentElement.parentElement.removeChild(input.parentElement);
}