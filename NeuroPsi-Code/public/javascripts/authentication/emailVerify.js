const verifyEmail = async () => {
    response = {}
    try {
        response = await $.ajax({
            url: 'api/authentication/verify/'+$('#email').val(),
            method: 'post',
            dataType: 'json'
        })
    } catch (error) {
        console.log(error)
        return error
    }
    verify = $('#code').val()
    if(verify == response.code){
        return true
    } else {
        return false
    }
}