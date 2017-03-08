/*-----------------
Vertex/edge recognition
-----------------*/
// returns the index of the vertex if passed coordinates are in a vertex, or -1 if it is not in a vertex
// currently O(n), can later make O(logn)
function inVertex(coords) {
	for (var i = vtcs.length - 1; i >= 0; i--) {
		if (Math.sqrt(Math.pow((coords.x - vtcs[i].x), 2) + Math.pow((coords.y - vtcs[i].y), 2)) <= vtcs[i].r) {
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

//returns true if vertex is in an array already
function inVertexSet(vertex,array){
	for(var i = 0;i<array.length;i++){
		if(vertex==array[i]) return true;
	}
	return false;
}

//returns true if given numbers are within a certain range of each other
function withinRange(one,two,range){
	return Math.abs((one-two))<=range;
}