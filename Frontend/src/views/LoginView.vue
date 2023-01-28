<script setup>
import Cookies from 'js-cookie'
import axios from 'axios'
</script>

<template>
    <div class="logincontainer">
    <!-- Pills navs -->
    <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
      <li class="nav-item" role="presentation">
        <a class="nav-link active" id="tab-login" data-mdb-toggle="pill" href="#pills-login" role="tab"
          aria-controls="pills-login" aria-selected="true">USER</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="tab-register" data-mdb-toggle="pill" href="#pills-register" role="tab"
          aria-controls="pills-register" aria-selected="false">ADMIN</a>
      </li>
    </ul>
<!-- Pills navs -->

<!-- Pills content -->
<div class="tab-content">
  <div class="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
    <form @submit.prevent="submitUserForm"> 
      <!-- Email input -->
      <div class="form-outline mb-4">
        <input v-model="username" type="text" id="loginName" class="form-control" />
        <label class="form-label" for="loginName">Username</label>
      </div>

      <p class="text-center text-danger error" v-if="errorMessage" >{{ errorMessage }}</p>

      <!-- Submit button -->
      <div class="text-center">
      <button type="submit" class="btn btn-success btn-center"><span class="titlecase">Sign in</span></button>
      </div>

    </form>
  </div>
  <div class="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
    <form @submit.prevent="submitAdminForm">
      <!-- Username input -->
      <div class="form-outline mb-4">
        <input v-model="username" type="text" id="loginName" class="form-control" />
        <label class="form-label" for="loginName">Username</label>
      </div>

      <!-- Password input -->
      <div class="form-outline mb-4">
        <input v-model="password" type="password" id="adminPassword" class="form-control" />
        <label class="form-label" for="adminPassword">Password</label>
      </div>

      <p class="text-center text-danger error" v-if="errorMessage" >{{ errorMessage }}</p>

      <!-- Submit button -->
      <div class="text-center">
      <button type="submit" class="btn btn-success btn-center"><span class="titlecase">Sign in</span></button>
      </div>
    </form>
  </div>
</div>
        
</div>
<!-- Pills content -->
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      secret: '',
      errorMessage: '',
      uid: 1
    }
  },
  methods: {
    submitAdminForm() {
      const bdata = {
        user: this.username, 
        pass: this.password 
      }
      axios.post(`http://localhost:8800/secret`, bdata)
      .then(response => {
        this.password = ''
        this.secret = response.data.secret
        Cookies.set('name', this.username)
        Cookies.set('secret', this.secret)
        Cookies.set('uid', Number(this.uid)-1)
        window.location.reload();
      }, err => {
        this.errorMessage = "Incorrect Credentials! Try Again!"
        setTimeout(() => {
            this.errorMessage = '';
          }, 4000)
        console.log(err)
      })
    },
    submitUserForm() {
      if (this.username === 'admin'){
      this.errorMessage = "You cant be Admin :/"
      setTimeout(() => {
          this.errorMessage = '';
          this.username = '';
        }, 4000);
      }else{
      const data = {
        name: this.username 
      }
      axios.post(`http://localhost:8800/users`, data)
      .then(response => { 
        this.uid = response.data.id
        Cookies.set('name', this.username)
        Cookies.set('uid', Number(this.uid))
        window.location.reload();
      }, err => {
        this.errorMessage = "Something went wrong! Try Again!"
        setTimeout(() => {
            this.errorMessage = '';
          }, 4000)
        console.log(err)
      })
      }
    }
  }
}
</script>

<style scoped>
.logincontainer{
  background-color: rgb(240, 243, 244);
  border-radius: 40px;
  box-sizing: border-box;
  padding:50px;
  margin-top: 5%;
  margin-left: 35%;
  margin-right: 35%;
  margin-bottom: 20%;
}

.error {
  transition: opacity 0.5s ease-in-out;
  opacity: 1;
}
.error.fade-out {
  opacity: 0;
}
</style>