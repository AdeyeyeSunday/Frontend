<template>
  <div>
    <h2>Users</h2>

    <!-- Search input -->
    <div class="mb-3">
      <input
          v-model="searchQuery"
          @input="debouncedSearch"
          type="text"
          class="form-control"
          placeholder="Search users..."
      >
    </div>

    <!-- Users table -->
    <table class="table table-striped">
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Created At</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <nav aria-label="Page navigation" v-if="paginationInfo">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: !paginationInfo.prev_page_url }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li v-for="page in paginationInfo.last_page" :key="page" class="page-item"
            :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: !paginationInfo.next_page_url }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import authService from '@/services/authService';
import debounce from 'lodash/debounce';
import {useStore} from "vuex";

export default defineComponent({
  name: 'UsersView',
  setup() {
    const store = useStore();
    const users = ref([]);
    const currentPage = ref(1);
    const paginationInfo = ref(null);
    const searchQuery = ref('');

    const fetchUsers = async (page = 1, search = '') => {
      try {
        const response = await authService.getUsers(page, search);
        if (response.data.message === "Users data fetched") {
          users.value = response.data.data.data;
          paginationInfo.value = response.data.data;
          currentPage.value = response.data.data.current_page;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const changePage = (page: number) => {
      if (paginationInfo.value && page >= 1 && page <= paginationInfo.value.last_page) {
        currentPage.value = page;
        fetchUsers(page, searchQuery.value);
      }
    };

    const debouncedSearch = debounce(() => {
      currentPage.value = 1;
      fetchUsers(1, searchQuery.value);
    }, 300);

    onMounted(async () => {
      try {
        await fetchUsers();
        await store.dispatch('setAuth', true);
      } catch (e) {
        console.error('Failed to users or set auth:', e);
        await store.dispatch('setAuth', false);
      }
    });
    return {
      users,
      currentPage,
      paginationInfo,
      searchQuery,
      changePage,
      debouncedSearch,
    };
  },
});
</script>