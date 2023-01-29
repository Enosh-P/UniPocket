<script setup>
import DeleteLQ from '../components/DeleteLQ.vue'
import ResetQuestions from './ResetQuestions.vue';
import Cookies from 'js-cookie'
import axios from 'axios';
import PopUpExport from './PopUpExport.vue';
import socket from '../router/socket.listen'
</script>

<template>
  <template v-if="showLecture">
    <li>
      <div class="row">
      <div class="container" style="background-color: rgba(255, 255, 255, 0.45); display: flex; flex-wrap: wrap; align-items: stretch; border-radius: 4%;">
        <div style="flex: 1;">
          <i class="fas fa-laugh changescale" @click="happy" :class="{selected: nowHappy}" style="border-radius: 15px; font-size: larger;" ></i>
          <i class="fas fa-meh changescale" @click="neutral" :class="{selected: nowNeutral}" style="border-radius: 15px; font-size: larger;" ></i>
          <i class="fas fa-sad-cry changescale" @click="sad" :class="{selected: nowSad}" style="border-radius: 15px; font-size: larger;"></i>
        </div>
        <div class="accordion accordion-borderless" :id="id1" style="flex: 13; height: max-content; background-color: transparent; ">
  <div class="accordion-item" style="background-color: transparent; ">
    <h2 class="accordion-header" :id="id3">
      <button class="accordion-button" style="background-color: transparent;" type="button" data-mdb-toggle="collapse"
        :data-mdb-target="id2h" aria-expanded="true" :aria-controls="id2">
        <span class="changescale" style="color: black; font-weight: bolder;">
        {{ lecture.name }}</span>
      </button>
    </h2>
    <div :id="id2" class="accordion-collapse collapse show"
      :aria-labelledby="id3" :data-mdb-parent="id1h">
      <div class="accordion-body">
        {{ lecture.description }}
        <div style="padding: 3px;">
        <a class="btn-success btn-rounded" style="padding: 3px; text-decoration: none; margin-right: 1px;" v-bind:href="'/lectures/' + lecture.id">More</a>
        <template v-if="iamnotadmin">
        <a class="btn-primary btn-rounded" style="padding: 3px; text-decoration: none; margin-right: 1px;" v-bind:href="'/lectures/' + lecture.id">Chat</a>
        </template>
        </div>
        </div>
        </div>
        </div>
        </div>
        <template v-if="higher === 'happy'">
        <div style="flex: 1;">
        <i class="fas fa-laugh text-warning h1" style="margin: 2px;"></i>
        </div>
        </template>
        <template v-else-if="higher === 'neutral'">
        <div style="flex: 1;">
        <i class="fas fa-meh text-warning h1" style="margin: 2px;"></i>
        </div>
        </template>
        <template v-else-if="higher === 'sad'">
        <div style="flex: 1;">
        <i class="far fa-sad-cry text-warning h1" style="margin: 2px;"></i>
        </div>
        </template>
        <template v-else>
        <div style="flex: 1;">
        <i class="far fa-circle h1" style="margin: 2px;"></i>
        </div>
        </template>
        <div v-if="iamadmin" style="flex: 1; margin-bottom: 3%;">
          <DeleteLQ :delID="lecture.id" :delType="deltype"/>
          <ResetQuestions :resetID="lecture.id"/>
          <PopUpExport :LecID="lecture.id"/>
        </div>
      </div>        
    </div>
    </li>
  </template>
</template>

<script>
export default {
  props: ['lecture'],
  data: function() {
    return {
      nowHappy: false,
      nowSad: false,
      nowNeutral: false,
      nowReact: "Null",
      iamadmin: Cookies.get('secret'),
      iamnotadmin: !Cookies.get('secret'),
      moodLecture: {},
      userID: Cookies.get('uid'),
      showLecture: true,
      deltype:"lectures",
      socket: socket
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
    axios.get(`http://localhost:8800/moods/${this.lecture.id}`)
    .then(response => {
        this.moodLecture = response.data
      }, err => {
        console.log(err)
      })
    axios.get(`http://localhost:8800/moods/${this.lecture.id}/${this.userID}`)
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
  this.socket.on('onLectureDelete', data => {
    if (this.lecture.id === data.id){
      this.showLecture=false
    }
    })
  },
  computed: {
    id1() {
        return "accordionFlushEx"+this.lecture.id
    },
    id1h() {
        return "#accordionFlushEx"+this.lecture.id
    },
    id2() {
        return "flush-collapseO"+this.lecture.id
    },
    id2h() {
        return "#flush-collapseO"+this.lecture.id
    },
    id3() {
        return "flush-headingO"+this.lecture.id
    },
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
      axios.put(`http://localhost:8800/moods/${this.lecture.id}/${this.userID}`, bdata)
      .then(response => {
        }, err => {
          console.log(err)
      })
    },
    happy: function() {
      if (!this.iamadmin){
      this.nowHappy = true
      this.nowSad = false
      this.nowNeutral = false
      this.nowReact = "happy"
      this.updateReact()
      }
    },
    sad: function() {
      if (!this.iamadmin){
      this.nowSad = true
      this.nowNeutral = false
      this.nowHappy = false
      this.nowReact = "sad"
      this.updateReact()
      }
    },
    neutral: function() {
      if (!this.iamadmin){
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

<style>

.selected {
  background-color: black;
  color: yellow;
}

.changescale{
  background-color: transparent;
}

.changescale:hover{
  transform: scale(1.25);
}

</style>