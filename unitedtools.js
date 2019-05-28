var dataComp;
var list = [];
var autoDA = {};

function handleFileSelect(evt){
    var file = evt.target.files[0];
//	var result = extractData(file);
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
        dataComp = results;
        }
    });
}

function dataList(item){
    return list.push(item.cognome);
}

function createList(item){
    $("#selectDA").append("<option value='"+item+"'>"+item+"</option>");
}

function autoList() {
    var i;
    for (i = 0; i < dataComp.data.length; i++) {
        autoDA[dataComp.data[i].cognome] = null;
    };
}

function daList(){
    if ( $("#selectDA").length){
        $("#datalist").empty();
    } else {
        list = [];
        dataComp.data.forEach(dataList);
        list.sort();
        $("#dalist").append("<select multiple id='selectDA' name='selectDA'><option value='' disabled selected>Lista Driver</option></select>");
        $("#wavelist").append("<select id='wave' name='wave'><option value='wave1'>Wave 1</option><option value='wave2'>Wave 2</option><option value='wave3'>Wave 3</option><option value='wave4'>Wave 4</option><option value='wave5'>Wave 5</option><option value='wave6'>Wave 6</option></select>");
        $("#addDA").append("<a onclick='createDA()' class='btn'>Aggiungi</a>");
        $("#search").append("<div class='row'><div class='input-field col s12'><i class='material-icons prefix'>textsms</i><input type='text' id='autocomplete-input' class='autocomplete'><label for='autocomplete-input'>Cerca Driver</label></div></div>");
        $("#tabsDA").append("<ul id ='tabs-swipe-demo' class='tabs'><li class='tab col s6'><a href='#test1'>Wave Driver</a></li><li class='tab col s6'><a class='active' href='#test2'>Cerca Driver</a></li></ul>");
        list.forEach(createList);
        autoList();
        $('.tabs').tabs();
        $("select").formSelect();
        $('input.autocomplete').autocomplete({data: autoDA,});
        $("#load").hide();
        $('input.autocomplete').change(searchDA);
    }
}

function deleteDA(item) {
    $("#"+item).remove();
    $("#dalist option[value="+item+"]").removeAttr("disabled");
    $("#dalist option[value="+item+"]").removeAttr("selected");
    $("select").formSelect();
}

function searchDA() {
    var da = $('input.autocomplete').val();
    var t = finder(da);
    $("#resultSearch").empty();
    if (t !== undefined) {
        $("#resultSearch").append("<p id=\'search-"+da+"\'><h5>"+da+"</h5></p>");
        $("#search-"+da).qrcode({text: t, render: "canvas", width: 100, height: 100});
    }
    $('input.autocomplete').val(null);
}

function searchPackage() {
    $("#resultSearch").empty();
    var da = $('input.autocomplete').val();
    var i;
    for (var i = 0; i < da.length; i++) {
        var t = finderPackage(da);
        if (t == "5/19/2019 21:00" || t == "5/19/2019 20:00") {
            $("#resultSearch").append("<p id=\'search-"+da+"\'><h5>"+da+"OK</h5></p>");
             $("#resultSearch").addClass("green");
        } else {
	    $("#resultSearch").append("<p id=\'search-"+da+"\'><h5>"+da+"</h5></p>");
            $("#resultSearch").addClass("red");
        }
    }
    $('input.autocomplete').val(null);
}

function finder(item) {
    var i;
    var t;
    for (var i = 0; i < dataComp.data["length"]; i++) {
        if (dataComp.data[i].cognome==item) {
            t = dataComp.data[i].badge;
        }
    }
    if (t == undefined) {
	return;
    }
    return t = t.toString();
}

function finderPackage(item) {
    var i;
    var t;
    for (var i = 0; i < dataComp.data["length"]; i++) {
        if (dataComp["data"][i]["Tracking Id"]==item) {
            t = dataComp["data"][i]["Estimated Arrival Date"];
        }
    }
    if (t == undefined) {
	return;
    }
    return t = t.toString();
}

function createDA(){
    var temp = $("#dalist select").val();
    var waveL = $("#wavelist select").val();
    var i;
    if ($("#waveLabel").length == 0) {
      $("#resultDA").append("<ul class='collapsible' id='waveLabel'></ul>");
    }
    if ($(".collapsible-header."+waveL).length == 0) {
      $('#waveLabel').append("<li><div class='collapsible-header "+waveL+"\'><h5>"+waveL+"</h5></div><div class='collapsible-body "+waveL+"\'></div></li>");
    }
    for (var i = 0; i < temp.length; i++) {
      var t = finder(temp[i]);
        $(".collapsible-body."+waveL).append("<div class='row card' id=\'"+temp[i]+"\'><div class='col s12 m4 card-content'>"+"<h5>"+temp[i]+"</h5>"+"<h5>"+waveL+"</h5>"+"</div><div id='qrcode-"+temp[i]+"\' class='col s12 m6 qrcode card-content'></div><div class='col s12 m2 card-content' id=\'"+temp[i]+"\'><a onclick='deleteDA(\""+temp[i]+"\")' class='btn'>Elimina</a></div></row>");
      $("#qrcode-"+temp[i]).qrcode({text: t, render: "canvas", width: 90, height: 90});
    }
     $("#dalist option:selected").attr('disabled','disabled');
     $("select").formSelect();
     $('.collapsible').collapsible();
}