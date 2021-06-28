var patient_obj = JSON.parse(sessionStorage.getItem('id'))
var patient

window.onload = async function(){
    //Get patient's info
    patient = await $.ajax({
        url: 'api/patients/'+patient_obj.id,
        method: 'get',
        dataType: 'json'
    }) 

    //Get patient's tests
    let tests = await $.ajax({
        url: 'api/patients/'+patient_obj.id+'/tests',
        method: 'get',
        dataType: 'json'
    })

    showPatient(patient)
    showTests(tests)
    showMessagesRooms(patient_obj.id_doctor)
}

//Display patient's info
const showPatient = async patient => {
    document.getElementById('patient').innerHTML = 'Hi, ' + patient.name_User.split(' ')[0]
}

//Display tests
const showTests = async tests => {
    let elem = document.getElementById('list-content')
    let html = ""

    if(tests.length == 0){
        document.getElementById('empty-container').style.display = "block" 
    }

    for(let test of tests){
        html += '<tr class="line">'+
                    '<td>'+ test.ID_Test +'</td>'+
                    '<td>'+ test.name_Test_Type +'</td>'+
                    '<td>'+ test.Date_Test.slice(0,test.Date_Test.indexOf("T")).split("-").reverse().join("/") +'</td>'+
                    '<td><button class="solveTestBtn" onclick=\'solveTest('+test.ID_Test+',"'+test.name_Test_Type+'",'+test.Test_Configuration+')\'>Start Test</button></td>'+
                '</tr>'
    }
    
    elem.innerHTML += html
    tests.length < 10 ? elem.innerHTML += '<tr class="blank"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'.repeat(10-tests.length) : elem.innerHTML
}

const showMessagesRooms = async (doc_id) =>{
    let elem = document.getElementById('roomsList')
    let html = ""
    let doctor  = await $.ajax({
        url: 'api/users/'+doc_id,
        method: 'get',
        dataType: 'json'
    })
    
    let message = await $.ajax({
        url:'api/messages/'+doctor[0].ID_User,
        method:'get',
        dataType: 'json'
    })
    if(message.length == 0) message.push({Date_Time_Message: "",Content_Message: ""})

    html =  '<div class="room" id="room-'+doctor[0].ID_User+'" onclick=\'showmessages('+JSON.stringify(doctor[0])+')\'>'+
                '<div class="patient-icon">'+
                    '<i class="fas fa-user" id="icon-room"></i>'+
                '</div>'+
                '<div class="roomLastMessage">'+
                    '<p id="name" style="margin: 1% 0 0 0;">'+doctor[0].name_User+'</p>'+
                    '<p class="last-message" style="margin: 1% 0 0 0;">'+message[0].Content_Message+'</p>'+
                '</div>'+
                '<div class="time">'+message[0].Date_Time_Message.split('T')[0].split('.')[0].split('-').reverse().join('/')+'</div>'+
                '<span style="display: none;" id="notification-ball" class="circle"></span>'+
                '<div class="border-bottom"></div>'+                      
            '</div>'

    elem.innerHTML += html
}

const showmessages = async (doctor) =>{
    $('#room-'+doctor.ID_User).find(".circle").hide()
    $("#roomsList>div.opened").removeClass("opened");
    document.getElementById('chat-title').innerHTML = 'Chat with Dr. '+doctor.name_User
    $('#room-'+doctor.ID_User).addClass('opened')
    receiver_id = doctor.ID_User
    let elem = document.getElementById('messages')
    elem.innerHTML = ""
    let html = ""
    let messages = await $.ajax({
        url: 'api/messages/',
        method: 'post',
        dataType: 'json',
        data: {
            "sender": patient_obj.id_user,
            "receiver": receiver_id
        }
    })
    
    let initial_doc = doctor.name_User.split(' ')[0].charAt(0) + ' ' + doctor.name_User.split(' ')[1].charAt(0)
    let initial_pat = patient.name_User.split(' ')[0].charAt(0) + ' ' + patient.name_User.split(' ')[1].charAt(0)
    for(let message of messages){
        if(message.Sender_ID_Message== patient.ID_User){
            html += '<div class="message">'+
                        '<div class="sender" style="background-color: #047bd1">'+ initial_pat +'</div>' +
                        '<p class="message-text">'+message.Content_Message+'</p>'+
                        '<p style="margin-inline-end: 2%;">'+message.Date_Time_Message.split('T')[0].split('.')[0].split('-').reverse().join('/') + ' ' +message.Date_Time_Message.split('T')[1].split('.')[0].substr(0, 5) +'</p>'+
                    '</div>'
        } else {
            html += '<div class="message">'+
                        '<div class="sender" >'+ initial_doc +'</div>' +
                        '<p class="message-text">'+message.Content_Message+'</p>'+
                        '<p style="margin-inline-end: 2%;">'+message.Date_Time_Message.split('T')[0].split('.')[0].split('-').reverse().join('/') + ' ' +message.Date_Time_Message.split('T')[1].split('.')[0].substr(0, 5) +'</p>'+
                    '</div>'
        }
    }
    elem.style.display = "block"
    elem.innerHTML += html
    scroll_bottom();
}

//On click, redirect to testPage 
const solveTest = (id_test, type, configuration ) => {
    sessionStorage.setItem("id_test", id_test)
    sessionStorage.setItem("test_configuration", JSON.stringify(configuration))
    switch(type){
        case "Rey Complex Figure":
            window.location = 'reyTestPage.html'
            break;
        case "Puzzle Board":
            window.location = 'puzzleTestPage.html'
            break;
        default:
            break;
    }
}

//Open tab on click
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
    
    if( tabName == "dms"){
        $("#notification-ball").hide()
    }
}

const scroll_bottom = () => {
    let elem = document.getElementById('messages')
    elem.scrollTop = elem.scrollHeight
}