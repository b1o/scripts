var vs = document.getElementById("javax.faces.ViewState").value;
var globalData = [];


var links = $(".skz a");
var parsed = [];
var i = 0
var sum = 0

function doAjax(index, vs) {
        $.ajax({
                url: "http://www.schulen-online.at/sol/oeff_suche_schulen.jsf",
                method: "POST",
                data: {
                    "javax.faces.ViewState": vs,
                    "j_id_23_SUBMIT": 1,
                    "j_id_23:_idcl": "j_id_23:j_id_25:"+index+":j_id_29"
                }

            }).onloadend = function() {
                    console.log(this.status)
                    if(this.status == 200) {
                        console.log(this)
                        $("html").html(this.responseText)
                        parse(this.responseText)
                        vs = document.getElementById("javax.faces.ViewState").value;

                        console.log("sending with vs: " + vs + " and id: " + index)
                        doAjax(i, vs);
                        if(i > 49) {
                            
                            sum += i-1
                            i = 0;
                            if(sum >= 6130) {
                                
                            }
                            nextPage(vs)
                        }
                        i++
                        
                    } else {
                        saveToFile()
                    }
                }
}

function nextPage(vs) {
    console.log("sending with vs: " + vs + " for next page")
           return $.ajax({
            url: "http://www.schulen-online.at/sol/oeff_suche_schulen.jsf",
            method: "POST",
            data: {
                "javax.faces.ViewState": vs,
                "j_id_23_SUBMIT": 1,
                "j_id_23:_idcl": "j_id_23:next"
            }
            
        }).onloadend = function() {
            if(this.status == 200) {
                        console.log(this)
                        $("html").html(this.responseText)
                        vs = document.getElementById("javax.faces.ViewState").value;

                        doAjax(i, vs)
                    }
        }
        }


var csv = []
function parse(data) {
    var current = [];
    var a = $(data).find("#tabs-3 .rahmen_tab .anzeigefeld").each(function(index, element) {
        var first = $(this).find(".anzeigefeld_links").find("div").each(function() {
            var t = $(this).text().trim()
            if(t.length != 0) {
                current.push(t)
            }else {
                current.push("NULL")
            }
            
        });
        var second = $(this).find(".anzeigefeld_rechts").find("div").each(function() {
            var t = $(this).text().trim()
            if(t.length != 0) {
                current.push(t)
            }else {
                current.push("NULL")
            }
        });
    })
        csv.push(current)
    
}

function saveToFile() {
    console.log("saving to file")
    var final = "";
    csv.forEach(function(data) {
        var text = data.join();
        final += text;
        final += "\r\n"
    })
    var uriContent = "data:application/octet-stream," + encodeURIComponent(final);
    newWindow = window.open(uriContent, 'data');
}
