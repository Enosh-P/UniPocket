<script setup>
import LectureItem from "./LectureItems.vue"
import Cookies from 'js-cookie'
import PopUpAdd from './PopUpAdd.vue'
import axios from "axios";
import socket from "../router/socket.listen";
</script>

<template>
    <div class="d-flex justify-content-end" v-if="iamadmin" style="margin: 15px;">
      <PopUpAdd/>
    </div>
    <div>
        <ul style="list-style-type: none;">
            <LectureItem v-for="lecture in allLectures" :lecture="lecture" />
        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {
            iamadmin: Cookies.get('secret'),
            allLectures: [],
            userID: Cookies.get('uid'),
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
    this.getLectures()
    this.socket.on('onLectureCreate', data => {
      this.getLectures()
    })
    },
    methods: {
      async  getLectures() {
      try {
          const lectureResponse = await axios.get(`http://localhost:8800/lectures`);
          this.allLectures = lectureResponse.data
        } catch (err) {
          console.log(err);
        }
    }
    }
}
</script>

<style scoped>

</style>