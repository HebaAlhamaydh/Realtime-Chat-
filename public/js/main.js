const chatForm=document.getElementById('chat-form')
const chatMessages= document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users')

//12.get user name and room from URL
const {username,room}=Qs.parse(location.search,{
    //ignore ? and = and /
    ignoreQueryPrefix:true
});

const socket=io();

//13. join chat room come from url {username,room} 
socket.emit('joinRoom',{username,room});

//24.get room and users 
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})

//3./9./message from server//(message) its object return from formatMessage function 
socket.on('message',message=>{
    console.log(message);
    //10.1
    outputMessage(message);
    //10.3 scroll down from chat messages
    chatMessages.scrollTop=chatMessages.scrollHeight;
});

//6.1 Message submit
chatForm.addEventListener('submit',(e)=>{
e.preventDefault();
//6.2 get message textfrom text input(acess element in form chat)
const msg=e.target.elements.msg.value;
//7.1 Emit message to server
socket.emit('chatMessage',msg);
//7.2 clear input
e.target.elements.msg.value='';
//focus in empty input مؤشر الكتابة 
e.target.elements.msg.focus();
});


//10.2 output message to dom//(message) its object return from formatMessage function
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML =`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    //put it in dom class name from chat html<div class="chat-messages">
    document.querySelector('.chat-messages').appendChild(div);
}

///25.add room name to dom
function outputRoomName(room){
roomName.innerText=room;
}

//26.add user to dom
function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;

}