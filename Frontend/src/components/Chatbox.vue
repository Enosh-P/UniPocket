<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
import socket from '../router/socket.listen';
</script>

<template>
<template v-if="notAdmin">
<div class="card" style="margin-top: 5%; margin-right: 3%; background-color: transparent; border: none;">
  <div class="card-header">
    <h5 class="mb-0" style="color: darkblue; font-weight: bold; font-size: larger;">Chat</h5>
  </div>
  <div class="card-body" data-mdb-perfect-scrollbar="true" style="position: relative; height: 450px; overflow: auto;">
    <div class="form-control" style="background-color: transparent; border: none;" id="readSpace"></div>
    </div>
  <div class="card-footer text-muted d-flex justify-content-start align-items-center p-3">
    <input style="border: none; background-color: rgba(255, 255, 255, 0.3)" type="text" v-model="UserMsg" v-on:keydown.enter="getChatdata" class="form-control" id="writingSpace" placeholder="Type message">
  </div>
</div>
</template>
</template>

<script>
export default {
  props: {
    LecID: {
        type: Number,
        required: true
    }
  },
  data: function() {
    return { 
      userName: Cookies.get('name'),
      userID: Cookies.get('uid'),
      notAdmin: Cookies.get('uid') != 0,
      UserMsg: '',
      socket: socket,
    }
  },
  mounted () {
    if (this.userID){
      axios.get(`http://localhost:8800/users/${this.userID}`)
      .then(response => {
      }, err => {
        Cookies.remove('uid')
        Cookies.remove('name')
        window.location.reload();
      })
    }
    this.socket.on("onChatMessage", data =>{
      if (this.LecID == data.lecture){
        const textarea = document.getElementById("readSpace");
        const div = document.createElement("div");
        div.className = "useStylechat"
        const span = document.createElement("span");
        const br = document.createElement("br");
        span.innerText = data.user.name;
        const hue = Math.round((data.user.id / 100) * 360);
        span.style.color = `hsl(${hue}, 100%, 50%)`;
        div.appendChild(span)
        div.innerHTML += ": "+data.message;
        div.appendChild(br);
        textarea.appendChild(div);
      }
    })
  },
  methods: {
    getChatdata() {
      if (this.UserMsg){
      const bdata={message: this.UserMsg}
      axios.post(`http://localhost:8800/users/${this.userID}/${this.LecID}/chat`, bdata)
      .then(response => {
        this.UserMsg = ''
      }, err => {
        console.log(err)
      })
      }
      }
    }
}
</script>

<style>
.useStylechat{
  border: none; 
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}
</style>