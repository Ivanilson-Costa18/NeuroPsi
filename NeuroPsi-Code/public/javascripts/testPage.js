var default_figure

//Set page on full screen, Display instructions
const fullScreen = async () =>{
    document.getElementById('main').requestFullscreen()
    document.getElementById('play').style = 'display: none'
    document.getElementById('instructions').style  = 'display: block'
	document.getElementById('canvas-example').width = document.getElementById('instructions').offsetWidth * 0.5
	document.getElementById('canvas-example').height = document.getElementById('instructions').offsetHeight * 0.5

	let time = sessionStorage.getItem("time");
	document.getElementById('disclaimer').innerHTML = time == 0 ? 'In this test the image will be available through out the whole test duration.' : 'In this the test the image will disappear after '+time+'minutes.'
    default_figure = await $.ajax({
        url: 'api/figures/1',
        method: 'get',
        dataType: 'json'
    })

    serializedJSON = default_figure[0].FigureJSON
    let drawing = new RecordableDrawing("canvas-example");

    var result = deserializeDrawing(serializedJSON);
    drawing.recordings = result;
        for (var i = 0; i < result.length; i++)
            result[i].drawing = drawing;
        playRecordings();
	
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
}

//Begin test and start recording
const start = () => {
	let time = sessionStorage.getItem("time");

    document.getElementById('instructions').style  = 'display: none'
    document.getElementById('canvas-container').style = 'display: block'
	
	document.getElementById('canvas1').width = document.getElementById('canvas-container').offsetWidth * 0.5
	document.getElementById('canvas1').height = document.getElementById('canvas-container').offsetHeight * 0.5
		
	drawing = new RecordableDrawing("canvas1");
		
	startRecording();
	
	function startRecording()
	{	
		drawing.startRecording();
	}
	console.log(time);
	if(time > 0){
		console.log('here')
		window.setTimeout('$( document ).ready(function() {'+
							'setInterval(function(){'+
							'opacity = $("#rey-figure").css("opacity");'+
							'opacity = Number(opacity) -0.01;'+
							'$("#rey-figure").css("opacity", opacity);'+
							'}, 100);'+
							'setInterval(function(){'+
							'opacity = $("#rf-disclaimer").css("opacity");'+
							'opacity = Number(opacity) +0.01;'+
							'$("#rf-disclaimer").css("opacity", opacity);'+
							'}, 100);'+
						'});',3000)//Change to time*1000 after demo
	}
}
//Stop recording, serialize drawing, submit, redirect to profile
const submitDrawing = async () => {
	let id_test = sessionStorage.getItem('id_test')
	drawing.stopRecording();
    let actionsSet = serializeDrawing(drawing)
	if (confirm('Do you wish to submit the test?')) {
		figure = await $.ajax({
			url: 'api/figures/',
			method: 'post',
			dataType: 'json',
			data: {"testID": id_test, "actions": actionsSet}
	})
	} else {
		document.requestFullscreen() 
		drawing.clearCanvas()
	}
	window.location = 'patientPage.html'
}
