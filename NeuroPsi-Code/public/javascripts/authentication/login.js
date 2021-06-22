const login = async () => {
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
        if(user.id){
            sessionStorage.setItem('id',user.id)
            if(user.type == "doctor"){
                window.location = "doctorPage.html"
            }else{
                window.location = "patientPage.html"
            }
        }
    } catch (error) {
        console.log(error)
    }
}