
var recorder
var matrix_example = []
var matrix = []
var startTime
var actionsSet = {
    actions: [
    ] 
}

window.onload = () => {
    $("#image-example").attr('src', "./images/external-content.duckduckgo - Copy.jpg")
    let puzzle_board = document.getElementById('board-example')
    let puzzle_width = puzzle_board.offsetWidth
    let puzzle_height = puzzle_board.offsetHeight
    let html = ''
    let cols = 3
    let rows = 3
    let count = 1
    for(let i = 0; i < rows; i++){
        let row = []
        for(let j = 0; j < cols; j++){
            if(i == rows-1 && j == cols-1){
                row.push('empty')
                html += '<div class="piece empty" id="example-empty" style="top:'+i*puzzle_height/rows+';left: '+j*puzzle_width/cols+'; width: '+puzzle_width*0.99/cols+'; height: '+puzzle_height*0.99/rows+'"></div>'
            } else {
                row.push(count)
                html += '<div class="piece" id="example-'+count+'" style="top:'+i*puzzle_height/rows+';left: '+j*puzzle_width/cols+'; width: '+puzzle_width*0.99/cols+'; height: '+puzzle_height*0.99/rows+'" onclick="swap_example('+count+')"></div>'
                count++
            }
        }
        matrix_example.push(row)
    }
    puzzle_board.innerHTML += html


    $("#startBtn").click(()=>{
        $("#start-view").hide();
        $("#test-view").show()
        showTest();
        startTime = new Date().getTime()
    })
}

function getIndexOfJ(array, j) {
    for (var y = 0; y < array.length; y++) {
        var x = array[y].indexOf(j);
        if (x > -1) {
            return [x, y];
        }
    }
}

const swap_example = (id) => {
        let piece = $('#example-'+id)
        let position = getIndexOfJ(matrix_example, id)

        let empty_piece = document.getElementById('example-empty')
        let empty = getIndexOfJ(matrix_example, 'empty')

        if((position[0]  == empty[0] && position[1]-1 == empty[1]) || (position[0]  == empty[0] && position[1]+1 == empty[1]) || (position[0]-1  == empty[0] && position[1] == empty[1]) || (position[0]+1  == empty[0] && position[1] == empty[1])){
            matrix_example[empty[1]][empty[0]] = id
            matrix_example[position[1]][position[0]] = 'empty'

            let new_x = piece.position().left
            let new_y = piece.position().top

            piece.animate({left: empty_piece.style.left, top: empty_piece.style.top}, 150)

            empty_piece.style.left = new_x
            empty_piece.style.top = new_y
        }
}

const swap = (id) => {
    console.log(id);
    let piece = $('#'+id)
    let position = getIndexOfJ(matrix, id)

    let empty_piece = document.getElementById('empty')
    let empty = getIndexOfJ(matrix, 'empty')

    if((position[0]  == empty[0] && position[1]-1 == empty[1]) || (position[0]  == empty[0] && position[1]+1 == empty[1]) || (position[0]-1  == empty[0] && position[1] == empty[1]) || (position[0]+1  == empty[0] && position[1] == empty[1])){
        matrix[empty[1]][empty[0]] = id
        matrix[position[1]][position[0]] = 'empty'

        let new_x = piece.position().left
        let new_y = piece.position().top

        piece.animate({left: empty_piece.style.left, top: empty_piece.style.top}, 150)

        empty_piece.style.left = new_x
        empty_piece.style.top = new_y
        if(startTime){
            let interval = new Date().getTime() - startTime;
            startTime = new Date().getTime()
            saveMove(id, interval)
        } 
    }
}

const showTest = async () => {
    recorder = await recordAudio()
    recorder.start()
    let configuration = JSON.parse(sessionStorage.getItem('test_configuration'))
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


const saveMove = (piece_id, interval) => {
    actionsSet.actions.push({piece_id: piece_id, interval: interval})
}

const completeTest = async () => {
    const audio = await recorder.stop()
    const reader = new FileReader();
    reader.readAsDataURL(audio.audioBlob);
    reader.onload = async () => {
        const base64AudioMessage = reader.result.split(',')[1];
        try{
            await $.ajax({
                url: 'api/moves/',
                method: 'post',
                dataType: 'json',
                data: {
                    "ID_Test": sessionStorage.getItem('id_test'),
                    "Moves": JSON.stringify(actionsSet),
                    "audio": JSON.stringify({audio: base64AudioMessage, type: "audio/webm"})
                }
            })
        } catch (error) {
            console.log(error)
        }
        window.location = "patientPage.html"
    }
}

const recordAudio = () => {
    return new Promise(resolve => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          const audioChunks = [];
  
          mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
          });
  
          const start = () => {
            mediaRecorder.start();
          };
  
          const stop = () => {
            return new Promise(resolve => {
              mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                const play = () => {
                  audio.play();
                };
  
                resolve({ audioBlob, audioUrl, play });
              });
  
              mediaRecorder.stop();
            });
          };
  
          resolve({ start, stop });
        });
    });
  };