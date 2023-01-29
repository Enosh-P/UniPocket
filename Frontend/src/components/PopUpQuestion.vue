<script setup>
import Cookies from 'js-cookie'
import axios from 'axios'
</script>

<template>
<template v-if="notAdmin">
    <button type="button"  class="btn btn-outline-primary changeBackground" style="margin: 4px; border-radius: 35px;" data-mdb-ripple-color="dark" data-toggle="modal" data-target="#Modal2">
        <i class="fas fa-plus me-2"></i>Add New Question</button>
    
    <div class="modal fade" id="Modal2" tabindex="-1" role="dialog" aria-labelledby="ModalLabel2" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content initNowBackground">
          <div class="modal-header">
            <h5 class="modal-title" id="ModalLabel2">Question for lecture {{ lecID }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="message-text" class="col-form-label" style="color: black;">Question:</label>
                <textarea class="large-textarea" v-model="quesCont" id="message-text" placeholder="Enter your question here!"></textarea>
              </div>
              <p class="text-center text-danger error" v-if="errorMessage" >{{ errorMessage }}</p>
              <p class="text-center text-success success" v-if="successMsg" >{{ successMsg }}</p>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" @click="addQuestion"  class="btn btn-primary">Add</button>
          </div>
        </div>
      </div>
    </div>  
</template>
</template>



<script>
export default {
  props: {
    lecID: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      userID: Cookies.get('uid'),
      notAdmin: !Cookies.get('secret'),
      quesCont: '',
      errorMessage: '',
      successMsg: ''
    }
  },
  methods: {
    addQuestion() {
      if (!this.quesCont){
        this.errorMessage = 'Opps!! Cannot Add Empty Question!'
        setTimeout(() => {
            this.errorMessage = '';
          }, 1000)
      }else{
        const bdata = {
        question: this.quesCont
      }
      axios.post(`http://localhost:8800/questions/${this.lecID}/${this.userID}`, bdata)
      .then(response => {
        this.quesCont = ''
        this.successMsg = "Question added successfully!"
        setTimeout(() => {
            this.successMsg = '';
          }, 2000)
      }, err => {
        this.errorMessage = "Question cant be added! Try Again!"
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