import axios from 'axios';

const apiClient = axios.create({
    // baseURL: process.env.API_URL + '/api',
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
});

const token = localStorage.getItem('userToken');

export default {
    logout() {
        return apiClient.post('/user/logout', null,{headers: {'Authorization': `Bearer ${token}`}})
    },
    login(data: any) {
        return apiClient.post('/login', data, {
            withCredentials: true
        })
    },
    userInfo() {
        return apiClient.get('/user/', {headers: {'Authorization': `Bearer ${token}`}})
    },
    getUsers(page = 1, search = ''){
        return apiClient.get('/user/all-users', {params: { page, search },headers: {'Authorization': `Bearer ${token}`}})
    },
    createPost(data: any) {
        return apiClient.post('/user/create-post', data, {headers: {'Authorization': `Bearer ${token}`}})
    },
    createComment(id: any, data:any) {
        return apiClient.post('/user/comment/'+id, data, {headers: {'Authorization': `Bearer ${token}`}})
    },
    getPosts() {
        return apiClient.get('/user/all-posts', {headers: {'Authorization': `Bearer ${token}`}})
    },
    getMyPosts() {
        return apiClient.get('/user/get-my-posts', {headers: {'Authorization': `Bearer ${token}`}})
    },
    getPostComments(postId: any) {
        return apiClient.get('/user/get-post-comments/' + postId, {headers: {'Authorization': `Bearer ${token}`}})
    },
    getComment() {
        return apiClient.post('/user/get-posts', {headers: {'Authorization': `Bearer ${token}`}})
    },
    getPostByPostId(id: any) {
        return apiClient.get('/user/get-post-by-id/' + id, {headers: {'Authorization': `Bearer ${token}`}})
    },
    getMyPostByUserId(user_id: any) {
        return apiClient.get('/user/get-user-post/' + user_id, {headers: {'Authorization': `Bearer ${token}`}})
    },
    deletePost(id: any) {
        return apiClient.delete('/user/delete-post/' + id, {headers: {'Authorization': `Bearer ${token}`}})
    }

};
