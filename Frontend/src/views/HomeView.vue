<script setup>
import HeaderContent from '../components/Header.vue'
import LectureList from '../components/LectureList.vue'
</script>

<template>
  <HeaderContent/>
  <div class="maincontainer initNowBackground">
    <div>
    <h2><span>Lectures</span></h2>
  </div>
  <div>
    <LectureList />
  </div>
  </div>
  
</template>

<script>
</script>

<style>

h2 span {
  color: black;
  font-weight: 900;
}

.initNowBackground {
  background-image: url(../assets/dull_bg.jpg); 
  background-size: cover;
}

</style>