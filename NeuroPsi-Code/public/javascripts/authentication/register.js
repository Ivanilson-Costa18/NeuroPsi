var response

const next = elem => {
    elem.classList.remove("activeSection")
    document.getElementById('circle-'+elem.id).classList.remove('active');
    document.getElementById(Number(elem.id)+1).classList.add("activeSection"); 
    document.getElementById('circle-'+(Number(elem.id)+1)).classList.add('active');
}


const changeSection = () => {
    let verified = false
    let elem = document.getElementsByClassName('activeSection')[0];
    switch(Number(elem.id)){
        case 1:
            let valid1 = true
            if(!$('#fname').val()) {$('#fnameError').show(); valid1 = false} else {$('#fnameError').hide()} 
            if(!$('#lname').val()) {$('#lnameError').show(); valid1 = false} else {$('#lnameError').hide()}
            if(!$("input[type='radio'][name='class']:checked").val()){$('#classError').show(); valid1 = false} else {$('#classError').hide()}
            valid1 ? next(elem) : null
            break
        case 2:
            let valid2 = true
            if(!$('#email').val()) {$('#emailError').show(); valid2 = false} else {$('#emailError').hide()}
            if(!$('#password').val()) {$('#passError').show(); valid2 = false} else {$('#passwordError').hide()}
            if(valid2) {next(elem); verified = true}
            break
    }

    if(Number(elem.id) == 2 && verified){
        $('#next').css({display: "none"});
        $('#submit').css({display: "block"});
        response = verifyEmail()
    }
}


const submit = async () => {
    if(response){
        try {
            await $.ajax({
                url: 'api/authentication/register',
                method: 'post',
                dataType: 'json',
                data: {
                    "name":$('#fname').val() + " " + $('#lname').val(),
                    "email":$('#email').val(),
                    "password": $('#password').val(),
                    "tel": "999999999999",
                    "type": $("input[type='radio'][name='class']:checked").val()
                }
            })
        } catch (error) {
            console.log(error)
            return error
        }
    } else {
        return 'ERROR'
    }
}