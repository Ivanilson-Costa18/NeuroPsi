var patients

window.onload = async function(){
    let doctor = await $.ajax({
        url: 'api/doctors/1',
        method: 'get',
        dataType: 'json'
    })

    patients = await $.ajax({
        url: 'api/doctors/1/patients',
        method: 'get',
        dataType: 'json'
    })

    let tests = await $.ajax({
        url: 'api/doctors/1/patients/tests',
        method: 'get',
        dataType: 'json'
    })

    showDoctor(doctor)
    showPatients(patients)
    showTests(tests)
}

const showDoctor = doctor => {
    let elem = document.getElementById('doctor')
    let html = doctor.name_User
    elem.innerHTML = html
}

const showPatients = patients => {
    let elem = document.getElementById('list-content')
    let html = ""
    for(let patient of patients){
        html += '<tr id='+patient.ID_Patient+' class="line" onclick="displayInfo('+patient.ID_Patient+')">'+
                    '<td>'+ patient.ID_Patient +'</td>'+
                    '<td>'+ patient.name_User +'</td>'+
                    '<td>'+ patient.email_User +'</td>'+
                    '<td>'+ patient.tel_User +'</td>'+
                '</tr>'
    }
    elem.innerHTML +=  html 
    patients.length < 10 ? elem.innerHTML += '<tr class="blank"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'.repeat(10-patients.length) : elem.innerHTML
}

const showTests = tests =>{
    let elem = document.getElementById('testList-content')
    let html = ""
    for(let test of tests){
        html += '<tr class="test-line">'+
                    '<td>'+ test.ID_Patient +'</td>'+
                    '<td>'+ test.name_User +'</td>'+
                    '<td>'+ test.type_Test +'</td>'+
                    '<td>'+ test.Test_State.toUpperCase() +'</td>';
        html += test.Test_State == "unsolved" ? '<td><button class="viewTestBtn unsolved">Not Available</button></td></tr>' : '<td><button class="viewTestBtn" onclick="viewTest('+test.ID_Test_Patient+')">View Test</button></td></tr>';
                
    }
    elem.innerHTML +=  html
    tests.length < 10 ? elem.innerHTML += '<tr class="blank"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'.repeat(10-tests.length) : 0
}

const displayInfo = ID_Patient => {
    let elem  = document.getElementById('patientInfo')
    elem.innerHTML = ""
    let html = ""
    for(let patient of patients){
        if (patient.ID_Patient == ID_Patient) {
            html  = '<i class="fas fa-user" id="icon"></i>'+
                    '<p style="font-size: 1.1rem; text-align: center;"><b>'+patient.name_User+'</b></p>'+
                    '<button id="assignTestBtn" onclick="assignTest('+ID_Patient+')">Assign Test</button>'
        }
    }
    elem.innerHTML += html 
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

const viewTest = test_id => {
    sessionStorage.setItem("test_id",test_id)
    window.location  = "./testViewPage.html"
}

function openTab(evt, tabName) {
    var i,tablinks,x;
    x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";  
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("select", "");
    }
    document.getElementById(tabName).style.display = "";
    evt.currentTarget.className += " select";
}
