<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
</script>

<template>
  <div v-if="showsnotifier" class="fixed-top text-center">
    <p class="notifier">{{errorMsg}}</p>
  </div>
  <button @click="deleteLQ" type="button" class="btn btn-outline-danger btn-floating changescale" data-mdb-ripple-color="dark" style="margin: 2px;">
      <i v-bind:title="title" class="fas fa-trash-alt"></i>
  </button>
</template>

<script>
export default {
  props: {
    delID: {
        type: Number,
        required: true
    },
    delType: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      errorMsg: '',
      title: "Detele "+this.delType,
      secret: Cookies.get('secret'),
      userID: Cookies.get('uid'),
      showsnotifier: false
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
  },
  methods: {
    deleteLQ () {
      const bdata = {"secret": this.secret}
      if (this.delType === 'lectures'){
        axios.delete(`http://localhost:8800/lectures/${this.delID}`, { data: bdata })
        .then(response => {
          this.errorMsg = `Deleted Lecture ${this.delID} Successfully.`
          this.showsnotifier = true;
          setTimeout(() => {
            this.showsnotifier=false
            this.errorMsg = ''
          }, 2000);
        }, err => {
          this.errorMsg = `Lecture ${this.delID} cannot be deleted.`
          this.showsnotifier = true;
          setTimeout(() => {
            this.showsnotifier=false
            this.errorMsg = ''
          }, 2000);
          console.log(err)
        })
      }else if (this.delType === 'questions'){
        axios.delete(`http://localhost:8800/questions/${this.delID}`, { data: bdata })
        .then(response => {
          this.errorMsg = `Deleted Question ${this.delID} Successfully.`
          this.showsnotifier = true;
          setTimeout(() => {
            this.showsnotifier=false
            this.errorMsg = ''
          }, 2000);
        }, err => {
          this.errorMsg = `Question ${this.delID} cannot be deleted.`
          this.showsnotifier = true;
          setTimeout(() => {
            this.showsnotifier=false
            this.errorMsg = ''
          }, 2000);
          console.log(err)
        })
      }
    }
  }
}
</script>

<style>
.notifier {
  color: rgb(129, 15, 15);
  padding: 16px;
  font-weight: bolder;
}
</style>