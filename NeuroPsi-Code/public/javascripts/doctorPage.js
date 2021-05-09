window.onload = async function(){
    let doctor = await $.ajax({
        url: 'api/doctors/1',
        method: 'get',
        dataType: 'json'
    })

    let patients = await $.ajax({
        url: 'api/doctors/1/patients',
        method: 'get',
        dataType: 'json'
    })

    showDoctor(doctor)
    showPatients(patients)
}

const showDoctor = doctor => {
    let elem = document.getElementById('userInfo')
    let html = '<p>'+JSON.stringify(doctor)+'</p>'
    elem.innerHTML = html
}

const showPatients = patients => {
    let elem = document.getElementById('patientsList')
    let html = ""
    for(let patient of patients){
        html += '<p onclick="assignTest(1)">'+JSON.stringify(patient)+'</p>'
    }
    elem.innerHTML = html
}

const assignTest = async id_patient => {
    let test = await $.ajax({
        url: 'api/tests',
        method: 'post',
        dataType: 'json',
        data: {
            "patientID": id_patient,
            "testType": 1
        }
    })
}