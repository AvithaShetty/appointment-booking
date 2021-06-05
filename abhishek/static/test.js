var  date, time, tests=[];
var pages = ["test", "slot", "confirmation", "payment"]
var timeTable = ["07:00 AM", "12:00 PM", "04:00 PM",
    "08:00 AM", "12:30 PM", "04:30 PM",
    "09:00 AM", "01:20 PM", "05:00 PM",
    "10:00 AM", "02:15 PM", "-",
    "11:00 AM", "03:30 PM", "-"]

var currentPageIndex = 0;
var selectedTime = -1;
var populatedDoctors = false;
var populatedTime = false;

function fillTarget(target, template, elem) {
    template_html = $(template).html()
    data = Mustache.to_html(template_html, elem)
    $(target).append(data);
}

function getContent(URL, target, template, callback, index) {
    function display(elem) {
        var selectedItemforID = elem[Object.keys(elem)[index]]
        elem.id_name = selectedItemforID.replaceAll(":", "_").replaceAll('.', '_').replaceAll("(","_").replaceAll(")","_").replaceAll("-","_").replaceAll(" ","_");

        fillTarget(target, template, elem)

        $("#" + elem.id_name).click((e) => {
            console.log(selectedItemforID);
            callback(e);
        });
    }

    function f(data) {
        console.log(data)
        data.results.forEach(display);
    }
    $.get(URL, f);
}

function getAddr(endpoint) {
    IP = "192.168.0.192"
    PORT = "5000"
    ADDR = "http://" + IP + ":" + PORT + endpoint
    return ADDR
}

function changePage(nextIndex) {
    console.log("CHANGING PAGE")
    var currentPage = pages[currentPageIndex]
    var nextPage = pages[nextIndex]
    var current_step = "#" + currentPage + "_step"
    var next_step = "#" + nextPage + "_step"
    var current_container = "#" + currentPage + "_container"
    var next_container = "#" + nextPage + "_container";

    if (nextIndex < currentPageIndex) {
        for (var i = nextIndex; i <= currentPageIndex; i++) {
            var page = pages[i];
            var page_step = "#" + page + "_step"
            var page_container = "#" + page + "_container"
            $(page_step).removeClass();
            $(page_step).addClass("link disabled step");
            $(page_container).css('display', 'none');

        }
        $(next_step).addClass("active");
        $(next_step).removeClass("disabled");
        $(next_container).css('display', 'block');
    }
    else if (nextIndex > currentPageIndex) {
        $(current_step).addClass("completed");
        $(current_step).removeClass("active");
        $(current_container).css('display', 'none');

        $(next_step).addClass("active");
        $(next_step).removeClass("disabled");
        $(next_container).css('display', 'block');
    }
    currentPageIndex = nextIndex;
}


// onClick functions
function getTest(dept_name) {
    department = dept_name;
    if (!populatedDoctors) {
        getContent(getAddr("/get_doctors/" + dept_name), "#doctor_target", "#doctor_template", getSlot, 2)
        populatedDoctors = true
    }
    changePage(1);
}

function populateTime(elem, index) {
    if (elem == "-") {
        $("#slot_target").append('<div class="column"></div>');
        return;
    }
    var a = {
        time: elem,
        id_name: elem.replaceAll(":", "").replaceAll(" ", "")
    };
    fillTarget("#slot_target", "#slot_template", a);

    $("#" + a.id_name).click((e) => {
        $(".buttony").removeClass("purple")
        $(e.target).addClass("purple");
        selectedTime = index;
        console.log(timeTable[index]);
    });
}

function getSlot(doct_name) {
    selectedTime = -1;
    $(".buttony").removeClass("purple")
    if (!populatedTime) {
        timeTable.forEach((elem, index) => populateTime(elem, index));
        populateTime = true;
    }
    if(tests.length == 0)
        showNotif("red", "Please select atleast one test")
    else
        changePage(1);
}
function getConfirmation(){
    changePage(3);
    $(".active").addClass("completed").siblings().addClass("disabled")
}

function updateFinalForm() {
    var str = "\n";
    var final = 0;
    tests.forEach((val, index)=>{
        var splits = val.split(",")
        var name = splits[0]
        var value = parseInt(splits[1].substring(3))
        str +=  name+", ";
        final += value;
    })
    $("#_formTime").text(date+" at "+time)

    $("#_formTest").text(str)
    $("#_formPrice").text("₹ "+final)
}

function getPayment() {
    function isTimeSelected() {
        return selectedTime != -1;
    }

    function isDateSelected() {
        return document.getElementById('_date').validity.valid
    }
    if (!isTimeSelected() && !isDateSelected())
        showNotif("red", "Please select appropriate date and time");
    else if (!isDateSelected())
        showNotif("red", "Please select a date");
    else if (!isTimeSelected())
        showNotif("red", "Please select a time");
    else {
        date = $('#_date').val();
        time = timeTable[selectedTime];
        console.log(date, time)
        changePage(2);
        updateFinalForm();
    }
}


function removeNotif() {
    $("#notification").fadeOut("slow");
}

function getInnerHTML(txt) {
    return txt + "<span class='dismiss'><a title='dismiss this notification'>X</a></span>"

}

function showNotif(color, message = null) {
    $("#notification").css('background-color', color);
    if (message != null) {
        $("#notification").fadeIn("slow").html(getInnerHTML(message));
        $(".dismiss").click(function () {
            $("#notification").fadeOut("slow");
        });
    }
    else
        $("#notification").fadeIn("slow")
    setTimeout(removeNotif, 8000)
}

function addTest(elem){
    $("#right_target").append(elem.target);
    $(elem.target).children()[1].remove()
    $(elem.target).css("background-color", "orange")
    $(elem.target).css("color", "white")
    $(elem.target).click(()=>{})
    tests.push($(elem.target).text().trim())
    console.log(tests)
}

getContent(getAddr("/get_test"), "#test_target", "#test_template", addTest, 0);
$(".ui.sticky").sticky()
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
var minDate = tomorrow.toISOString().split('T')[0];
document.getElementsByName("date")[0].setAttribute('min', minDate);
