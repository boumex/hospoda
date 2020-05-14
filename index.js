var center = SMap.Coords.fromWGS84(15.8, 49.7); // GPS na vycentrovani
var m = new SMap(JAK.gel("m"), center, 8); // vycentrovat s priblizenim 8
var sync = new SMap.Control.Sync({bottomSpace:10}); // tohle zaruci prizpusobeni vysky mapy v okne
var query = [JAK.gel("query1").value, JAK.gel("query2").value];
var souradnice = [];
var i = 0; // indikator jestli probehly vsechny souradnice
m.addControl(new SMap.Control.Sync()); // pohyb mapy
m.addDefaultLayer(SMap.DEF_TURIST).enable(); // Turistická
m.addDefaultControls(); // zakladni UI
m.addControl(sync); // pridani prizpusobeni vysky mapy


var form = JAK.gel("form");
JAK.Events.addListener(form, "submit", geokoduj); /* Při odeslání formuláře spustit geokódování */

function geokoduj(e, elm) {  /* Voláno při odeslání */

    console.log(query.length); // TADY loguju délku query jestli je správně dlouhá

    for (j = 0; j <= query.length-1; j++) {
        JAK.Events.cancelDef(e); /* Zamezit odeslání formuláře */
        new SMap.Geocoder(JAK.gel("query"+(1+j)).value, odpoved);
    }
}

function odpoved(geocoder) { /* Odpověď */
    if (i >= query.length) {
        souradnice = [];
        i = 0;
    }
    if (!geocoder.getResults()[0].results.length) {
        alert("Tohle neznáme.");
        return;
    }

    // posilam adresu serveru mapy
    var vysledky = geocoder.getResults()[0].results;
    var data = [];
    var item = vysledky.shift();
    data.push(item.coords.toWGS84(2).reverse().join(", "));
    
    // preformatovani souradnic
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
    prumer(souradnice);
}

function prumer(x){ /* Prumer souradnic */
    if (i == query.length) {
        var y = [0, 0];
        var ql = query.length;
        for (q = 0; q <= ql-1; q++) {
            y[0] += x[q][0];
            y[1] += x[q][1];
        }
        //console.log('https://mapy.cz/zakladni?q='+"hospoda "+y[0]/ql + "N, " + y[1]/ql + "E");
        window.open('https://mapy.cz/zakladni?q='+"hospoda "+y[0]/ql + "N, " + y[1]/ql + "E", '_blank')
    }
    location.reload;
}


function pridat() { /* Pridat dalsi adresu */
    n = query.length+1;
    var p = document.getElementById("adresy");
    var label = document.createElement("label");
   
    label.innerHTML = n+". adresa: ";

    p.appendChild(label);
    parek = document.createElement("input");
    label.appendChild(parek);
    parek.setAttribute("id", "query"+n);
    parek.setAttribute("type", "text");
    parek.setAttribute("value", "");

    newLine = document.createElement("br");
    newLine2 = document.createElement("br");
    label.appendChild(newLine);
    label.appendChild(newLine2);

    query[n-1] = JAK.gel("query"+n).value;
}


function odebrat() { /* Odebrat posledn iadresu */
    n = query.length;
    if(n > 2) {
        p = document.getElementById("adresy");
        lastLabel = p.lastElementChild;
        console.log(lastLabel.innerHTML);
        lastInput = document.getElementById("query"+n);
        lastLabel.removeChild(lastInput);
        lastLabel.innerHTML = "";
        p.removeChild(lastLabel);
        query.pop();
    }
}


/*
POZNAMKY K HTML

*/

/*
POZNAMKY K JAVASCRIPTU A VYPOCTUM
- pro vypocet optimalni pozice by se oplatilo vyuzit Centroid polygonu, viz wiki
*/
