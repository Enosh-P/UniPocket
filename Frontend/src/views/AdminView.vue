<script setup>
import HeaderContent from '../components/Header.vue'
import PopUpAdd from '../components/PopUpAdd.vue'
import axios from 'axios';
import Cookies from 'js-cookie';
</script>

<template>
    <HeaderContent/>
    <div class="maincontainer initNowBackground">
    <section class="vh-10 " style="background-color: transparent;">
  <div class="container  py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col col-lg-6 mb-4 mb-lg-0">
        <div class="card" style="border-radius: .5rem; background-color: rgba(255, 255, 255, 0.45); border: none;">
          <div class="row">
            <div class="col-md-4 gradient-custom text-center"
              style="border-top-left-radius: .5rem; border-bottom-left-radius: .5rem;">
              <img src="../assets/admin.png" alt="avatar" class="rounded-circle img-fluid" style="width: 150px;">
              <p style="color: darkred; font-weight: bold;">Admin</p>
              <p style="color: darkblue; font-size: small;">Saarland University</p>
              <p style="color: darkblue; font-size: small;">Hehehehe xD</p>
            </div>
            <div class="col-md-8">
              <div class="card-body p-4">
                <h6 style="color: darkred; font-weight: bold;">Information</h6>
                <hr class="mt-0 mb-4">
                <div class="row pt-1">
                  <div class="col-6 mb-3">
                    <h6 style="color: darkgreen; font-weight: bold;">The Boss</h6>
                  </div>
                </div>
                <h6 style="color: darkred; font-weight: bold;">Permissions</h6>
                <hr class="mt-0 mb-4">
                <div class="mb-2">
                    <PopUpAdd/>
                    <button type="button" @click="showAlertExport" class="btn btn-outline-primary changeBackground" style="margin: 4px; border-radius: 35px;" data-mdb-ripple-color="dark">Export Questions</button>
                    <button type="button" @click="showAlertReset" class="btn btn-outline-primary changeBackground" style="margin: 4px; border-radius: 35px;" data-mdb-ripple-color="dark">Reset Questions</button>
                    <button type="button" @click="showAlertlecture" class="btn btn-outline-primary changeBackground" style="margin: 4px; border-radius: 35px;" data-mdb-ripple-color="dark">Delete Lecture</button>
                    <button type="button" @click="showAlertQuestion" class="btn btn-outline-primary changeBackground" style="margin: 4px; border-radius: 35px;" data-mdb-ripple-color="dark">Delete Question</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</div>
</template>

<script>
export default {
  data () {
    return {
      disIcon: false,
      nowUserID: Cookies.get('uid')
    }
  },
  mounted () {
    if (this.nowUserID){
      axios.get(`http://localhost:8800/users/${this.nowUserID}`)
      .then(response => {
      }, err => {
        Cookies.remove('uid')
        Cookies.remove('name')
        window.location.reload();
      })
    }
  },
  methods: {
    showAlertQuestion() {
      alert("Go to a Question to delete it. You will be redirected to Questions section..")
      setTimeout(() => {
        window.location.href = '/questions'
      }, 500)
    },
    showAlertlecture() {
      alert("Go to a Lecture to delete it. You will be redirected to lectures section..")
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    },
    showAlertReset() {
      alert("Go to a Lecture to Reset it. You will be redirected to lectures section..")
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    },
    showAlertExport() {
      alert("Go to a Lecture to Export it. You will be redirected to lectures section..")
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    }
  }
}
</script>