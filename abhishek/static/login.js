// Animation Starts
var _CONTENT = ["Booking appointments", "Medical tests", "Medicines"];
var _PART = 0;
var _PART_INDEX = 0;
var _INTERVAL_VAL;
var _ELEMENT = document.querySelector("#text");
var _CURSOR = document.querySelector("#cursor");
function Type() {
    var text = _CONTENT[_PART].substring(0, _PART_INDEX + 1);
    _ELEMENT.innerHTML = text;
    _PART_INDEX++;
    if (text === _CONTENT[_PART]) {
        _CURSOR.style.display = 'none';

        clearInterval(_INTERVAL_VAL);
        setTimeout(function () {
            _INTERVAL_VAL = setInterval(Delete, 50);
        }, 1000);
    }
}

function Delete() {
    var text = _CONTENT[_PART].substring(0, _PART_INDEX - 1);
    _ELEMENT.innerHTML = text;
    _PART_INDEX--;

    if (text === '') {
        clearInterval(_INTERVAL_VAL);
        if (_PART == (_CONTENT.length - 1))
            _PART = 0;
        else
            _PART++;

        _PART_INDEX = 0;
        setTimeout(function () {
            _CURSOR.style.display = 'inline-block';
            _INTERVAL_VAL = setInterval(Type, 100);
        }, 200);
    }
}
// Animation ends


function getAddr(endpoint) {
    IP = "192.168.0.192"
    PORT = "5000"
    ADDR = "http://" + IP + ":" + PORT + endpoint
    return ADDR
}

function Register(){
    var addr = getAddr("/register")
    var data = $('#signupForm').serializeArray();
    var email = $('input[name=ID]').val();
    var name = $("input[name=first-name]").val()+ $("input[name=first-name]").val()
    var redirect_url, message, code;

    function updateData(data, status , xhr){
        if(status=="success"){
            console.log(data)
            code = data.results[0].code;
            message = data.results[0].message;
            if (code == 1){
                redirect_url = data.redirect_url;
                console.log('Registered Successfully!')
                setCookie("patientLogged",email,7)
                setCookie(email,[Math.floor(Math.random() * 100), name],7)
                showNotif("green", "Registered Successfully! Please wait while we redirect you")
                showNotif("green", "Login Successful! Please wait while we redirect you")
                setTimeout(() => {window.location.href = redirect_url;}, 4000)
            }
            else{
                showNotif("red", message);
            }
        }
    }
    $.post(addr, data, (data, status, xhr) => {updateData(data,status, xhr)}, 'json')
}

function Login() {
    var addr = getAddr("/validate")
    var dataArray = $('#loginForm').serializeArray();
    var email = $('input[name=username]').val();
    var redirect_url, message, code;

    function updateData(data, status , xhr){
        if(status=="success"){
            console.log(data)
            code = data.results[0].code;
            message = data.results[0].message;
            if (code == 1){
                redirect_url = data.redirect_url;
                console.log('Login Successful!')
                showNotif("green", "Login Successful! Please wait while we redirect you")
                setTimeout(() => {window.location.href = redirect_url;}, 4000)
                setCookie("patientLogged",email,7)
            }
            else{
                showNotif("red", message);
            }
        }
    }
    
    $.post(addr, dataArray, (data, status, xhr) => {updateData(data,status, xhr)}, 'json')
    
}

function removeNotif(){
    $("#notification").fadeOut("slow");
}

function getInnerHTML(txt){
    return txt + "<span class='dismiss'><a title='dismiss this notification'>X</a></span>"
}

function showNotif(color, message = null){
    $("#notification").css('background-color', color);
    if (message != null){
        $("#notification").fadeIn("slow").html(getInnerHTML(message));
        $(".dismiss").click(function () {
            $("#notification").fadeOut("slow");
        });
    }
    else
        $("#notification").fadeIn("slow") 
    setTimeout(removeNotif, 8000)
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function main() {
    //Setting up the typewrite effect
    _INTERVAL_VAL = setInterval(Type, 100);

    // Adding an onclick listener to the notification button
    $(".dismiss").click(function () {
        $("#notification").fadeOut("slow");
    });

    // Adding an onclick listener to the signup button
    $('#register').click(function () {
        $('.ui.modal').modal('show');
    });
    // Form validation for the signup page
    $(document).ready(function () {
        $('.ui.form').form({
            fields: {
                registerEmail: {
                    identifier: 'registerEmail',
                    rules: [{
                        type: 'email',
                        prompt: 'Please enter a valid email address.'
                    }]
                },
                registerPassword: {
                    identifier: 'registerPassword',
                    rules: [
                        {
                            type: 'minLength[6]',
                            prompt: "Password should be minimum 6 digits"
                        }]
                },
                registerPasswordVerify: {
                    identifier: 'registerPasswordVerify',
                    rules: [{
                        type: 'match[registerPassword]',
                        prompt: 'Your passwords do not match.'
                    }]
                }
            },
        });
    });
}


main()