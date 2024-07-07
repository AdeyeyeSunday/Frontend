<template>
  {{ message }}
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import authService from "@/services/authService";

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  setup() {
    const message = ref('You are not logged in!');
    const store = useStore();

    onMounted(async () => {
      try {
        const response = await authService.userInfo();
        console.log(response);

        // Assuming response.data contains the user information
        const content = response.data;
        message.value = `Hi ${content.data.name}`;

        await store.dispatch('setAuth', true);
      } catch (e) {
        await store.dispatch('setAuth', false);
      }
    });

    return { message };
  }
});
</script>