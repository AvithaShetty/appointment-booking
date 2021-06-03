var department, doctor, date, time;

function getContent(URL, target, template, callback, index){
    function display(elem) {
        var selectedItemforID = elem[Object.keys(elem)[index]]
        elem.id_name = selectedItemforID.replaceAll(" ","_").replaceAll('.','_');
        
        template_html = $(template).html()
        data = Mustache.to_html(template_html, elem)
        $(target).append(data);
        $("#"+elem.id_name).click(()=>{
            console.log(selectedItemforID);
            callback(selectedItemforID);
        });
    }

    function f(data) {
        console.log(data)
        data.results.forEach(display);
    }    
    $.get(URL, f);
}

function getAddr(endpoint){
    IP = "192.168.0.192"
    PORT = "5000" 
    ADDR = "http://" + IP+ ":" +PORT + endpoint
    return ADDR
}

function changePage(curr, next){
    var current_step = "#"+curr+"_step"
    var next_step = "#"+next+"_step"
    var current_container = "#"+curr+"_container"
    var next_container = "#"+next+"_container"
    $(current_step).addClass("completed");
    $(current_step).removeClass("active");
    $(current_container).css('display','none');

    $(next_step).addClass("active");
    $(next_step).removeClass("disabled");
    $(next_container).css('display','block');
}


// onClick functions
function getDoctors(dept_name){
    department = dept_name;
    getContent(getAddr("/get_doctors/"+dept_name), "#doctor_target", "#doctor_template", () => {},2 )
    changePage("department","doctor")
}


getContent(getAddr("/get_departments"), "#department_target", "#department_template", getDoctors, 0);
