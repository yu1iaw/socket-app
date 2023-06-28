const { Server } = require("socket.io");
const { addUser, deleteUser, getUser, getUsersInRoom } = require('./users');

const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
})


io.on("connection", (socket) => {

    socket.on("join", ({name, room}, callback) => {
       const { error, user } = addUser({socketId: socket.id, name, room});

       if (error) return callback(error);

       socket.emit('message', { user: "admin", text: `${user.name}, welcome to the room ${user.room}!` });
       socket.broadcast.to(user.room).emit('message', { user: "admin", text: `${user.name} has joined` });

       socket.join(user.room);

       io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

       callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })

        callback();
    })

    socket.on("disconnect", () => {
        const user = deleteUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` })
        }
    })
})


io.listen(5000, () => {
    console.log(`Server has started on port 5000`);
})

