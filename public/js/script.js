
// Get the reference of Socket oi;
const socket = io('/');
// Peer Js 
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
});

myPeer.on('open', id => {
    // Event been emitted by sokect io in server.js. 
    socket.emit('join-room',ROOM_ID, id);
}  );


// Get the Container for the videos. 
const peers = {};
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

// Get the media device.
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then( stream => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
      call.answer(stream);  
      const userVideo = document.createElement('video');
      call.on('stream', userVideoStream => {
        addVideoStream(userVideo, userVideoStream);
      })
    });

    socket.on('user-connected', userId => {
        connectedToNewUser(userId, stream);
    }); 
    
})

socket.on('user-disconnect', userId => {
    console.log(userId);
    if(peers[userId]) peers[userId].close();
})


// function that will set our video and start the play;
function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    } )
    videoGrid.append(video);
}

// Send my stream to user that join the room;
function connectedToNewUser(userId, stream){
    const userVideo = document.createElement('video');
    const call = myPeer.call(userId, stream);
    call.on('stream', userVideoStream => {
        addVideoStream(userVideo, userVideoStream)
    });
    call.on('close', () => {
        userVideo.remove();
    })

    peers[userId] = call;
}