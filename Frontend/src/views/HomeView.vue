<script setup>
import HeaderContent from '../components/Header.vue'
import LectureList from '../components/LectureList.vue'
</script>

<template>
  <HeaderContent/>
  <div class="maincontainer">
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
  color: rgb(54, 122, 247);
  font-weight: 900;
}

</style>