const users = [];

const addUser = ({socketId, name, room}) => {
    if (!socketId || !name || !room) return;

    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find(user => user.room === room && user.name === name);

    if (existingUser) {
        return { error: "Username is taken. Close the dialog box below and try again." };
    }

    const user = { socketId, name, room };
    users.push(user);

    return { user };

}

const deleteUser = (socketId) => {
    if (!socketId) return;

    const index = users.findIndex(user => user.socketId === socketId);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (socketId) => {
    if (!socketId) return;

    return users.find(user => user.socketId === socketId);
}

const getUsersInRoom = (room) => {
    if (!room) return;

    return users.filter(user => user.room === room);
}

module.exports = { addUser, deleteUser, getUser, getUsersInRoom };