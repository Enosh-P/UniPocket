<script setup>
import DeleteLQ from '../components/DeleteLQ.vue'
import Cookies from 'js-cookie'
import axios from 'axios';
import socket from '../router/socket.listen'
</script>

<template>
  <template v-if="showQuestion">
    <li>
      <div class="row">
      <div class="container " style="background-color: transparent; display: flex; flex-wrap: wrap; align-items: stretch;">
        <div style="flex: 1;">
          <div style="flex: 1;">
            <i class="far fa-thumbs-up changescale" @click="upvote" :class="{upvotedC: upvoted}" style="border-radius: 15px; padding: 7px; text-align:left"></i>
          </div>
          <div style="flex: 1;">
          <span style="text-align:center">{{ question.votes }}</span>
          </div>
          <div style="flex: 1;">
            <i class="far fa-thumbs-down changescale" @click="downvote" :class="{downvotedC: downvoted}" style="border-radius: 15px; padding: 7px; text-align:right"></i>
          </div>
        </div>
        <div style="flex: 15; height: max-content;">
          <a href="#" style="text-decoration: none; color: black">{{ question.textContent }}</a>
        </div>
        <div v-if="iamadmin" style="flex: 1">
          <DeleteLQ :delID="question.id" :delType="deltype"/>
        </div>
      </div>        
    </div>
    </li>
  </template>
</template>

<script>
export default {
  props: ['question'],
  data: function() {
    return {
      upvoted: false,
      downvoted: false,
      showQuestion: true,
      iamadmin: Cookies.get('secret'),
      userID: Cookies.get('uid'),
      deltype: "questions",
      userVote: 0,
      userVotedata: '',
      socket: socket
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
    
    this.getVote()
    
    this.socket.on('onQuestionVotesChange', data => {
      if (this.question.id === data.id){
        this.question.votes = data.upVotes-data.downVotes
      }
    })

    this.socket.on('onQuestionRemoved', data => {
      if (this.question.id === data.id){
        this.showQuestion = false
      }
    })
  },
  methods: {
    async addVote () {
      const bdata = {vote: this.userVote}
      try{
        await axios.put(`http://localhost:8800/votes/${this.question.id}/${this.userID}`, bdata)
      }catch (err){
          console.log(err)
      }
    },
    async getVote () {
      try{
        const uservoteresponse = await axios.get(`http://localhost:8800/votes/${this.question.id}/${this.userID}`)
        if (uservoteresponse.data.vote === 1){
        this.userVote = 1
        this.upvoted = true
        this.downvoted = false
      } else if (uservoteresponse.data.vote === -1){
        this.userVote = -1
        this.upvoted = false
        this.downvoted = true
      }else {
        this.upvoted = false
        this.downvoted = false
      }
      }catch (err){
          console.log(err)
      }
    },
    upvote: function() {
      if (!this.iamadmin){
        this.upvoted = true;
        this.downvoted = false;
        this.userVote = 1
        this.addVote()
      }
    },
    downvote: function() {
      if (!this.iamadmin){
        this.downvoted = true;
        this.upvoted = false;
        this.userVote = -1
        this.addVote()
        }
    }
  }
}
</script>

<style scoped>

.upvotedC {
  background-color:darkgreen;
  color: white;
}

.downvotedC {
  background-color:darkred;
  color: white;
}

</style>