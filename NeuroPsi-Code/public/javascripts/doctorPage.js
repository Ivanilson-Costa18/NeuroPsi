var patients
var selected_patient
var doctor_obj = JSON.parse(sessionStorage.getItem('id'))
var doctor
var matrix = []


window.onload = async function(){
        //Get doctor's info
        doctor = await $.ajax({
            url: 'api/doctors/'+doctor_obj.id,
            method: 'get',
            dataType: 'json'
        })

        try{
        //Get doctor's patients
            patients = await $.ajax({
                url: 'api/doctors/'+doctor_obj.id+'/patients',
                method: 'get',
                dataType: 'json'
            })
            showPatients(patients)
            showMessagesRooms(patients)
        } catch(error){
            showPatients([])
            showMessagesRooms([])
            $('#empty-container-p').show()
            $('#disclaimer-patients').html(error.responseJSON.detail)
            $('#empty-rooms').show()
            console.log(error)
        }

        try{
            //Get assigned test
            let tests = await $.ajax({
                    url: 'api/doctors/'+doctor_obj.id+'/patients/tests',
                    method: 'get',
                    dataType: 'json'
            })
            showTests(tests)
        } catch(error){
            showTests([])
            $('#empty-container-t').show();
            $('#disclaimer-tests').html(error.responseJSON.detail)
            console.log(error)
        }

        try {
            let notifications = await $.ajax({
                url: 'api/tests/testshistory/'+doctor_obj.id,
                method: 'get',
                dataType: 'json'
            })
            showNotifications(notifications)
            if(notifications.length > 0){
                document.getElementById('bell').style.color = '#ff5f5f' 
            }
        } catch (error) {
            console.log(error)
        }
        
        showDoctor(doctor)

    $('#bell').click(function(){
        $('#notifications-container').show()
        $(this).addClass('no-hover')

    })

    $(document).mouseup(function(e){
        var eti = $("#notifications-container");
        if(!eti.is(e.target) && eti.has(e.target).length === 0){
            eti.hide();
            $('#bell').removeClass('no-hover')
        }
    });

    $('#bars').click(function(){
        $('#options-container').show()
        $(this).addClass('no-hover')

    })

  
    $(document).mouseup(function(e){
        var eti = $("#options-container");
        if(!eti.is(e.target) && eti.has(e.target).length === 0){
            eti.hide();
            $('#bars').removeClass('no-hover')
        }
    });
}

//Display doctor info
const showDoctor = doctor => {
    let elem = document.getElementById('doctor')
    let html = doctor.name_User.split(" ")[0]
    elem.innerHTML = 'Hi, '+html
}


//Display patients
const showPatients = patients => {
    let elem = document.getElementById('list-content')
    let html = ""
    for(let patient of patients){
        html += '<tr id='+patient.ID_Patient+' class="line" onclick="displayInfo('+patient.ID_Patient+')">'+
                    '<td>'+ patient.name_User +'</td>'+
                    '<td>'+ patient.email_User +'</td>'+
                    '<td>'+ patient.tel_User +'</td>'+
                '</tr>'
    }
    elem.innerHTML +=  html 
    patients.length < 10 ? elem.innerHTML += '<tr class="blank"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'.repeat(10-patients.length) : elem.innerHTML
}

//Display tests
const showTests = tests =>{
    let elem = document.getElementById('testList-content')
    let html = ""
    for(let test of tests){
        html += '<tr class="test-line line">'+
                    '<td>'+ test.name_User +'</td>'+
                    '<td>'+ test.name_Test_Type +'</td>'+
                    '<td>'+ test.Date_Test.slice(0,test.Date_Test.indexOf("T")).split("-").reverse().join("/") +'</td>';
        html += test.name_Test_State == 'unsolved' ? '<td>Waiting...</td>' : '<td>Complete</td>'
        html += test.name_Test_State == "unsolved" ? '<td><button class="viewTestBtn unsolved">Not Available</button></td></tr>' : '<td><button class="viewTestBtn" onclick=\'viewTest('+test.ID_Test+','+test.Test_Type+','+test.Test_Configuration+')\'>View Test</button></td></tr>';
                
    }
    elem.innerHTML +=  html
    tests.length < 10 ? elem.innerHTML += '<tr class="blank"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'.repeat(10-tests.length) : 0
}

const showMessagesRooms = async patients => {
    let elem = document.getElementById('roomsList')
    let html = ""
    let last_messages = []
    for(let patient of patients){
        let message = await $.ajax({
            url:'api/messages/'+patient.ID_User,
            method:'get',
            dataType: 'json'
        })
        if(message.length > 0) last_messages.push(message[0])
        else {last_messages.push({Date_Time_Message: "",Content_Message: ""})}
    }

    for(let i in patients){
        html +=  '<div class="room" id="room-'+patients[i].ID_User+'" onclick=\'showmessages('+JSON.stringify(patients[i])+')\'>'+
                    '<div class="patient-icon">'+
                        '<i class="fas fa-user" id="icon-room"></i>'+
                    '</div>'+
                    '<div class="roomLastMessage">'+
                        '<p id="name" style="margin: 1% 0 0 0;">'+patients[i].name_User+'</p>'+
                        '<p class="last-message" style="margin: 1% 0 0 0;">'+last_messages[i].Content_Message+'</p>'+
                    '</div>'+
                    '<div class="time">'+last_messages[i].Date_Time_Message.split('T')[0].split('.')[0].split('-').reverse().join('/')+
                    '</div>'+
                    '<span style="display: none;" id="notification-ball" class="circle"></span>'+
                    '<div class="border-bottom"></div>'+                      
                '</div>'
    }

    elem.innerHTML += html
}


const showmessages = async (patient) =>{
    $('#room-'+patient.ID_User).find(".circle").hide()
    $("#roomsList>div.opened").removeClass("opened");
    document.getElementById('chat-title').innerHTML = 'Chat with '+patient.name_User
    $('#room-'+patient.ID_User).addClass('opened')
    receiver_id = patient.ID_User
    let elem = document.getElementById('messages')
    elem.innerHTML = ""
    let html = ""

    let messages = await $.ajax({
        url: 'api/messages/',
        method: 'post',
        dataType: 'json',
        data: {
            "sender": doctor_obj.id_user,
            "receiver": receiver_id
        }
    })
    let initial_doc = doctor.name_User.split(' ')[0].charAt(0) + ' ' + doctor.name_User.split(' ')[1].charAt(0)
    let initial_pat = patient.name_User.split(' ')[0].charAt(0) + ' ' + patient.name_User.split(' ')[1].charAt(0)
    for(let message of messages){
        if(message.Sender_ID_Message== patient.ID_User){
            html += '<div class="message">'+
                        '<div class="sender">'+ initial_pat +'</div>' +
                        '<p class="message-text">'+message.Content_Message+'</p>'+
                        '<p style="margin-inline-end: 2%;">'+message.Date_Time_Message.split('T')[0].split('.')[0].split('-').reverse().join('/') + ' ' +message.Date_Time_Message.split('T')[1].split('.')[0].substr(0, 5) +'</p>'+
                    '</div>'
        } else {
            html += '<div class="message">'+
                        '<div class="sender" style="background-color: #047bd1">'+ initial_doc +'</div>' +
                        '<p class="message-text">'+message.Content_Message+'</p>'+
                        '<p style="margin-inline-end: 2%;">'+message.Date_Time_Message.split('T')[0].split('.')[0].split('-').reverse().join('/') + ' ' +message.Date_Time_Message.split('T')[1].split('.')[0].substr(0, 5) +'</p>'+
                    '</div>'
        }
    }

    elem.style.display = "block"
    elem.innerHTML += html
    scroll_bottom()
}


//Show notifications
const showNotifications = tests => {
    let elem = document.getElementById('notifications-container')
    let html = ""
    for(let test of tests){
        html += '<div class="notification">'+
                    '<div class="notification-content">'+
                        '<p> Test solved by '+test.name_User+'<br>Type: '+test.name_Test_Type+'</p>'+
                    '</div>'+
                '</div>' 
    }
    elem.innerHTML += html 
}


//Display patient's info after click in the row
const displayInfo = ID_Patient => {
    $("#patient-section").addClass('white');
    let elem  = document.getElementById('patient-info')
    elem.innerHTML = ""
    let html = ""
    for(let patient of patients){
        if (patient.ID_Patient == ID_Patient) {
            html  = '<i class="fas fa-user" id="icon"></i>'+
                    '<p style="font-size: 1.1rem; text-align: center;"><b>'+patient.name_User+'</b></p>'+
                    '<button id="assignTestBtn" onclick="displayForm('+ID_Patient+')">Assign Test</button>'
        }
    }
    elem.innerHTML += html 
}

//Display form
const displayForm = async id_patient => {
    selected_patient = id_patient
    let modal = document.getElementById("form-modal");
    let btn = document.getElementById("assignTestBtn");
    let span = document.getElementsByClassName("close")[0];
    let form = document.getElementsByClassName('form-content')[0]
    let types = document.getElementById('types')


    let typesList = await $.ajax({
        url: 'api/tests/',
        method: 'get',
        dataType: 'json'
    })

    for(let i in typesList){
        types.innerHTML += i == 0 ?  '<option value="'+(Number(i)+1)+'" selected>'+typesList[i].name_Test_Type+'</option>' : '<option value="'+(Number(i)+1)+'">'+typesList[i].name_Test_Type+'</option>'
    }

    for(let i in typesList){
        let html = ""
        if(i == 0){ 
            html += '<div id="option-'+(Number(i)+1)+'" class="details">'+
                        '<h6 style="margin-bottom: 1%; margin-top: -2%">Choose the figure display time:</h6>'+
                        '<input type="radio" class="radio" name="option" value="30">'+
                        '<label for="show&dis">Show for 30min and dissapear</label><br>'+//Test pourpose -> doctor will choose the time (after demo)
                        '<input type="radio" class="radio" name="option" value="0">'+
                        '<label for="permanent">Permanent</label><br>'+
                    '</div>'
        }else{
            html += '<div id="option-'+(Number(i)+1)+'" class="details" style="display:none;">'+
                        '<h4 id="level-title">Level</h4>'+
                        '<select id="size" style="padding: 2%; font-size: 1rem;">'+
                            '<option selected>Choose a size...</option>'+
                            '<option>3x2</option>'+
                            '<option>6x4</option>'+
                            '<option>12x8</option>'+
                        '</select>'+
                        '<h4 id="theme-title">Theme</h4>'+
                        '<div id="slideshow-container">'+
                            '<div class="mySlides fade">'+
                                '<div class="numbertext">1 / 3</div>'+
                                '<img src="images/farm.jpg" style="width:100%; height: 45%;">'+
                                '<div class="text">Field</div>'+
                            '</div>'+
                            '<div class="mySlides fade">'+
                                '<div class="numbertext">2 / 3</div>'+
                                '<img src="images/city.jpg" style="width:100%; height: 45%;">'+
                                '<div class="text">City at night</div>'+
                            '</div>'+
                            '<div class="mySlides fade">'+
                                '<div class="numbertext">3 / 3</div>'+
                                '<img src="images/beach.jpg" style="width:100%; height: 45%;">'+
                                '<div class="text">Small beach</div>'+
                            '</div>'+
                            '<a class="prev" onclick="plusSlides(-1)">&#10094;</a>'+
                            '<a class="next" onclick="plusSlides(1)">&#10095;</a>'+
                        '</div>'+
                        '<div id="dots" style="text-align:center;">'+
                            '<span class="dot" onclick="currentSlide(1)"></span>'+
                            '<span class="dot" onclick="currentSlide(2)"></span>'+
                            '<span class="dot" onclick="currentSlide(3)"></span>'+
                        '</div>'+
                    '</div>'
        }
        form.innerHTML += html
    }
    
    $('#types').change(function () {
        $('.details').hide();
        $('#option-'+$(this).val()).show();
        if($(this).val() == 2){
            showSlides(slideIndex);
        }
    })

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
        $('#types').empty()
        $('.details').remove()
    }
}

//Send data for assignment creation
const saveTest = async () => {
    let types = document.getElementById('types')
    switch(Number(types.value)){
        case 1:
            try {
                await $.ajax({
                    url: 'api/patients/'+selected_patient+'/tests',
                    method: 'post',
                    dataType: 'json',
                    data: {
                        "Test_Type": Number(types.value.slice(types.value.indexOf('n')+1, types.value.length)),
                        "Test_Configuration": JSON.stringify({
                                time: $('input[name="option"]:checked').val()
                            })
                        }
                    })
            } catch (error){
                console.log(error)
            }
            break;
        case 2:
            try {
                await $.ajax({
                    url: 'api/patients/'+selected_patient+'/tests',
                    method: 'post',
                    dataType: 'json',
                    data: {
                        "Test_Type": Number(types.value.slice(types.value.indexOf('n')+1, types.value.length)),
                        "Test_Configuration": JSON.stringify({
                            size: $('#size').val(),
                            image: $('#slideshow-container').children('.selected').children('img').attr('src'),
                            })
                        }
                    })
            } catch (error) {
                console.log(error);
            }
            break;
        default: 
        break;
    }
    
    let modal = document.getElementById("form-modal");
    modal.style.display = "none";
    $('#types').empty()
    $('.details').remove()
    scroll_top()

    $("#confirmation").fadeIn(4000)
    $("#confirmation").fadeOut(1500);
  
    sleep(5500);
    window.location.reload();
}

//Verify patient values
const verifyValues = patient => {
    let valid = true
    for(elem of document.getElementsByTagName('span')){
        elem.style.display = "none"
    }
    for(elem of document.getElementsByClassName('newPatient')){
        elem.style.backgroundColor = "white"
    }
    if(patient.fname == 0){
        document.getElementById('FName').style.backgroundColor = "#ff00003b"
        document.getElementById('errorFName').style.display = "block"
        valid = false;
    }
    if (patient.lname == 0){
        document.getElementById('LName').style.backgroundColor = "#ff00003b"
        document.getElementById('errorLName').style.display = "block"
        valid = false;
    }
    if  (patient.email == 0 || !patient.email.match('[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+')){
        document.getElementById('email').style.backgroundColor = "#ff00003b"
        document.getElementById('errorEmail').style.display = "block"
        valid = false;
    }
    if (patient.password < 6){
        document.getElementById('password').style.backgroundColor = "#ff00003b"
        document.getElementById('errorPassword').style.display = "block"
        valid = false;
    }
    if (patient.cpassword == 0){
        document.getElementById('cpassword').style.backgroundColor = "#ff00003b"
        document.getElementById('errorCPassword').style.display = "block"
        valid = false;
        if (patient.password != patient.cpassword){
            console.log(6)
            document.getElementById('cpassword').style.backgroundColor = "#ff00003b"
            document.getElementById('matchPassword').style.display = "block"
            vaid = false;
        }
    }
    return valid
}

//Send data for patient creation
const createPatient = async () => {
    let patient = {
        fname: $("#FName").val(),
        lname: $("#LName").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        cpassword: $("#cpassword").val(),
    }
    //If values are valid send data
    if(verifyValues(patient)){
        $.ajax({
            url: 'api/doctors/'+doctor_obj.id+'/patients',
            method: 'post',
            dataType: 'json',
            data: {
                "name": patient.fname + ' ' + patient.lname,
                "email": patient.email,
                "password": patient.password,
                "tel": $('#phone').val()
            }
        })

    scroll_top()
    $("#confirmation").fadeIn(2000)
    $("#confirmation").fadeOut(1000);
    sleep(3)
    window.location.reload = true
    }
}

const alternativeCreatePatient = async () => {
    let patient_email = $("#email2").val()
    //If values are valid send data
    try {$.ajax({
        url: 'api/doctors/'+doctor_obj.id+'/patients/'+patient_email,
        method: 'post',
        dataType: 'json',
    })} catch(error) {
        console.log(error);
    }
}

//Open test tab for visualization
const viewTest = async (test_id, type, config) => {
    document.getElementById('tabs-container').style.display = "none"
    document.getElementById('test-view').style.display = "block"
    
    switch(Number(type)){
        case 1:
            viewReyTest(test_id)
            break;
        case 2:
            viewPuzzleTest(test_id, config)
            break;
        default:
            break;
    }
    scroll_top();
}

const viewReyTest = async (test_id) => {
    let playCount = 0
    document.getElementById('test-container').innerHTML =   '<canvas id="canvas1">'+
                                                            '</canvas>'+
                                                            '<div id="btn-container">'+
                                                                '<button id="playBtn" value="Play" class="controlBtn"><i class="fas fa-play control"></i></button>'+
                                                                '<button id="pauseBtn" value="Pause" class="controlBtn"><i class="fas fa-pause control"></i></button>'+
                                                            '</div>'

    document.getElementById('canvas1').width = document.getElementById('test-view').offsetWidth * 0.5
    document.getElementById('canvas1').height = document.getElementById('test-view').offsetHeight * 0.75

    let figure = await $.ajax({
        url: 'api/tests/'+test_id+'/figures',
        method: 'get',
        dataType: 'json'
    })   

    serializedJSON = figure[0].Actions_Rey_Drawing
    let drawing = new RecordableDrawing("canvas1");

    $("#playBtn").click(function(){
        if(playCount>=1){ 
            drawing.clearCanvas();
            playRecordings()
        }
        else{
            var result = deserializeDrawing(serializedJSON);
            drawing.recordings = result;
            for (var i = 0; i < result.length; i++)
                result[i].drawing = drawing;
            playRecordings();
            playCount++
        }
    })

    $("#pauseBtn").click(function(){
            var btnTxt = $("#pauseBtn").prop("value");
            if (btnTxt == 'Pause')
            {
                pausePlayback();
            }
    })
    
    function playRecordings()
        {
            if (drawing.recordings.length == 0)
            {
                alert("No recording to play");
                return;
            }
                startPlayback();			
        }
    
    function startPlayback()
    {
        drawing.playRecording(function() {
            //on playback start
            playbackInterruptCommand = "";
        }, function(){
            //on playback end
        }, function() {
            //on pause
        }, function() {
            //status callback
            return playbackInterruptCommand;
        });
    }
    
    function pausePlayback()
    {
        playbackInterruptCommand = "pause";
    }
    
    function resumePlayback()
    {
        playbackInterruptCommand = "";
        drawing.resumePlayback(function(){
        });
    }
                                                
}

const viewPuzzleTest = async (test_id, configuration) => {
    let replay = 0
    document.getElementById('test-container').innerHTML =   '<div id="board">'+
                                                                '<img id="image">'+
                                                            '</div>'+
                                                            '<button id="replay" style="padding: 1% 0 1% 0;margin: 58.3% 0 0;width: 66.8%;font-size: 1.5rem;">Replay</button>'
    
    const createPuzzle = () => {
        matrix = []
        $("#image").attr('src', configuration.image)
        let puzzle_board = document.getElementById('board')
        let puzzle_width = puzzle_board.offsetWidth
        let puzzle_height = puzzle_board.offsetHeight
        let html = ''
        let cols = configuration.size.split('x')[0]
        let rows = configuration.size.split('x')[1]
        let count = 1
        for(let i = 0; i < rows; i++){
            let row = []
            for(let j = 0; j < cols; j++){
                if(i == rows-1 && j == cols-1){
                    row.push('empty')
                    html += '<div class="piece empty" id="empty" style="top:'+i*puzzle_height/rows+';left: '+j*puzzle_width/cols+'; width: '+puzzle_width*0.99/cols+'; height: '+puzzle_height*0.99/rows+'"></div>'
                } else {
                    row.push(count)
                    html += '<div class="piece" id="'+count+'" style="top:'+i*puzzle_height/rows+';left: '+j*puzzle_width/cols+'; width: '+puzzle_width*0.99/cols+'; height: '+puzzle_height*0.99/rows+'" onclick="swap('+count+')"></div>'
                    count++
                }
            }
            matrix.push(row)
        }
        puzzle_board.innerHTML += html
    }

    const getIndexOfJ = (array, j) => {
        for (var y = 0; y < array.length; y++) {
            var x = array[y].indexOf(j);
            if (x > -1) {
                return [x, y];
            }
        }
    }

    const swap = id => {
        let piece = $('#'+id)
        let position = getIndexOfJ(matrix, id)
    
        let empty_piece = document.getElementById('empty')
        let empty = getIndexOfJ(matrix, 'empty')
    
        matrix[empty[1]][empty[0]] = id
        matrix[position[1]][position[0]] = 'empty'
    
        let new_x = piece.position().left
        let new_y = piece.position().top
    
        piece.animate({left: empty_piece.style.left, top: empty_piece.style.top}, 150)
    
        empty_piece.style.left = new_x
        empty_piece.style.top = new_y
    }
    
    const playback = async (actionsSet) => {
        for(action of actionsSet.actions){
            await sleep(action.interval)
            swap(action.piece_id)
        }
    }
                
    let moves = await $.ajax({
        url: 'api/tests/'+test_id+'/moves',
        method: 'get',
        dataType: 'json'
    })   

    $("#replay").click(function(){
        if(replay == 0){
            let audio_obj = JSON.parse(moves[0].Audio_Puzzle)
            playback(JSON.parse(moves[0].Puzzle_Moves));
            replay++
            const byteCharacters = atob(audio_obj.audio);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {type: audio_obj.type});
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            const play = () => {
              audio.play();
            };
            audio.play()
        }
        else{
            $('#board').empty()
            $('#board').html('<img id="image">')
            createPuzzle()
            $("#image").attr('src', configuration.image)
            playback(JSON.parse(moves[0].Puzzle_Moves))
        }
    })

    createPuzzle();
}


//Back to previous tabs
const goBack = () =>{
    document.getElementById('tabs-container').style.display = "block"
    document.getElementById('test-view').style.display = "none"
}


//open tab on click
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

//filter patient table
function patientFilter() {
    var input = document.getElementById("search-patient");
    var filter = input.value.toUpperCase();
    var table = document.getElementById("list-content");
    var tr = table.getElementsByTagName("tr");
    let first = true
    let countresults = 0
    let count = 0
    for (var i = 0; i < tr.length; i++) {
        if (tr[i].textContent.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            count++
            first = false
        } else {
            if(tr[i].classList[0] != "blank"){
                if(tr[i].style.display != "none"){
                    tr[i].style.display = "none"
                }
            }      
            first = false
        }

    }
}  


var slideIndex = 1;

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  document.getElementById("dots").style.display = "block"
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      slides[i].classList.remove("selected")

  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  slides[slideIndex-1].className += " selected";
  dots[slideIndex-1].className += " active";
}

const profile = () => {
    document.getElementById('tabs-container').style.display = "none"
    document.getElementById('profile-view').style.display = "block"
}

const logout = async () => {
    let redirect = await $.ajax({
        url: 'api/authentication/logout',
        method: 'get',
        dataType: 'json'
    });
    window.location = redirect.redirect
}

const scroll_bottom = () => {
    let elem = document.getElementById('messages')
    elem.scrollTop = elem.scrollHeight
}


const scroll_top = () => {
    let elem = document.body
    elem.scrollTop = 0
    document.documentElement.scrollTop = 0
}

const sleep = (mls) => {
    return new Promise(resolve => setTimeout(resolve, mls))
}
