var department, doctor, date, time;
var pages = ["department","doctor","slot", "confirmation", "payment"]
var currentIndex = 0;
var loaded = false;

function getContent(URL, target, template, callback, index){
    function display(elem) {
        var selectedItemforID = elem[Object.keys(elem)[index]]
        elem.id_name = selectedItemforID.replaceAll(" ","_").replaceAll('.','_');
        
        template_html = $(template).html()
        data = Mustache.to_html(template_html, elem)
        $(target).append(data);
        $("#"+elem.id_name).click( ()=>{
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

function changePage(nextIndex){
    console.log("CHANGING PAGE")
    var currentPage = pages[currentIndex]
    var nextPage = pages[nextIndex]
    var current_step = "#"+ currentPage +"_step"
    var next_step = "#"+nextPage+"_step"
    var current_container = "#"+currentPage+"_container"
    var next_container = "#"+nextPage+"_container";

    if(nextIndex < currentIndex){
        for (var i=nextIndex; i<=currentIndex;i++){
            var page = pages[i];
            var page_step = "#"+ page +"_step"
            var page_container = "#"+page+"_container"
            $(page_step).removeClass();
            $(page_step).addClass("link disabled step");
            $(page_container).css('display','none');

        }
        $(next_step).addClass("active");
        $(next_step).removeClass("disabled");
        $(next_container).css('display','block');
    }
    else if(nextIndex > currentIndex){
        $(current_step).addClass("completed");
        $(current_step).removeClass("active");
        $(current_container).css('display','none');
    
        $(next_step).addClass("active");
        $(next_step).removeClass("disabled");
        $(next_container).css('display','block');
    }
    currentIndex = nextIndex;
}


// onClick functions
function getDoctors(dept_name){
    department = dept_name;
    if (!loaded){
        getContent(getAddr("/get_doctors/"+dept_name), "#doctor_target", "#doctor_template", getSlot, 2)
        loaded = true
    }
    changePage(1);
}

function getSlot(doct_name){
    doctor = doct_name;
    changePage(2);
}

getContent(getAddr("/get_departments"), "#department_target", "#department_template", getDoctors, 0);

