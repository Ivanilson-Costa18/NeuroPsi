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
                    '<td>'+ test.Date_Test_Patient.slice(0,test.Date_Test_Patient.indexOf("T")).split("-").reverse().join("/") +'</td>';
        html += test.CompleteDate_Test_Patient == null ? '<td>Waiting...</td>' : '<td>'+test.CompleteDate_Test_Patient.slice(0,test.CompleteDate_Test_Patient.indexOf("T")).split("-").reverse().join("/")+'</td>'
        html += test.Test_State == "unsolved" ? '<td><button class="viewTestBtn unsolved">Not Available</button></td></tr>' : '<td><button class="viewTestBtn" onclick="viewTest('+test.ID_Test_Patient+')">View Test</button></td></tr>';
                
    }
    elem.innerHTML +=  html
    tests.length < 10 ? elem.innerHTML += '<tr class="blank"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>'.repeat(10-tests.length) : 0
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

const goBack = () =>{
    document.getElementById('tabs-container').style.display = "block"
    document.getElementById('test-view').style.display = "none"
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
















































RecordableDrawing = function (canvasId)
{
	var self = this;
	this.canvas = null;
	this.width = this.height = 0;
	this.actions = new Array();
	this.ctx = null;
	this.mouseDown = false;
	this.currentRecording = null; //instance of Recording
	this.recordings = new Array(); //array of Recording objects
	this.lastMouseX = this.lastMouseY = -1;
	this.bgColor = "rgb(255,255,255)";
	var currentLineWidth = 5;
	var drawingColor = "rgb(0,0,0)";
	var pauseInfo = null;
	
	onMouseDown = function(event)
	{
		var canvasX = $(self.canvas).offset().left;
		var canvasY = $(self.canvas).offset().top;
		
		self.mouseDown = true;
		var x = Math.floor(event.pageX - canvasX);
		var y = Math.floor(event.pageY - canvasY);
		
		var	currAction = new Point(x,y,0);
		self.drawAction(currAction,true);
		if (self.currentRecording != null)
			self.currentRecording.addAction(currAction);
		event.preventDefault();
		return false;
	}
	
	onMouseMove = function(event)
	{
		if (self.mouseDown)
		{
			var canvasX = $(self.canvas).offset().left;
			var canvasY = $(self.canvas).offset().top;
			
			var x = Math.floor(event.pageX - canvasX);
			var y = Math.floor(event.pageY - canvasY);
			
			var action = new Point(x,y,1);
			if (self.currentRecording != null)
				self.currentRecording.addAction(action);
			self.drawAction(action, true);
				
			event.preventDefault();
			self.lastMouseX = x;
			self.lastMouseY = y;
			return false;
		}
	}
	
	onMouseUp = function(event)
	{
		self.mouseDown = false;
		self.lastMouseX = -1;
		self.lastMouseY = -1;
	}
	
	this.startRecording = function()
	{
		self.currentRecording = new Recording(this);
		self.recordings = new Array();
		self.recordings.push(self.currentRecording);
		self.currentRecording.start();
	}
	
	this.stopRecording = function()
	{
		if (self.currentRecording != null)
			self.currentRecording.stop();
		self.currentRecording = null;
	}
	
	this.playRecording = function(onPlayStart, onPlayEnd, onPause, interruptActionStatus)
	{
		if (typeof interruptActionStatus == 'undefined')
			interruptActionStatus = null;
		
		if (self.recordings.length == 0)
		{
			alert("No recording loaded to play");
			onPlayEnd();
			return;
		}

		self.clearCanvas();
		
		onPlayStart();
		
		self.pausedRecIndex = -1;
		
		for (var rec = 0; rec < self.recordings.length; rec++)
		{
			if (interruptActionStatus != null)
			{
				var status = interruptActionStatus();
				if (status == "stop") {
					pauseInfo = null;
					break;
				}
				else 
					if (status == "pause") {
						__onPause(rec-1, onPlayEnd, onPause, interruptActionStatus);
						break;
					}
			}
			self.recordings[rec].playRecording(self.drawActions, onPlayEnd, function(){
				__onPause(rec-1, onPlayEnd, onPause, interruptActionStatus);
			}, interruptActionStatus);
		}
	}

	function __onPause(index, onPlayEnd, onPause, interruptActionStatus)
	{
		pauseInfo = {
			"index": index,
			"onPlayend": onPlayEnd,
			"onPause":onPause,
			"interruptActionStatus": interruptActionStatus
		};
		if (onPause)
			onPause();
	}
		
	this.resumePlayback = function (onResume)
	{
		if (pauseInfo == null) {
			if (onResume)
				onResume(false);
			return;
		}
		
		var index = pauseInfo.index;
		var onPlayEnd = pauseInfo.onPlayend;
		var interruptActionStatus = pauseInfo.interruptActionStatus;
		var onPause = pauseInfo.onPause;
		
		if (self.recordings.length == 0)
		{
			alert("No recording loaded to play");
			onPlayEnd();
			return;
		}

		onResume(true);
		
		pauseInfo = null;
		
		for (var rec = index; rec < self.recordings.length; rec++)
		{
			if (interruptActionStatus != null)
			{
				var status = interruptActionStatus();
				if (status == "stop")
					break;
				else if (status == "pause")
				{
					__onPause(rec-1, onPlayEnd, onPause, interruptActionStatus);
					break;		
				}
			}
			self.recordings[rec].playRecording(self.drawActions, onPlayEnd, function(){
				__onPause(rec-1, onPlayEnd, onPause, interruptActionStatus);
			},interruptActionStatus);
		}
	}

	this.clearCanvas = function()
	{
		self.ctx.fillStyle = self.bgColor;
		self.ctx.fillRect(0,0,self.canvas.width,self.canvas.height);		
	}

	this.removeAllRecordings = function()
	{
		self.recordings = new Array()
		self.currentRecording = null;
	}
	
	this.drawAction = function (actionArg, addToArray)
	{
		var x = actionArg.x;
		var y = actionArg.y;
		
		switch (actionArg.type)
		{
		case 0: //moveto
			self.ctx.beginPath();
			self.ctx.moveTo(x, y);
			self.ctx.strokeStyle = self.drawingColor;
			self.ctx.lineWidth = self.currentLineWidth;			
			break;
		case 1: //lineto
			self.ctx.lineTo(x,y);
			self.ctx.stroke();
			break;
		}
		if (addToArray)
			self.actions.push(actionArg);
	}	
		
	__init = function()
	{
		self.canvas = $("#" + canvasId);
		if (self.canvas.length == 0)
		{
			return;
		} 
		self.canvas = self.canvas.get(0);
		self.width = $(self.canvas).width();
		self.height = $(self.canvas).height();
		self.ctx = self.canvas.getContext("2d");
		
		//$(self.canvas).bind("vmousedown", onMouseDown);
		//$(self.canvas).bind("vmouseup", onMouseUp);
		//$(self.canvas).bind("vmousemove", onMouseMove);

		$(self.canvas).bind("mousedown", onMouseDown);
		$(self.canvas).bind("mouseup", onMouseUp);
		$(self.canvas).bind("mousemove", onMouseMove);
		
		self.clearCanvas();		
	}
	
	__init();
}

Recording = function (drawingArg)
{
	var self = this;
	this.drawing = drawingArg;
	this.timeSlots = new Object(); //Map with key as time slot and value as array of Point objects
	
	this.buffer = new Array(); //array of Point objects 
	this.timeInterval = 100; //10 miliseconds
	this.currTime = 0;
	this.started = false;
	this.intervalId = null;
	this.currTimeSlot = 0;
	this.actionsSet = null;
	this.currActionSet = null;
	this.recStartTime = null;
	this.pauseInfo = null;
	
	this.start = function()
	{
		self.currTime = 0;
		self.currTimeSlot = -1;
		self.actionsSet = null;
		self.pauseInfo = null;
		
		self.recStartTime = (new Date()).getTime();
		self.intervalId = window.setInterval(self.onInterval, self.timeInterval);
		self.started = true;
	}
	
	this.stop = function()
	{
		if (self.intervalId != null)
		{
			window.clearInterval(self.intervalId);
			self.intervalId = null;
		}
		self.started = false;
	}
	
	this.onInterval = function()
	{
		if (self.buffer.length > 0)
		{
			var timeSlot = (new Date()).getTime() - self.recStartTime;
		
			if (self.currActionSet == null)
			{
				self.currActionSet = new ActionsSet(timeSlot, self.buffer);
				self.actionsSet = self.currActionSet;
			}
			else
			{
				var tmpActionSet = self.currActionSet;
				self.currActionSet = new ActionsSet(timeSlot, self.buffer);
				tmpActionSet.next = self.currActionSet;
			}
			
			self.buffer = new Array();
		}
		self.currTime += self.timeInterval;
	}
	
	this.addAction = function(actionArg)
	{
		if (!self.started)
			return;
		self.buffer.push(actionArg);
	}
	
	this.playRecording = function(callbackFunctionArg, onPlayEnd, onPause, interruptActionStatus)
	{
		if (self.actionsSet == null)
		{
			if (typeof onPlayEnd != 'undefined' && onPlayEnd != null)
				onPlayEnd();
			return;
		}	

		self.scheduleDraw(self.actionsSet,self.actionsSet.interval,callbackFunctionArg, onPlayEnd, onPause, true, interruptActionStatus);
	}

	this.scheduleDraw = function (actionSetArg, interval, callbackFunctionArg, onPlayEnd, onPause, isFirst, interruptActionStatus)
	{
		window.setTimeout(function(){
			var status = "";
			if (interruptActionStatus != null)
			{
				status = interruptActionStatus();
				if (status == 'stop')
				{
					self.pauseInfo = null;
					onPlayEnd();
					return;
				}
			}
			
			if (status == "pause")
			{
				self.pauseInfo = {
					"actionset":actionSetArg,
					"callbackFunc":callbackFunctionArg,
					"onPlaybackEnd":onPlayEnd,
					"onPause":onPause,
					"isFirst":isFirst,
					"interruptActionsStatus":interruptActionStatus
				};
				
				if (onPause)
					onPause();
				return;
			}
			
			var intervalDiff = -1;
			var isLast = true;
			if (actionSetArg.next != null)
			{
				isLast = false;
				intervalDiff = actionSetArg.next.interval - actionSetArg.interval;
			}
			if (intervalDiff >= 0)
				self.scheduleDraw(actionSetArg.next, intervalDiff, callbackFunctionArg, onPlayEnd, onPause, false,interruptActionStatus);

			self.drawActions(actionSetArg.actions, onPlayEnd, isFirst, isLast);
		},interval);
	}
	
	this.resume = function()
	{
		if (!self.pauseInfo)
			return;
		
		self.scheduleDraw(self.pauseInfo.actionset, 0, 
			self.pauseInfo.callbackFunc, 
			self.pauseInfo.onPlaybackEnd, 
			self.pauseInfo.onPause,
			self.pauseInfo.isFirst,
			self.pauseInfo.interruptActionsStatus);
			
		self.pauseInfo = null;
	}	
	
	this.drawActions = function (actionArray, onPlayEnd, isFirst, isLast)
	{
		for (var i = 0; i < actionArray.length; i++)
			self.drawing.drawAction(actionArray[i],false);
			
		if (isLast)
		{
			onPlayEnd();
		}
	}
}

Action = function()
{
	var self = this;
	this.actionType; // 1 - Point, other action types could be added later
	this.x = 0;
	this.y = 0;
	this.isMovable = false;
	this.index = 0;
	
	if (arguments.length > 0)
	{
		self.actionType = arguments[0];
	}
	if (arguments.length > 2)
	{
		self.x = arguments[1];
		self.y = arguments[2];
	}
}

Point = function (argX,argY,typeArg)
{
	var self = this;
	this.type = typeArg; //0 - moveto, 1 - lineto
	
	Action.call(this,1,argX,argY);
}

Point.prototype = new Action();

ActionsSet = function (interalArg, actionsArrayArg)
{
	var self = this;
	
	this.actions = actionsArrayArg;
	this.interval = interalArg;
	this.next = null;
}

