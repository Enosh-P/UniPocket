<script setup>
import axios from 'axios'
import Cookies from 'js-cookie'
</script>

<template>
  <div v-if="shownotifier" class="fixed-top text-center">
    <p class="notifier">{{errorMsg}}</p>
  </div>
    <button @click="ResetQues"  type="button" class="btn btn-outline-danger btn-floating changescale" data-mdb-ripple-color="dark"  style="margin: 2px;">
        <i title="Reset Lecture" class="fas fa-sync"></i>
    </button>
  </template>
  
  <script>
  export default {
    props: {
      resetID: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
      errorMsg: '',
      secret: Cookies.get('secret'),
      userID: Cookies.get('uid'),
      shownotifier: false
      }
    },
  mounted () {
  if (this.Userid){
    axios.get(`http://localhost:8800/users/${this.Userid}`)
    .then(response => {
    }, err => {
      Cookies.remove('uid')
      Cookies.remove('name')
      window.location.reload();
    })
  }
  },
  methods: {
    ResetQues () {
      const bdata = {"secret": this.secret}
      axios.put(`http://localhost:8800/lectures/${this.resetID}/reset`, bdata)
      .then(response => {
        this.errorMsg = `Reset Lecture ${this.resetID} Successfully.`
        this.shownotifier = true;
        setTimeout(() => {
          this.shownotifier=false
          this.errorMsg = ''
        }, 1000);
      }, err => {
        this.errorMsg = `Lecture ${this.resetID} cannot be reset.`
        this.shownotifier = true;
        setTimeout(() => {
          this.shownotifier=false
          this.errorMsg = ''
        }, 1000);
        console.log(err)
      })
    }
  }
  }
  </script>