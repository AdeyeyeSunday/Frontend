<template>
  <form @submit.prevent="submit">
    <div class="mb-3">
      <input v-model="formData.postTitle" class="form-control" placeholder="Post Title">
    </div>
    <div class="mb-3">
      <textarea v-model="formData.postContent" class="form-control" rows="3" placeholder="Post content"></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
  <hr>
  <h3>Posts</h3>
  <table class="table table-striped table-hover">
    <thead>
    <tr>
      <th>Title</th>
      <th>Content</th>
      <th>Created Time</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="post in posts" :key="post.id">
      <td>{{ post.post_title || 'No title' }}</td>
      <td>{{ post.content ? post.content.substring(0, 50) + '...' : 'No content' }}</td>
      <td>{{ formatDateTime(post.created_at) || 'No timestamp' }}</td>
      <td>
        <button @click="viewPost(post)" class="btn btn-info btn-sm me-2">View</button>
        <button @click="deletePost(post.id)" class="btn btn-danger btn-sm">Delete</button>
      </td>
    </tr>
    </tbody>
  </table>

  <!-- View Post Modal -->
  <div v-if="viewModal" class="modal" tabindex="-1" style="display: block;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Post Details</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <h6>{{ selectedPost.post_title }}</h6>
          <p>{{ selectedPost.content }}</p>
          <small>Posted on: {{  formatDateTime(selectedPost.created_at)}}</small>

          <hr>

          <h6>Comments</h6>
          <ul class="list-unstyled">
            <li v-for="comment in comments" :key="comment.id" class="mb-2">
              {{ comment.comment }}
              <small class="text-muted d-block">{{ formatDateTime(comment.created_at) }}</small>
            </li>
          </ul>

          <div class="mt-3">
            <textarea v-model="newComment.postComment" class="form-control" rows="3" placeholder="Add a comment..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="submitComment">Add Comment</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="viewModal" class="modal-backdrop fade show"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, Ref } from 'vue';
import authService from '@/services/authService';
import {useRouter} from 'vue-router';
import {useStore} from "vuex";

export default defineComponent({
  name: "PostView",
  setup() {
    const store = useStore();
    const formData = reactive({
      postTitle: '',
      postContent: ''
    });
    const newComment =  reactive({
      postComment:''
    });

    const viewModal = ref(false);

    const posts: Ref<any[]> = ref([]);
    const selectedPost: Ref<any> = ref({});
    const comments: Ref<any[]> = ref([]);

    const router = useRouter();

    const submit = async () => {
      try {
        await authService.createPost(JSON.stringify({
          post_title: formData.postTitle,
          content: formData.postContent
        }));
        formData.postTitle = '';
        formData.postContent = '';
        await fetchPosts();
      } catch (e) {
        console.error('Failed to create post:', e);
      }
    };

    const submitComment = async () => {
      if (!newComment.postComment.trim()) return;

      try {
        await authService.createComment(selectedPost.value.id, JSON.stringify({
          post_id: selectedPost.value.id,
          comment: newComment.postComment
        }));
        newComment.postComment = '';
        await fetchComments(selectedPost.value.id);
      } catch (e) {
        console.error('Failed to submit comment:', e);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await authService.getPosts();
        posts.value = response.data.data; // Access the nested data array
        console.log(posts.value);
      } catch (e) {
        console.log('Failed to fetch posts:', e);
      }
    };

    const deletePost = async (postId: number) => {
      try {
        await authService.deletePost(postId);
        await fetchPosts();
      } catch (e) {
        console.log('Failed to delete post:', e);
      }
    };

    const viewPost = async (post: any) => {
      selectedPost.value = post;
      viewModal.value = true;
      await fetchComments(post.id);
    };

    const fetchComments = async (postId: number) => {
      try {
        const response = await authService.getPostComments(postId);
        comments.value = response.data.data;

        console.log("comments: ",response.data.data)
      } catch (e) {
        console.log('Failed to fetch comments:', e);
      }
    };

    const closeModal = () => {
      viewModal.value = false;
      comments.value = [];
      newComment.postComment = '';
    };

    const formatDateTime = (dateString: string) => {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // Use 12-hour clock (AM/PM)
      });
    };


    onMounted(async () => {
      try {
        await fetchPosts();
        await store.dispatch('setAuth', true);
      } catch (e) {
        console.error('Failed to fetch posts or set auth:', e);
        await store.dispatch('setAuth', false);
      }
    });

    return {
      formData,
      posts,
      selectedPost,
      viewModal,
      submit,
      deletePost,
      viewPost,
      closeModal,
      comments,
      newComment,
      submitComment,
      formatDateTime,
    };
  }
});
</script>