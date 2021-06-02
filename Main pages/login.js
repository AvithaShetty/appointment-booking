// Animation Starts
var _CONTENT = [
    "Booking appointments",
    "Medical tests",
    "Medicines"
];
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
_INTERVAL_VAL = setInterval(Type, 100);

// Animation ends


$('#register').click(function () {
    $('.ui.modal').modal('show');
});


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
