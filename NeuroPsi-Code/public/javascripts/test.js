window.onload = async () => {
    let test = await $.ajax({
        url: '/api/tests',
        method: 'get',
        dataType: 'json'
    })

    showTests(test)
}

const showTests = tests => {
    let element = document.getElementById('test')
    let html = ""
    for (test of tests){
        html += "<p>"+test.type_Test+"</p>"
    }
    element.innerHTML = html 
}