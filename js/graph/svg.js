
/*
p :
	width
	height
	topmargin
	toptitle
	bottommargin
	bottomlabel
	leftmargin
	leftlabel
	rightmargin
	
	counthorizontallines
	probabilities
	labels
	title
	
	// labels.length = probabilities.length

*/

var __XMLNS = "http://www.w3.org/2000/svg";

function drawGraph(p) {
	
	var s = getSVG(p);
	s.appendChild(getTitle(p));
	s.appendChild(getBottomLabels(p));
	s.appendChild(getLeftLabels(p));
	
	s.appendChild(getHorizontalLines(p));
	s.appendChild(getAxes(p));
	s.appendChild(getHistogram(p));
	
	document.getElementById("graph").appendChild(s);
	
}

function getSVG(p) {
	/* use p.width, p.leftmargin, p.rightmargin, p.height, p.topmargin, p.bottommargin */
	
	var svgElmt = document.createElementNS(__XMLNS, "svg");
	svgElmt.setAttributeNS (null, "width", p.width + p.leftmargin + p.rightmargin);
	svgElmt.setAttributeNS (null, "height", p.height + p.topmargin + p.bottommargin);
	svgElmt.style.display = "block";
	
	var title = document.createElementNS(__XMLNS, "title");
	title.appendChild(document.createTextNode("Probabilité de trouver un certain nombre de clients dans le système, lorsqu'il est à l'équilibre."));
	svgElmt.appendChild(title);
	
	return svgElmt;
}

function deleteSVG() {
	var graph = document.getElementById("graph");
	while (graph.children.length > 0)
		graph.removeChild(graph.firstChild);
}

function getTitle(p) {
	/* use p.width, p.leftmargin, p.rightmargin, p.topmargin, p.toptitle, p.title */

	var g = document.createElementNS (__XMLNS, "g");
	g.setAttributeNS (null, "id", "top_title");
	
	var x = (p.leftmargin + p.rightmargin + p.width) * .5;
	var y = p.topmargin - p.toptitle;
	
	var t = document.createElementNS (__XMLNS, "text");
	t.setAttributeNS (null, "x", x);
	t.setAttributeNS (null, "y", y);
	t.setAttributeNS (null, "dominant-baseline", "middle");
	t.setAttributeNS (null, "text-anchor", "middle");
	t.setAttributeNS (null, "class", "svgbigtitle");
	t.appendChild(document.createTextNode(p.title));
	g.appendChild(t);
	
	return g;
}

function getBottomLabels(p) {
	/* use p.labels, p.height, p.topmargin, p.bottomlabel, p.leftmargin, p.width */

	var g = document.createElementNS (__XMLNS, "g");
	g.setAttributeNS (null, "id", "bottom_labels");
	
	var x_step = p.width / p.labels.length;
	var x = p.leftmargin + x_step / 2;
	var y = p.topmargin + p.height + p.bottomlabel;
	
	for (var i = 0, l = p.labels.length; i < l; i++) {
		var t = document.createElementNS (__XMLNS, "text");
		t.setAttributeNS (null, "x", x + x_step * i);
		t.setAttributeNS (null, "y", y);
		t.setAttributeNS (null, "dominant-baseline", "middle");
		t.setAttributeNS (null, "text-anchor", "middle");
		t.setAttributeNS (null, "class", "label label_bottom");
		t.appendChild(document.createTextNode(p.labels[i]));
		g.appendChild(t);
	}
	
	return g;
}

function getLeftLabels(p) {
	/* use p.probabilities, p.height, p.topmargin, p.leftlabel, p.leftmargin, p.counthorizontallines */
	
	var g = document.createElementNS (__XMLNS, "g");
	g.setAttributeNS (null, "id", "left_labels");
	
	var y_step = p.height / p.counthorizontallines;
	var y = p.topmargin + p.height;
	var x = p.leftmargin - p.leftlabel;
	
	var pmax = Math.min(1, Math.max(...p.probabilities) * 1.1);
	
	for (var i = 0, l = p.counthorizontallines + 1; i < l; i++) {
		var t = document.createElementNS (__XMLNS, "text");
		t.setAttributeNS (null, "x", x);
		t.setAttributeNS (null, "y", y - y_step * i);
		t.setAttributeNS (null, "dominant-baseline", "middle");
		t.setAttributeNS (null, "text-anchor", "middle");
		t.setAttributeNS (null, "class", "label label_left");
		t.appendChild(document.createTextNode((pmax * i / p.counthorizontallines).toFixed(2)));
		var tt = document.createElementNS (__XMLNS, "title");
		tt.appendChild(document.createTextNode(pmax * i / p.counthorizontallines));
		t.appendChild(tt);
		g.appendChild(t);
	}
	
	return g;
}

function getAxes(p) {
	/* use p.topmargin, p.height, p.leftmargin, p.width */
	
	var g = document.createElementNS (__XMLNS, "g");
	g.setAttributeNS (null, "id", "axes");
	
	var xt = p.leftmargin;
	var yt = p.topmargin;
	
	var x0 = p.leftmargin;
	var y0 = p.topmargin + p.height;
	
	var xr = p.leftmargin + p.width;
	var yr = p.topmargin + p.height;
	
	var t = document.createElementNS(__XMLNS, "path");
	t.setAttributeNS (null, "d", "M"+xt+" "+yt+" L"+x0+" "+y0+" L"+xr+" "+yr);
	t.setAttributeNS (null, "class", "axes");
	g.appendChild(t);
	
	return g;
}

function getHorizontalLines(p) {
	/* use p.height, p.topmargin, p.leftmargin, p.width, p.counthorizontallines */
	
	var g = document.createElementNS (__XMLNS, "g");
	g.setAttributeNS (null, "id", "horizontal_lines");
		
	var y_step = p.height / p.counthorizontallines;
	var y = p.topmargin;
	var xl = p.leftmargin;
	var xr = p.leftmargin + p.width;
	
	for (var i = 0, l = p.counthorizontallines; i < l; i++) {
		var t = document.createElementNS (__XMLNS, "line");
		t.setAttributeNS (null, "x1", xl);
		t.setAttributeNS (null, "y1", y + y_step * i);
		t.setAttributeNS (null, "x2", xr);
		t.setAttributeNS (null, "y2", y + y_step * i);
		t.setAttributeNS (null, "class", "horizontal_line");
		g.appendChild(t);
	}
	
	return g;
}

function getHistogram(p) {
	/* use p.probabilities, p.height, p.topmargin, p.leftmargin, p.width */
	
	var g = document.createElementNS (__XMLNS, "g");
	g.setAttributeNS (null, "id", "histogram");
	
	var x_step = p.width / p.labels.length;
	var x = p.leftmargin;
	var y1 = p.topmargin;
	var y0 = p.topmargin + p.height;
	var h = p.height;
	
	var pmax = Math.min(1, Math.max(...p.probabilities) * 1.1);
	
	for (var i = 0, l = p.probabilities.length; i < l; i++) {
		var t = document.createElementNS (__XMLNS, "rect");
		t.setAttributeNS (null, "x", x + x_step * i);
		t.setAttributeNS (null, "y", y0 - h * p.probabilities[i] / pmax);
		t.setAttributeNS (null, "width", x_step);
		t.setAttributeNS (null, "height", h * p.probabilities[i] / pmax);
		t.setAttributeNS (null, "class", "histogram_part");
		var tt = document.createElementNS (__XMLNS, "title");
		tt.appendChild(document.createTextNode(p.labels[i] + " = " + p.probabilities[i]));
		t.appendChild(tt);
		g.appendChild(t);
	}
	
	return g;
}
