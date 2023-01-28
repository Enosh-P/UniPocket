<script setup>
import HeaderContent from '../components/Header.vue'
import QuestionList from '../components/QuestionList.vue'
import axios from "axios"
import Cookies from "js-cookie"
</script>


<template>
  <HeaderContent/>
  <div class="maincontainer">
  <div>
    <h2><span>Questions</span></h2>
    <ul style="list-style-type: none;">
        <div class="row initBackground" v-for="lecture in allLectures">
          <div class="card  mb-3 initNowBackground">
            <h4><span><a style="padding: 3px;" v-bind:href="'/lectures/' + lecture.id">Lecture {{ lecture.id }}</a></span></h4>
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
.initNowBackground {
  background: linear-gradient(to bottom, rgb(185, 206, 244) 0%,rgb(185, 206, 244) 20%), 
  linear-gradient(to left, rgb(185, 206, 244) 0%,rgb(185, 206, 244) 20%);
}
</style>
