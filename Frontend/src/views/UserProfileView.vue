<script setup>
import HeaderContent from '../components/Header.vue'
</script>

<template>
    <HeaderContent/>
    <div class="maincontainer">
    <section class="vh-10 initBackground" style="background-color: #f4f5f7;">
  <div class="container initBackground py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col col-lg-6 mb-4 mb-lg-0">
        <div class="card mb-3" style="border-radius: .5rem;">
          <div class="row g-0">
            <div class="col-md-4 text-center"
              style="border-top-left-radius: .5rem; border-bottom-left-radius: .5rem;">
              <img src="../assets/User-img.webp" alt="Avatar" class="img-fluid my-5" style="width: 80px;" />
              <h5 class="titlecase" style="color: #3c3c3c" >{{username}}</h5>
              <p style="color: #3c3c3c">Not Admin</p>
            </div>
            <div class="col-md-8">
              <div class="card-body p-4">
                <h6 style="color: darkblue; font-weight: bold;">Information</h6>
                <hr class="mt-0 mb-4">
                <div class="row pt-1">
                  <div class="col-6 mb-3">
                    <h6 style="color: darkgreen; font-weight: bold;">User Name</h6>
                    <p class="text-muted titlecase">{{username}}</p>
                  </div>
                  <div class="col-6 mb-3">
                    <h6 style="color: darkgreen; font-weight: bold;">User ID</h6>
                    <p class="text-muted">{{Userid}}</p>
                  </div>
                </div>
                <h6 style="color: darkblue; font-weight: bold;">Permissions</h6>
                <hr class="mt-0 mb-4">
                <div class="row pt-1">
                  <div class="col-6 mb-3">
                    <h6>Ooops!!!</h6>
                    <p class="text-muted">No Permission xD</p>
                  </div>
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
import Cookies from 'js-cookie'

export default {
    data() {
        return {
        username: Cookies.get('name'),
        Userid: Cookies.get('uid')
        }
    },
    mounted() {
      if (this.Userid){
        axios.get(`http://localhost:8800/users/${this.Userid}`)
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