<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
</script>

<template>
<template v-if="notAdmin">
<div class="card" style="margin-top: 5%; margin-right: 3%; background-color: transparent; border: none;">
  <div class="card-header">
    <h5 class="mb-0" style="color: darkblue; font-weight: bold; font-size: larger;">Chat</h5>
  </div>
  <div class="card-body" data-mdb-perfect-scrollbar="true" style="position: relative; height: 450px">
    <div class="d-flex flex-row justify-content-start">
    <textarea class="form-control" style="border: none; background-color: rgba(255, 255, 255, 0.3)" name="msg" id="readSpace" readonly rows="16"></textarea>
    </div>
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
      dataReceived: ''
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
  },
  methods: {
    getChatdata() {
      var recMsg = document.getElementById("readSpace")
      const bdata={message: this.UserMsg}
      axios.post(`http://localhost:8800/users/${this.userID}/${this.LecID}/chat`, bdata)
      .then(response => {
        recMsg.value += '<span style="color: darkred;">this.userName</span>' + ': '+this.UserMsg + '\n'
        this.UserMsg = ''
        this.dataReceived = response.data
      }, err => {
        console.log(err)
      })
      }
    }
}
</script>