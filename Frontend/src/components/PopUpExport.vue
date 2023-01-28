<script setup>
import Cookies from 'js-cookie'
import axios from 'axios'
</script>

<template>
    <button class="btn btn-outline-success" @click="ExportQuestions" style="margin: 4px; border-radius: 35px;" data-mdb-ripple-color="dark" data-toggle="modal" data-target="#Modal2" title="Export Questions">
      <i class="fas fa-arrow-circle-down"></i>
    </button>
    <div class="modal fade" id="Modal2" tabindex="-1" role="dialog" aria-labelledby="ModalLabel2" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ModalLabel2">Export Questions and Votes</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="Exporttext" class="col-form-label">Exported JSON:</label>
                <textarea class="large-textarea" id="Exporttext" readonly></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button @click="DownloadData" type="button" class="btn btn-primary">Download</button>
          </div>
        </div>
      </div>
    </div>  
    </template>


<script>
export default {
  props: {
    LecID: {
        type: Number,
        required: true
    }
  },
  data: function() {
    return { 
      secret: Cookies.get('secret'),
      exported: '',
      userID: Cookies.get('uid'),
    }
  },
  methods: {
    ExportQuestions () {
      var recMsg = document.getElementById("Exporttext")
      const bdata={secret: this.secret}
      axios.post(`http://localhost:8800/questions/${this.LecID}/export`, bdata)
      .then(response => {
        recMsg.value = JSON.stringify(response.data)
      }, err => {
        console.log(err)
      })
    },
    DownloadData () {
      var recMsg = document.getElementById("Exporttext")
      try {
        const blob = new Blob([recMsg.value], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'export.json';
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
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