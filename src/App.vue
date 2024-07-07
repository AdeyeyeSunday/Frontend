<template>
  <NavBar/>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  components: {NavBar}
}
</script>
