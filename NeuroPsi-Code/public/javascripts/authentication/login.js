const login = async () => {

    $('#error').hide()
    try {
        let user = await $.ajax({
            url: '/api/authentication/login',
            method: 'post',
            dataType: 'json',
            data: {
                "email": $('#username').val(),
                "password": $('#password').val()
            }
        })
        if(user.id_doctor){
            let patient = {"id": user.id, "id_user": user.id_user, "id_doctor": user.id_doctor}
            sessionStorage.setItem('id',JSON.stringify(patient))
        } else {
            sessionStorage.setItem('id',JSON.stringify({"id": user.id, "id_user": user.id_user}))
        }
        window.location = user.redirect
    } catch (error) {
        console.log(error)
        $("#error").css("display", "block")
    }
}