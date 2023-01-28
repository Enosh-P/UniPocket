<script setup>
import Singlequestion from "./Singlequestion.vue"
import axios from "axios"
import Cookies from 'js-cookie'
import socket from '../router/socket.listen'
</script>

<template>
    <div>
        <ul style="list-style-type: none;">
            <Singlequestion v-for="question in allQuestions" :question="question"></Singlequestion>
        </ul>
    </div>
</template>

<script>
export default {
  props: {
    lecid: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
        allQuestions: [],
        Userid: Cookies.get('uid'),
        socket: socket
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
    this.getQuestionsandVotes()

    this.socket.on('onQuestionAdded', data => {
      this.getQuestionsandVotes()
    })

    this.socket.on('onLectureReset', data => {
      window.location.reload()
    })
  },
  methods: {
    async  getQuestionsandVotes() {
      try {
          const questionsResponse = await axios.get(`http://localhost:8800/questions/${this.lecid}`);
          this.allQuestions = questionsResponse.data;

          const votesPromises = this.allQuestions.map(async obj => {
            const voteResponse = await axios.get(`http://localhost:8800/votes/${obj.id}`);
            const voteCount = voteResponse.data.upVotes - voteResponse.data.downVotes;
            return {...obj, votes: voteCount};
          });
          this.allQuestions = await Promise.all(votesPromises);

        } catch (err) {
          console.log(err);
        }
    }
  }
}
</script>