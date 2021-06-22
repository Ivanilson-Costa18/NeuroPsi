var socket = io()

socket.emit("user_connected", sessionStorage.getItem('id'))

socket.on("user_connected", (user) => {
    console.log(user);
})