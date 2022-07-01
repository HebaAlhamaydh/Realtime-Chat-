//array
const users=[];

//15.join user to chat 
function userJoin(id,username,room){
    //user its object contain {id,username,room}
    const user={id,username,room};
    users.push(user);
    return user;
}

//16.get current user
function getCurrentUser(id){
    return users.find(user=>user.id==id);
}

////19.user leave chat
function userLeave(id){
    const index=users.findIndex(user=>user.id==id);
    if(index!==-1){
        return users.splice(index,1)[0];    
    }
}
///20.get all users in the room
function getRoomUsers(room){
    return users.filter(user=>user.room===room);
}
module.exports ={
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};