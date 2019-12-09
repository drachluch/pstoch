
var p = {
	'width': 800,
	'height': 500,
	'topmargin': 100,
	'toptitle': 50,
	'bottommargin': 100,
	'bottomlabel': 50,
	'leftmargin': 100,
	'leftlabel': 50,
	'rightmargin': 100,
	'title': "Probabilité de trouver le système dans un certain état à l'équilibre",
	
	'counthorizontallines': 5,
	'probabilities': [],
	'labels': []
};

function addEvent(element, event, func) {
    if (element.addEventListener)
        element.addEventListener(event, func, false);
    else
        element.attachEvent("on" + event, func);
}

function show_results(rho_color, rho, L, Lq, W, Wq, prob_no_wait, q0) {
	var p;
	p = document.getElementById("results_rho");
	p.style.color = rho_color;
	p.replaceChild(document.createTextNode(rho), p.firstChild);
	p = document.getElementById("results_l");
	p.replaceChild(document.createTextNode(L), p.firstChild);
	p = document.getElementById("results_lq");
	p.replaceChild(document.createTextNode(Lq), p.firstChild);
	p = document.getElementById("results_w");
	p.replaceChild(document.createTextNode(W), p.firstChild);
	p = document.getElementById("results_wq");
	p.replaceChild(document.createTextNode(Wq), p.firstChild);
	p = document.getElementById("results_prob_no_wait");
	p.replaceChild(document.createTextNode(prob_no_wait), p.firstChild);
	p = document.getElementById("results_q0");
	p.replaceChild(document.createTextNode(q0), p.firstChild);
}

function createLabels(number_of_states, offset) {
	var labels = [];
	for (var i = offset, l = offset + number_of_states; i < l; i++)
		labels.push("q"+i);
	return labels;
}

function createProbabilitiesK(number_of_states, offset, rho, k) {
	var probabilities = [];
	var l = offset + number_of_states;
	var lk = Math.min(l, k+1);
	
	if (rho == 1) {
		var q0 = 1 / (k + 1);
		for (var i = offset; i < lk; i++)
			probabilities.push(q0);
	} else {
		var div = 1 - Math.pow(rho, k + 1);
		for (var i = offset; i < lk; i++)
			probabilities.push((1 - rho) * Math.pow(rho, i) / div);
	}
	
	for (var i = lk; i < l; i++)
		probabilities.push(0);
	return probabilities;
}

function update_stuff() {
	var elmt_lambda = document.getElementById("lambda");
	var elmt_mu = document.getElementById("mu");
	var elmt_k = document.getElementById("k");
	var elmt_count_states = document.getElementById("graph_nbstates");
	var elmt_first_state = document.getElementById("graph_offset");
	var ok = true;
	var draw_ok = document.getElementById("drawgraph").checked;
	
	deleteSVG();
	
	lambda = parseFloat(document.getElementById("lambda").value);
	mu = parseFloat(document.getElementById("mu").value);
	k = parseInt(document.getElementById("k").value, 10);
	count_states = parseInt(document.getElementById("graph_nbstates").value, 10);
	first_state = parseInt(document.getElementById("graph_offset").value, 10);
	
	// verification des parametres
	if (isNaN(lambda) || lambda <= 0) {
		ok = false;
		elmt_lambda.style.color = "red";
	} else
		elmt_lambda.style.color = "black";
	elmt_lambda.value = lambda;
	
	if (isNaN(mu) || mu <= 0) {
		ok = false;
		elmt_mu.style.color = "red";
	} else
		elmt_mu.style.color = "black";
	elmt_mu.value = mu;
	
	if (isNaN(k) || k <= 0) {
		ok = false;
		elmt_k.style.color = "red";
	} else
		elmt_k.style.color = "black";
	elmt_k.value = k;
	
	if (isNaN(count_states) || count_states <= 0) {
		draw_ok = false;
		elmt_count_states.style.color = "red";
	} else
		elmt_count_states.style.color = "black";
	elmt_count_states.value = count_states;
	
	if (isNaN(first_state) || first_state < 0) {
		draw_ok = false;
		elmt_first_state.style.color = "red";
	} else
		elmt_first_state.style.color = "black";
	elmt_first_state.value = first_state;
	
	if (!ok) {
		show_results("red", NaN, NaN, NaN, NaN, NaN, NaN, NaN);
		return;
	}
	
	// pas de vérification de rho
	var rho = lambda / mu;
	
	var q0 = rho == 1.0 ? 1 / (k+1) : (1.0 - rho) / (1.0 - Math.pow(rho, k+1));
	var L = rho == 1.0 ? k / 2.0 : rho * (1 - (k+1) * Math.pow(rho, k) + k * Math.pow(rho, k+1)) / ((1 - rho) * (1 - Math.pow(rho, k+1)));
	var Lq = L - (1 - q0);
	var W = L / lambda;
	var Wq = Lq / lambda;
	var prob_no_wait = q0;
	
	show_results("black", rho, L, Lq, W, Wq, prob_no_wait, q0);
	
	// eventuel affichage du graphe
	if (draw_ok) {
		p.probabilities = createProbabilitiesK(count_states, first_state, rho, k);
		p.labels = createLabels(count_states, first_state);
		drawGraph(p);
	}
}

addEvent(document.getElementById("lambda"), "blur", update_stuff);
addEvent(document.getElementById("mu"), "blur", update_stuff);
addEvent(document.getElementById("k"), "blur", update_stuff);
addEvent(document.getElementById("drawgraph"), "click", update_stuff);
addEvent(document.getElementById("graph_nbstates"), "blur", update_stuff);
addEvent(document.getElementById("graph_offset"), "blur", update_stuff);

update_stuff();
