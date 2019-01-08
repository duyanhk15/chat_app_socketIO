// tìm hiểu __dirname
// built-in {path, http} có sẵn trong node js

const path = require('path');
const express = require('express');
const publicPath = path.join(__dirname + "./../public");
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');
const http = require('http');
const generateMessage = require('./utils/message').generateMessage;
const generateLocationMessage = require('./utils/message').generateLocationMessage;
const { Users } = require('./utils/users.js');

// console.log(__dirname+"./../public");
// console.log(path.join(__dirname+"./../public"))

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();


app.use(express.static(publicPath));

// khởi tạo kết nối
io.on('connection', (socket) => {
    console.log("new user connect");

    // gửi thông tin từ phía server đến client đang tương tác với server
    //socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))

    // chỉ gửi thông tin đến những client đang không tương tác với server
    //socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

    socket.on('Join', (join) => {
        socket.join(join.params.room)

        users.addUser(socket.id, join.params.name, join.params.room)
        io.to(join.params.room).emit('usersInRoom', {
            usersInRoom: users.getListOfUserInRoom(join.params.room)
        })
        

        // gửi thông tin từ phía server đến client đang tương tác với server
        socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${join.params.room} room`))

        // chỉ gửi thông tin đến những client đang không tương tác với server
        socket.broadcast.to(join.params.room).emit('newMessage', generateMessage('Admin', `New ${join.params.name} joined`))
    })

    // nhận thông tin từ phía client
    socket.on('createMessage', (msg, callback) => {
        // console.log("New message from client: ", msg)

        // phương thức socket chỉ hoạt động đối với client đang tương tác với server
        // ta dùng phương thức io khi 1 client gửi thông tin đến server
        // và từ server gửi đến các client còn lại (client không tương tác với sevrer)
        // io.emit('newMessage', {
        //     from: msg.from,
        //     text: msg.text
        // })

        var user = users.getUserById(socket.id);
        io.to(user.room).emit('newMessage', generateMessage(msg.from, msg.text));
        callback('Tin nhắn đã được gửi');
    })

    socket.on('createLocationMessage', (msg) => {
        var user = users.getUserById(socket.id);
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(msg.from, msg.latitude, msg.longitude))
    })

    // đóng kết nối
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('usersInRoom', {
                usersInRoom: users.getListOfUserInRoom(user.room)
            });
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} đã rời khỏi phòng chat`));
        }

        console.log("User was disconnected");
    })
})


server.listen(port, () => {
    console.log("Server is running on port: ", `${port}`);
})