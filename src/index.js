import Scene from './scene';
import * as THREE from 'three';
import { Material } from '../public/js/bundle';

//A socket.io instance
//const socket = io();
var socket=io();


var loader = new THREE.TextureLoader();

const material1 = new THREE.MeshBasicMaterial({
  map: loader.load("bgimage.png", undefined, undefined, function(err) {
      alert('Error');
  }),
});


const material2= new THREE.MeshBasicMaterial({
  map: loader.load("pink.png", undefined, undefined, function(err) {
      alert('Error');
  }),
});


const material3 = new THREE.MeshBasicMaterial({
  map: loader.load("blue.png", undefined, undefined, function(err) {
      alert('Error');
  }),
});




const arr=[material1,material2,material3];

//One WebGL context to rule them all !
let glScene = new Scene();
let id;
let instances = [];
let clients = new Object();


//user move 보내 유저들한테. 다른 카메라 움직임을?? ㅇㅇ 유저움직임이랑 카메라랑 같을거니까.
//아 아닌가. 카메라 위치인가.

glScene.on('userMoved', ()=>{
  
  socket.emit('move', [glScene.camera.position.x, glScene.camera.position.y, glScene.camera.position.z]);


}




);




//아 이건 클라이언트가 받아오는거고. 누가 보냄.
//On connection server sends the client his ID
socket.on('introduction', (_id, _clientNum, _ids)=>{
  var realname;
  var number;
  var name;

 // var geometry;
  




  var w1=Math.random();

  for(let i = 0; i < _ids.length; i++){
    if(_ids[i] != _id){
      clients[_ids[i]] = {
        mesh: new THREE.Mesh(
        //  new THREE.BoxGeometry(w1,w1,w1),
         // new THREE.MeshNormalMaterial()
         new THREE.BoxGeometry(w1,w1,w1),arr[Math.floor(Math.random()*arr.length)])
        
        

        

      }

      //Add initial users to the scene
      glScene.scene.add(clients[_ids[i]].mesh);
    }
  }

  

  id = _id;
  console.log('My ID is: ' + id);

});


socket.emit("hh","stranger");

socket.on('newUserConnected', (clientCount, _id, _ids)=>{
  console.log(clientCount + ' clients connected');
  let alreadyHasUser = false;
  for(let i = 0; i < Object.keys(clients).length; i++){
    if(Object.keys(clients)[i] == _id){
      alreadyHasUser = true;
      break;
    }
  }

  
  var w1=Math.random()*1.5;
  if(_id != id && !alreadyHasUser){
    console.log('A new user connected with the id: ' + _id);
    clients[_id] = {
      mesh: new THREE.Mesh(
        new THREE.BoxGeometry(w1,w1,w1),arr[Math.floor(Math.random()*arr.length)])
      
    }

    //Add initial users to the scene
    glScene.scene.add(clients[_id].mesh);
  }

});

socket.on('userDisconnected', (clientCount, _id, _ids)=>{
  //Update the data from the server
  //text받아와
  document.getElementById('numUsers').textContent = clientCount;

  if(_id != id){
    console.log('A user disconnected with the id: ' + _id);
   // glScene.scene.remove(clients[_id].mesh);
    delete clients[_id];
  }
});

/* 서버로부터 데이터 받은 경우 */


socket.on('connect', ()=>{



});

//Update when one of the users moves in space
socket.on('userPositions', _clientProps =>{
  // console.log('Positions of all users are ', _clientProps, id);
  // console.log(Object.keys(_clientProps)[0] == id);
  for(let i = 0; i < Object.keys(_clientProps).length; i++){
    if(Object.keys(_clientProps)[i] != id){

      //Store the values
      let oldPos = clients[Object.keys(_clientProps)[i]].mesh.position;
      let newPos = _clientProps[Object.keys(_clientProps)[i]].position;

      //Create a vector 3 and lerp the new values with the old values
      let lerpedPos = new THREE.Vector3();
      lerpedPos.x = THREE.Math.lerp(oldPos.x, newPos[0], 0.3);
      lerpedPos.y = THREE.Math.lerp(oldPos.y, newPos[1], 0.3);
      lerpedPos.z = THREE.Math.lerp(oldPos.z, newPos[2], 0.3);

      //Set the position
      clients[Object.keys(_clientProps)[i]].mesh.position.set(lerpedPos.x, lerpedPos.y, lerpedPos.z);
    }
  }
});

