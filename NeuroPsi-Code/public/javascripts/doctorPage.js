var patients

window.onload = async function(){
    //Get doctor's info
    let doctor = await $.ajax({
        url: 'api/doctors/1',
        method: 'get',
        dataType: 'json'
    })

    //Get doctor's patients
    patients = await $.ajax({
        url: 'api/doctors/1/patients',
        method: 'get',
        dataType: 'json'
    })

    //Get assigned test
    let tests = await $.ajax({
        url: 'api/doctors/1/patients/tests',
        method: 'get',
        dataType: 'json'
    })

    showDoctor(doctor)
    showPatients(patients)
    showTests(tests)
}

//Display doctor info
const showDoctor = doctor => {
    let elem = document.getElementById('doctor')
    let html = doctor.name_User
    elem.innerHTML = html
}


//Display patients
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

//Display tests
const showTests = tests =>{
    let elem = document.getElementById('testList-content')
    let html = ""
    for(let test of tests){
        html += '<tr class="test-line">'+
                    '<td>'+ test.ID_Patient +'</td>'+
                    '<td>'+ test.name_User +'</td>'+
                    '<td>'+ test.type_Test +'</td>'+
                    '<td>'+ test.Date_Test_Patient.slice(0,test.Date_Test_Patient.indexOf("T")).split("-").reverse().join("/") +'</td>';
        html += test.CompleteDate_Test_Patient == null ? '<td>Waiting...</td>' : '<td>'+test.CompleteDate_Test_Patient.slice(0,test.CompleteDate_Test_Patient.indexOf("T")).split("-").reverse().join("/")+'</td>'
        html += test.Test_State == "unsolved" ? '<td><button class="viewTestBtn unsolved">Not Available</button></td></tr>' : '<td><button class="viewTestBtn" onclick="viewTest('+test.ID_Test_Patient+')">View Test</button></td></tr>';
                
    }
    elem.innerHTML +=  html
    tests.length < 10 ? elem.innerHTML += '<tr class="blank"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'.repeat(10-tests.length) : 0
}


//Display patient's info after click in the row
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

//Display form
const assignTest = async id_patient => {
    let modal = document.getElementById("form-modal");
    let btn = document.getElementById("assignTestBtn");
    let span = document.getElementsByClassName("close")[0];
    let types = document.getElementById('types')
    let html = ""

    let typesList = await $.ajax({
        url: 'api/tests/',
        method: 'get',
        dataType: 'json'
    })

    for(let type of typesList){
        typesList.indexOf(type) == 0 ? html += '<option value="'+type.type_Test+'" selected>'+type.type_Test+'</option>' : html += '<option value="'+type.type_Test+'">'+type.type_Test+'</option>'
    }
    types.innerHTML += html

    btn.onclick = function() {
    modal.style.display = "block";
    }

    span.onclick = function() {
    modal.style.display = "none";
    }
}

//Open test tab for visualization
const viewTest = async test_id => {
    let playCount = 0

    document.getElementById('tabs-container').style.display = "none"
    document.getElementById('test-view').style.display = "block"

	document.getElementById('canvas1').width = document.getElementById('test-view').offsetWidth * 0.5
	document.getElementById('canvas1').height = document.getElementById('test-view').offsetHeight * 0.75

    let figure = await $.ajax({
        url: 'api/tests/'+test_id+'/figures',
        method: 'get',
        dataType: 'json'
    })   
    serializedJSON = figure[0].FigureJSON
    let drawing = new RecordableDrawing("canvas1");

    $("#playBtn").click(function(){
        if(playCount>=1) resumePlayback()
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
}













































