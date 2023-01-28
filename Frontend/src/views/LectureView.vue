<script setup>
import HeaderContent from '../components/Header.vue'
import QuestionList from '../components/QuestionList.vue';
import PopUpQuestion from '../components/PopUpQuestion.vue';
import ChatBot from '../components/Chatbox.vue'
import axios from "axios"
import Cookies from 'js-cookie'
import DeleteLQ from '../components/DeleteLQ.vue';
import ResetQuestions from '../components/ResetQuestions.vue';
import PopUpExport from '../components/PopUpExport.vue';
import socket from '../router/socket.listen';
</script>

<template>
  <HeaderContent/>
  <div class="row initBackground" style="display: flex;">
    <div style="flex: 10; margin-top: 1%; margin-left: 2%;" :class="{customFlex: !notAdmin}">
        <div class="d-flex justify-content-end" v-if="iamadmin">
          <DeleteLQ :delID="lecid" :delType="deletetype"/>
          <ResetQuestions :resetID="lecid"/>
          <PopUpExport :LecID="lecid"/>
        </div>
    <div class="row initBackground">
      <div class="card mb-3 initBackground" style="border: none;">
        <div>
          <div>
            <span style="color: darkblue; font-weight: bold; font-size: larger;" >Lecture Title:</span>
            <div  style="display: flex; flex-wrap: wrap; align-items: stretch;">
            <div class="title" style="flex: 10; margin-left: 20px;">{{ lectureItem.name }}</div>
            <template v-if="higher === 'happy'">
              <div class="col-3 d-flex justify-content-end" style="flex: 1;">
                <i class="fas fa-laugh text-warning h1"></i>
              </div>
            </template>
            <template v-else-if="higher === 'neutral'">
              <div class="col-3 d-flex justify-content-end" style="flex: 1;">
                <i class="fas fa-meh text-warning h1"></i>
              </div>
            </template>
            <template v-else-if="higher === 'sad'">
              <div class="col-3 d-flex justify-content-end" style="flex: 1;">
                <i class="far fa-sad-cry text-warning h1"></i>
              </div>
            </template>
            <template v-else>
              <div class="col-3 d-flex justify-content-end" style="flex: 1;">
                <i class="far fa-circle h1"></i>
              </div>
            </template>
            </div>
            <span style="color: darkblue; font-weight: bold; font-size: larger;" >Description:</span>
            <div class="description" style="margin-left: 20px;">{{ lectureItem.description }}</div>
            <div class="d-flex justify-content-end" style="flex: 1; padding: 15px;">
              <i class="fas fa-laugh" @click="happy" :class="{selected: nowHappy}" style="border-radius: 15px; font-size: larger;" ></i>
              <i class="fas fa-meh" @click="neutral" :class="{selected: nowNeutral}" style="border-radius: 15px; font-size: larger;" ></i>
              <i class="fas fa-sad-cry" @click="sad" :class="{selected: nowSad}" style="border-radius: 15px; font-size: larger;"></i>
          </div>
          </div>
        </div>
        </div>
        <div class="card initBackground" style="border: none;">
          <div>
            <span style="color: darkblue; font-weight: bold; font-size: larger;" >Questions:</span>
          </div>
            <div>
              <QuestionList :lecid="lecid"/>
            </div>
        </div>
        <div style="padding: 8px;">
        <div class="d-flex justify-content-end">
          <button type="button" class="btn text-white" style="background-color:darkred; margin: 4px; border-radius: 35px;">
            <i class="fab fa-youtube me-2"></i>
            Live
          </button>
          <PopUpQuestion :lecID="lecid"/>
        </div>
        </div>
    </div>
  </div>
    <div v-if="notAdmin" style="flex: 3">
    <ChatBot :LecID="lecid"/>
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'LecturePage',
  props: {
    lecid: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      nowHappy: false,
      nowSad: false,
      nowNeutral: false,
      nowReact: "Null",
      lectureItem: {},
      moodLecture: {},
      iamadmin: Cookies.get('secret'),
      deletetype: "lectures",
      nowUserID: Cookies.get('uid'),
      notAdmin: Cookies.get('uid') != 0,
      socket: socket
    }
  },
  mounted () {
    if (this.nowUserID){
      axios.get(`http://localhost:8800/users/${this.nowUserID}`)
      .then(response => {
      }, err => {
        Cookies.remove('uid')
        Cookies.remove('name')
        window.location.reload();
      })
    }
    axios.get(`http://localhost:8800/lectures/${this.lecid}`)
    .then(response => {
        this.lectureItem = response.data
      }, err => {
        console.log(err)
      })
    axios.get(`http://localhost:8800/moods/${this.lecid}`)
    .then(response => {
        this.moodLecture = response.data
      }, err => {
        console.log(err)
      })
    axios.get(`http://localhost:8800/moods/${this.lecid}/${this.nowUserID}`)
    .then(response => {
        this.nowReact = response.data.value
        if (this.nowReact === "happy"){
          this.nowHappy = true
          this.nowSad = false
          this.nowNeutral = false
        } else if (this.nowReact === "neutral"){
          this.nowHappy = false
          this.nowSad = false
          this.nowNeutral = true
        }else if (this.nowReact == "sad"){
          this.nowHappy = false
          this.nowSad = true
          this.nowNeutral = false
        } else {
          this.nowHappy = false
          this.nowSad = false
          this.nowNeutral = false
        }
      }, err => {
        console.log(err)
      })
    
    this.socket.on('onAggregatedMoodChanges', data => {
    if (this.moodLecture.lecture === data.lecture){
      this.moodLecture.happy = data.happy
      this.moodLecture.sad = data.sad
      this.moodLecture.neutral = data.neutral
    }
  })

    this.socket.on('onLectureReset', data => {
      window.location.reload()
    })

    this.socket.on('onLectureDelete', data => {
       window.location.replace("/")
    })

  },
  computed: {
    higher: function() {
      if (this.moodLecture.happy === this.moodLecture.neutral && this.moodLecture.neutral == this.moodLecture.sad && this.moodLecture.sad === 0){
        return "Null"
      }else if (this.moodLecture.happy >= this.moodLecture.neutral && this.moodLecture.happy >= this.moodLecture.sad){
        return "happy"
      }else if (this.moodLecture.neutral >= this.moodLecture.sad){
        return "neutral"
      }else {
        return "sad"
      }
    }
  },
  methods: {
    updateReact: function() {
      const bdata = {mood: this.nowReact}
      axios.put(`http://localhost:8800/moods/${this.lecid}/${this.nowUserID}`, bdata)
      .then(response => {
        }, err => {
          console.log(err)
      })
    },
    happy: function() {
      if (this.notAdmin){
      this.nowHappy = true
      this.nowSad = false
      this.nowNeutral = false
      this.nowReact = "happy"
      this.updateReact()
      }
    },
    sad: function() {
      if (this.notAdmin){
      this.nowSad = true
      this.nowNeutral = false
      this.nowHappy = false
      this.nowReact = "sad"
      this.updateReact()
      }
    },
    neutral: function() {
      if (this.notAdmin){
        this.nowNeutral = true
        this.nowSad = false
        this.nowHappy = false
        this.nowReact = "neutral"
        this.updateReact()
      }
    }
  }
}
</script>


<style scoped>
.customFlex{
  margin: 2%;
}
</style>