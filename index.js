var center = SMap.Coords.fromWGS84(15.8, 49.7); // GPS na vycentrovani
var m = new SMap(JAK.gel("m"), center, 8); // vycentrovat s priblizenim 8
var query = [JAK.gel("query1").value, JAK.gel("query2").value];
var souradnice = [];
var i = 0;
m.addControl(new SMap.Control.Sync()); // pohyb mapy
m.addDefaultLayer(SMap.DEF_TURIST).enable(); // Turistická
m.addDefaultControls(); // zakladni UI
//var sync = new SMap.Control.Sync({bottomSpace:10});
//m.addControl(sync);

var form = JAK.gel("form");
JAK.Events.addListener(form, "submit", geokoduj); /* Při odeslání formuláře spustit geokódování */

function geokoduj(e, elm) {  /* Voláno při odeslání */
    
    for (j = 0; j <= query.length-1; j++) {
        JAK.Events.cancelDef(e); /* Zamezit odeslání formuláře */
        new SMap.Geocoder(query[j], odpoved);
    }
}

function odpoved(geocoder) { /* Odpověď */
    if (i == query.length) {
        souradnice = [];
        i = 0;
    }
    if (!geocoder.getResults()[0].results.length) {
        alert("Tohle neznáme.");
        return;
    }

    var vysledky = geocoder.getResults()[0].results;
    var data = [];
    var item = vysledky.shift();
    data.push(item.coords.toWGS84(2).reverse().join(", "));
    
    souradnice[i] = data[0].split(",");
    for(j = 0; j <= 1; j++) {
        var b = [];
        var c = 0;
        souradnice[i][j] = souradnice[i][j].replace(/[NE"]/gi ,'');
        b = souradnice[i][j].split(/[°']/);
        
        for(k = 0; k <= 2; k++){
            c += b[k]/Math.pow(60, k);
        }
        souradnice[i][j] = c;
    }
    
    i++;
    console.log(souradnice);
    prumer(souradnice);
}




function prumer(x){
    if (i == query.length) {
        var y = [0, 0];
        var ql = query.length;
        for (q = 0; q <= ql-1; q++) {
            y[0] += x[q][0];
            y[1] += x[q][1];
        }
        window.open('https://mapy.cz/zakladni?q='+y[0]/ql + "N, " + y[1]/ql + "E", '_blank')
    }
    location.reload;
}
   

function fce_add(element){
    var form = document.getElementById("form");
    // Create a new HTML tag of type "input"
    var field = document.createElement("input");
    // The value filled in the form will be stored in an array
    field.name = "query[]";
    field.type = "text";
    
    var rem = document.createElement("input");

    // We create a new element of type "p" and we insert the field inside.
    var bloc = document.createElement("p");
    bloc.appendChild(field);
    form.insertBefore(add, element);
    form.insertBefore(rem, element);
    form.insertBefore(bloc, element);
}

function fce_remove(element){
    var form = document.getElementById("form");
    // Remove the field
    form.removeChild(element.nextSibling);
}


function pridat() {
    n = query.length+1;
    q = document.getElementById("query2").value;
    label = document.createElement("label");
    inp = document.createElement("input");
    inp.innerHTML.value = q;
    inp.innerHTML.id = "query"+n;
    tr.appendChild(td1);
    tr.appendChild(td2);          
    document.getElementById("tab1").appendChild(tr);

    query += JAK.gel("query"+n).value
}



function pridat() {
    txt1 = document.getElementById("t1").value;
    txt2 = document.getElementById("t2").value;
    tr = document.createElement("tr");
    td1 = document.createElement("td");
    td1.innerHTML = txt1;
    td2 = document.createElement("td");
    td2.innerHTML = txt2;
    tr.appendChild(td1);
    tr.appendChild(td2);          
    document.getElementById("tab1").appendChild(tr);;
}
function odebrat() {
    tbl = document.getElementById("tab1");
    lc = tbl.lastElementChild;
    if(lc)
      tbl.removeChild(lc);
}



/*
function prevod(x) {
    var y = [];
    y[i] = x[0].split(",");
    for(j = 0; j <= 1; j++) {
        var b = [];
        var c = 0;
        y[i][j] = y[i][j].replace(/[NE"]/gi ,'');
        b = y[i][j].split(/[°']/);
        
        for(k = 0; k <= 2; k++){
            c += b[k]/Math.pow(60, k);
        }
        y[i][j] = c;
    }
    return y;
}
*/
