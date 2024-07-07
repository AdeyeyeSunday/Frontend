<template>
  <main class="form-signin w-100 m-auto">

  <form @submit.prevent="submit">
    <h1 class="h3 mb-3 fw-normal">Please Login</h1>

    <input v-model="data.email" type="email" class="form-control" placeholder="name@example.com">
    <input v-model="data.password" type="password" class="form-control" placeholder="Password">

    <button class="btn btn-primary w-100 py-2" type="submit">Login</button>
  </form>
  </main>
</template>

<script lang="ts">
import {reactive} from "vue";
import {useRouter} from "vue-router";
import authService from '@/services/authService';


export default {
  name: "LoginView",
  setup() {
    const data = reactive({
      email: '',
      password: ''
    });

    const router = useRouter();
    const submit = async () => {
      try {
        const res = await authService.login(JSON.stringify(data));

        if (res.data.status == 'success') {

          localStorage.setItem('userToken', res.data.authorisation.token);
          await router.push('/');
        }
      } catch (e) {
        console.error('Failed to login:', e);
      }
    }

    return {
      data,
      submit
    }
  }
}
</script>


<style>

.form-signin {
  max-width: 330px;
  padding: 1rem;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>

