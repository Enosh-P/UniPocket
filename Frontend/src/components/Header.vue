<script setup>
</script>

<template>
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: rgba(255, 255, 255, 0.5);">
    <div class="container-fluid">
        <a class="nav-link navbar-brand" href="/"><img src="../assets/UniPocket.ico" alt=""></a>
      <button class="navbar-toggler" type="button" data-mdb-toggle="collapse"
              data-mdb-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
              aria-label="Toggle navigation">
        <i class="fas fa-bars"></i>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link changeBackground" href="/"  style="color: black; border: none;" >Lectures</a>
          </li>
          <li class="nav-item">
            <a class="nav-link changeBackground" href="/questions" style="color: black; border: none;">Questions</a>
          </li>

        </ul>
        <div class="dropdown align">
        <button  title="Account" class="fas fa-user btn-dark btn-floating" id="navbarDropdown" role="button" data-mdb-toggle="dropdown" aria-expanded="false">
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="/dashboard">Profile 
              <span style="color:white">-----</span><i class="fas fa-user"></i></a></li>
            <li><a  type= "button" class="dropdown-item" @click="logOut">Log Out
              <span style="color:white">---</span><i class="fas fa-power-off"></i>
            </a></li>
        </ul>
        </div>
      </div>
    </div>
  </nav>
</header>
</template>


<script>
import Cookies from 'js-cookie'


export default {
  data() {
    return {
      name: '',
      uid: '',
    }
  },
  mounted() {
    this.name = Cookies.get('name')
    this.uid = Cookies.get('uid')
  },
  methods: {
    logOut() {
      this.name = ''
      this.uid = ''
      Cookies.remove('name')
      Cookies.remove('uid')
      if (Cookies.get('secret')){
        Cookies.remove('secret')
      }
      window.location.reload();
    }
  }
}
</script>

<style scoped>
.align {
  padding-right: 18px;
}

.changeBackground {
  border-radius: 40%;
  background-color: transparent;
}

.changeBackground:hover{
  background-image: url(../assets/bg-more.jpg);
  background-size: cover;
  font-weight: bold;
}
</style>