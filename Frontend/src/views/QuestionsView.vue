<script setup>
import HeaderContent from '../components/Header.vue'
import QuestionList from '../components/QuestionList.vue'
import axios from "axios"
import Cookies from "js-cookie"
</script>


<template>
  <HeaderContent/>
  <div class="maincontainer initNowBackground">
  <div>
    <h2><span>Questions</span></h2>
    <ul style="list-style-type: none;">
        <div class="row" v-for="lecture in allLectures">
          <div class="card  mb-3" style="background-color: rgba(255, 255, 255, 0.2); border: none;">
            <h4><span><a style="padding: 3px;" v-bind:href="'/lectures/' + lecture.id"><button  class="btn changeNowBackground">Lecture {{ lecture.id }}</button></a></span></h4>
            <QuestionList :lecid="lecture.id"/>
          </div>
        </div>
    </ul>
  </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      allLectures: [],
      nowUserID: Cookies.get('uid')
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
  axios.get(`http://localhost:8800/lectures`)
  .then(response => {
      this.allLectures = response.data
  }, err => {
      console.log(err)
    })
  }
}

</script>
<style scoped>

.changeNowBackground {
  border-radius: 40%;
  background-color: transparent;
  font-weight: bold;
  box-shadow: 20%;
  color: black;
  border: none;
}

.changeNowBackground:hover{
  transform: scale(1.25);
  font-weight: bold;
  color: black;
}

</style>
