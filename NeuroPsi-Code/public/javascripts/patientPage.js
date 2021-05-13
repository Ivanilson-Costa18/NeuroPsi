var patient_id = 1
window.onload = async function(){
    let patient = await $.ajax({
        url: 'api/patients/'+patient_id,
        method: 'get',
        dataType: 'json'
    }) 

    let tests = await $.ajax({
        url: 'api/patients/'+patient_id+'/tests',
        method: 'get',
        dataType: 'json'
    })

    showPatient(patient[0])
    showTests(tests)
}

const showPatient = async patient => {
    document.getElementById('patient').innerHTML = patient.name_User
}

const showTests = async tests => {
    let elem = document.getElementById('list-content')
    let html = ""

    if(tests.length == 0){
        document.getElementById('empty-container').style.display = "block" 
        elem.innerHTML += '<tr class="blank"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'.repeat(10)
    }

    for(let test of tests){
        html += '<tr class="line">'+
                    '<td>'+ test.ID_Test_Patient +'</td>'+
                    '<td>'+ test.type_Test +'</td>'+
                    '<td>'+ test.Date_Test_Patient.slice(0,test.Date_Test_Patient.indexOf("T")).split("-").reverse().join("/") +'</td>'+
                    '<td><button class="solveTestBtn" onclick="solveTest('+test.ID_Test_Patient+')">Start Test</button></td>'+
                '</tr>'
    }
    
    elem.innerHTML += html
    tests.length < 10 ? elem.innerHTML += '<tr class="blank"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'.repeat(10-tests.length) : elem.innerHTML
}

const solveTest = (id_test) => {
    sessionStorage.setItem("id_test", id_test)
    window.location = 'testPage.html'
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