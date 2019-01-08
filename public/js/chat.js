var socket = io();

// khởi tạo kết nối
socket.on('connect', () => {
    console.log("Đã kết nối đến server");

    // gửi thông tin từ phía client đến server
    // socket.emit('createMessage',{
    //     from: "send from client",
    //     text:"Đã gửi thành công đến server",
    //     createAt: new Date()
    // })

    socket.emit('Join',{
        params: $.deparam(window.location.search)
    })
})

// client nhận thông tin từ phía server
socket.on('newMessage', (msg) => {
    // console.log("New message: ",msg);
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
        text: msg.text,
        from: msg.from,
        createAt: moment(msg.createAt).format('h:mm a')
    })
    $('#messages').append(html);

    // var formattedTime = moment(msg.createAt).format('h:mm a');
    // var li = $('<li></li>');
    // li.text(`${msg.from} ${formattedTime}: ${msg.text}`);
    // $('#messages').append(li);
});

socket.on('newLocationMessage', (msg)=>{

    var template = $('#location-message-template').html();
    var html = Mustache.render(template,{
        url: msg.url,
        from: msg.from,
        createAt: moment(msg.createAt).format('h:mm a')
    })
    $('#messages').append(html);

    // console.log(msg);
    // var li = $('<li></li>');
    // var formattedTime = moment(msg.createAt).format('h:mm a');
    // var a = $('<a target="_blank" style="text-decoration: none;"> Vị trí của tôi</a>');
    // li.text(`${msg.from} ${formattedTime}: `);
    // a.attr('href',msg.url);
    // li.append(a);
    // $('#messages').append(li);
})

socket.on('usersInRoom',(msg)=>{
    var users = msg.usersInRoom;
    console.log(users);
    var ol = $('<ol></ol>')
    users.forEach(user => {
        var li = $('<li></li>');
        li.text(user.name);
        ol.append(li);
    })
    $('#users').html(ol);
})

// đóng kết nối
socket.on('disconnect', () => {
    console.log("Đã ngắt kết nối đến server");
})

socket.emit('createMessage',{
    from: '',
    text: ''
}, (data)=>{
    console.log('Successfully: ',data);
})

$('#message-form').on('submit',(event)=>{
    event.preventDefault();

    socket.emit('createMessage',{
        from: $.deparam(window.location.search).name,
        text: $('[name=message]').val()
    }, (data)=>{
        console.log('Successfully: ',data),
        $('[name=message]').val("")
    })

})

$('#send-location').on('click', () => {
    if(!navigator.geolocation){
        return alert('Không thể hiển thị tọa độ trên trình duyệt này');
    } else {
        navigator.geolocation.getCurrentPosition(position => {
            socket.emit('createLocationMessage',{
                from: $.deparam(window.location.search).name,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        }, ()=>{
            alert('Không thể truy cập vị trí của bạn');
        })
    }
})

// var objDiv = $(".chat__messages");
// var h = objDiv.get(0).scrollHeight;
// objDiv.animate({scrollTop: h});


