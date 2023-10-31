import Vue from 'vue'
import VueRouter from 'vue-router'
import result from "@/views/Result.vue";
import main from "@/views/Main.vue";
import transcribe from "@/views/Transcribe.vue";
import details from "@/views/Details.vue";
import upload from "@/views/Upload.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: main
  },
  {
    path: '/result',
    name: 'result',
    component: result,
    meta:{
      title: 'Transcription results'
    }
  },
  {
    path: '/trans',
    name: 'trans',
    component: transcribe
  },
  {
    path: '/details',
    name: 'details',
    component: details,
    meta:{
      title: 'Model Details'
    }
  },
  {
    path: '/upload',
    name: 'upload',
    component: upload,
    meta:{
      title: 'Upload'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
