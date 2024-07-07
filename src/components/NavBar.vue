<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand" href="#">Home</router-link>
      <div>
        <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="!auth">
          <li class="nav-item">
            <router-link to="/login" class="nav-link" >Login</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>
        </ul>
        <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="auth">
          <li class="nav-item">
            <router-link to="/posts" class="nav-link" >Posts</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/users" class="nav-link">Users</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link"  @click="logout">Logout</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import {computed} from "vue";
import{useStore} from "vuex";

import authService from '@/services/authService';

export default {
  name: 'NavBar',
  setup() {
    const store = useStore();
    const auth = computed(() => store.state.authenticated);
    const logout = async () => {
      try {
        await authService.logout();
        await store.dispatch('setAuth', false);
        // Add any additional logic, like updating the store or redirecting
      } catch (error) {
        console.error('Failed to logout:', error);
      }
    };
    return { auth, logout };
  },
};
</script>
