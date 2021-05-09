window.onload = async function(){
    let patient = await $.ajax({
        url: 'api/patients/1',
        method: 'get',
        dataType: 'json'
    }) 

    let tests = await $.ajax({
        url: 'api/patients/1/tests',
        method: 'get',
        dataType: 'json'
    })

    showPatient(patient)
    showTests(tests)
}

const showPatient = async patient => {
    let elem = document.getElementById('userInfo');
    let html = '<p>'+JSON.stringify(patient[0])+'</p>'
    elem.innerHTML = html
}

const showTests = async tests => {
    let elem = document.getElementById('testsList')
    let html = ""
    for(let test of tests){
        html += '<p onclick="solveTest()">'+JSON.stringify(test)+'</p>'
    }
    elem.innerHTML = html
}

const solveTest = () => {
    window.location = 'testPage.html'
}