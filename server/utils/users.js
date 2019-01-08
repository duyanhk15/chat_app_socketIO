class Users {
    constructor(){
        this.listOfUsers = []
    }

    addUser(id, name, room){
        var user = {id, name, room};
        this.listOfUsers.push(user);
    }

    getUserById(id){
        var user = this.listOfUsers.filter(user => user.id === id)[0]
        return user
    }

    removeUser(id){
        var user = this.getUserById(id);
        var theList = this.listOfUsers.filter(user => user.id !== id);
        this.listOfUsers = theList;
        return user;
    }

    getListOfUserInRoom(room){
        var theList = this.listOfUsers.filter(user => user.room === room);
        return theList;
    }
}

module.exports = {
    Users
}