<template>
  <main class="form-signin w-100 m-auto">

    <form @submit.prevent="submit">
      <h1 class="h3 mb-3 fw-normal">Please Register</h1>

      <input v-model="data.name" type="text" class="form-control" placeholder="Name">
      <input v-model="data.email" type="email" class="form-control" placeholder="name@example.com">
      <input v-model="data.password" type="password" class="form-control" placeholder="Password">

      <button class="btn btn-primary w-100 py-2" type="submit">Register</button>
    </form>
  </main>
</template>

<script lang="ts">
import {reactive} from "vue";
import {useRouter} from "vue-router";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "RegisterView",
  setup() {
    const data = reactive({
      name: '',
      email: '',
      password: ''
    });

    const router = useRouter();

    const submit = async () => {
      await fetch('http://localhost:8000/api/register', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      await router.push('/login');
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

