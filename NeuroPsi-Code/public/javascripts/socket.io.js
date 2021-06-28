var socket = io()
var sender_id = JSON.parse(sessionStorage.getItem('id')).id_user
var receiver_id = 0


socket.emit("user_connected", JSON.parse(sessionStorage.getItem('id')).id_user)

socket.on("user_connected", (user) => {
    console.log(user);
})

const sendmessage = (tag) => {
    let initial = ""
    var message = document.getElementById('message-input')
    let date = new Date()
    let time = date.toLocaleString('en-us',{ hour: '2-digit', hour12: false }) + ":" + date.toLocaleString('en-us',{ minute: '2-digit' })

    if(tag == "doc"){
        initial = doctor.name_User.split(' ')[0].charAt(0) + ' ' + doctor.name_User.split(' ')[1].charAt(0)
    } else {
        initial = patient.name_User.split(' ')[0].charAt(0) + ' ' + patient.name_User.split(' ')[1].charAt(0)
    }

    socket.emit("send_message", {
        sender: sender_id,
        receiver: receiver_id,
        message: message.value,
        time: time,
      });

    $('#room-'+receiver_id).find(".last-message").html(message.value)
    document.getElementById('messages').innerHTML += '<div class="message">'+
                                                        '<div class="sender" style="background-color: #047bd1">'+ initial +'</div>'+
                                                        '<p class="message-text">'+message.value+'</p>'+
                                                        '<p style="margin-inline-end: 2%;">'+new Date().toLocaleDateString()+ ' '+ time +'</p>'
                                                    '</div>'
    scroll_bottom()
    message.value=""
}

socket.on("new_message", function (data) {
    if(!$('#dmsTab').hasClass('select')) $("#notification-ball").show()
    
    if($('#room-'+data.sender).hasClass('opened')){
        var html = "";
        html += '<div class="message">'+
                    '<div class="sender">'+data.initial+'</div>'+
                    '<p class="message-text">'+data.message+'</p>'+
                    '<p style="margin-inline-end: 2%;">'+new Date().toLocaleDateString()+' '+data.time+'</p>'+
                '</div>';

        document.getElementById("messages").innerHTML += html;
        scroll_bottom();
        $('#room-'+data.sender).find(".last-message").html(data.message)
    } else {
        $('#room-'+data.sender).find(".circle").show()
        $('#room-'+data.sender).find(".last-message").html(data.message)
    }
    
});
