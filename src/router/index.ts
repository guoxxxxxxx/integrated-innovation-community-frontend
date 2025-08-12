import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/welcome",
      name: "welcome",
      component: () => import("@/views/WelcomeView.vue"),
      children: [
        // 用户登录，注册，找回密码界面
        {
          path: "/login",
          name: "login",
          component: () => import("@/components/welcome/LoginPage.vue")
        },
        {
          path: "/register",
          name: "register",
          component: () => import("@/components/welcome/RegisterPage.vue")
        },
        {
          path: "/reset",
          name: "reset",
          component: () => import("@/components/welcome/ForgetPage.vue")
        },
      ]
    },
    {
      path: "/",
      name: "index",
      component: () => import("@/App.vue"),
      children: [
        {
          path: "",
          redirect: "/home"
        },
        {
          path: "/main",
          name: "main",
          component: () => import("@/views/MainViews.vue"),
          children: [
            {
              path: "/home",
              name: "home",
              component: () => import("@/views/HomeViews.vue")
            },
            {
              path: "/postVideo",
              name: "postVideo",
              component: () => import("@/components/video/VideoUploadComp.vue")
            },
            {
              path: "/videoPlayer",
              name: "videoPlayer",
              component: () => import("@/components/video/VideoPlayerComp.vue")
            }
          ]
        }
      ]
    },
    {
      path: "/demo",
      name: "demo",
      component: () => import("@/views/demo/MainDemoViews.vue"),
      children: [
        {
          path: "/videoUpload",
          name: "videoUpload",
          component: () => import("@/views/demo/VideoUploadDemoViews.vue")
        },
        {
          path: "/commentDemo",
          name: "commentDemo",
          component: () => import("@/views/demo/CommentDemoViews.vue")  
        }
      ]
    }
  ],
})

export default router
