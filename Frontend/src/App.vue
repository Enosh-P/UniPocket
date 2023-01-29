<script setup>
import { RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
</script>

<template>
  <div style="flex: 1">
  <RouterView />
  </div>
</template>


<style>
.maincontainer{
  background-color: rgb(176, 226, 243);
  border-radius: 40px;
  box-sizing: border-box;
  padding:50px;
  margin: 1%;
}

.titlecase {
  text-transform:capitalize;
  }

.hover-blue{
  border-radius: 15px;
  background-color: darkblue;
}

.large-textarea {
    height: 400px;
    width: 465px;
  }

.medium-textarea {
  height:60vh;
  width: 200px;
}

.initBackground {
  background: linear-gradient(to bottom, rgb(159, 191, 249) 0%,rgb(159, 191, 249) 20%), 
  linear-gradient(to left, rgb(159, 191, 249) 0%,rgb(159, 191, 249) 20%);
}

.changeBackground {
  border-radius: 40%;
  background-color: transparent;
  border: none;
}

.changeBackground:hover{
  background-image: url(./assets/bg-more.jpg);
  background-size: cover;
  font-weight: bold;
  color: black;
}
</style>
