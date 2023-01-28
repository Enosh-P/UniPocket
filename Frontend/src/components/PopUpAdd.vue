<script setup>
import Cookies from 'js-cookie'
import axios from 'axios'
</script>

<template>
<button type="button" class="btn btn-outline-success" style="margin: 4px; border-radius: 35px;" data-mdb-ripple-color="dark" data-toggle="modal" data-target="#Modal1">Add New Lecture</button>

<div class="modal fade" id="Modal1" tabindex="-1" role="dialog" aria-labelledby="Modal1Label" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="Modal1lLabel">Add Lecture</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="col-form-label">Title:</label>
            <input v-model="lecTitle"  type="text" class="form-control" id="recipient-name" placeholder="Enter Lecture Name">
          </div>
          <div class="form-group">
            <label for="message-text" class="col-form-label">Description:</label>
            <textarea class="large-textarea form-control" v-model="lecDesc" id="message-text" rows="5" placeholder="Enter Lecture description"></textarea>
          </div>
          
      <p class="text-center text-danger error" v-if="errorMessage" >{{ errorMessage }}</p>
      <p class="text-center text-success success" v-if="successMsg" >{{ successMsg }}</p>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button @click="addLecture" type="button" class="btn btn-primary">Add</button>
      </div>
    </div>
  </div>
</div>  
</template>

<script>
export default {
  data() {
    return {
      secret: Cookies.get('secret'),
      user: Cookies.get('name'),
      userID: Cookies.get('uid'),
      lecTitle: '',
      lecDesc: '',
      errorMessage: '',
      successMsg: ''
    }
  },
  methods: {
    addLecture() {
      if (!this.lecTitle){
        this.errorMessage = 'Opps!! Cannot Add Empty Lecture!'
        setTimeout(() => {
            this.errorMessage = '';
          }, 1000)
      }else{
        const bdata = {
        secret: this.secret, 
        name: this.lecTitle,
        description: this.lecDesc
      }
      axios.post(`http://localhost:8800/lectures`, bdata)
      .then(response => {
        this.lecTitle = ''
        this.lecDesc = ''
        this.successMsg = "Lecture added successfully!"
        setTimeout(() => {
            this.successMsg = '';
          }, 2000)
      }, err => {
        this.errorMessage = "Lecture cant be added! Try Again!"
        setTimeout(() => {
            this.errorMessage = '';
          }, 2000)
        console.log(err)
      })
      }
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
  }
}
</script>

<style>
</style>