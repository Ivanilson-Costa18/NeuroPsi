var response

const sendCode = async () => {
    response = {}
    try {
        response = await $.ajax({
            url: 'api/authentication/verify/'+$('#email').val(),
            method: 'post',
            dataType: 'json'
        })
        $("#emailError").hide()
        alert('Please check your email')
    } catch (error) {
        $("#emailError").show()
        console.log(error)
        return error
    }
}


const submit = async () => {
    let valid, account

    verify = $('#code').val()
    console.log(verify +' '+ response.code);
    if(verify == response.code){
        $("#codeError").hide()
        valid = true
    } else {
        $("#codeError").show()
        valid = false
    }

    if(valid){
        try {
            account = await $.ajax({
                url: 'api/authentication/register',
                method: 'post',
                dataType: 'json',
                data: {
                    "name":$('#fname').val() + " " + $('#lname').val(),
                    "email":$('#email').val(),
                    "password": $('#password').val(),
                    "tel": $('#phone').val(),
                    "type": $("input[type='radio'][name='class']:checked").val()
                }
            })
            console.log(account);
            $("#emailError2").hide()
            alert('Account creation sucssesful')
            window.location = "index.html"
        } catch (error) {
            $('#emailError2').html(error.responseJSON.message)
            $("#emailError2").show()
            console.log(error)
            return error
        }
    }
}
    
