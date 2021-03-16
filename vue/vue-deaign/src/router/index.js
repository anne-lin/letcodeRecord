import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "",
    component: ()=>import(/* webpackChunkName: "layout" */ "../layouts/BasicLayout.vue"),
    children:[
      {
        path:"/",
        redirect:"/dashboard/analysis"
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component:{
          render:(h)=>h("router-view")
        },
        children:[{
          path: "/dashboard/analysis",
          name: "analysis",
          component: () =>import(/* webpackChunkName: "dashboard" */ "../views/Dashboard/Analysis.vue"),
        }]
      },
      {
        path: "/form",
        name: "form",
        component:{
          render:(h)=>h("router-view")
        },
        children:[
          {
            path: "/form/basic-form",
            name: "basicform",
            component: () =>import(/* webpackChunkName: "forms" */ "../views/Forms/Basicform.vue"),
          },{
            path: "/form/step-form",
            name: "stepform",
            //component: () =>import(/* webpackChunkName: "dashboard" */ "../views/Forms/StepForm"),
            component:{
              render:(h)=>h("router-view")
            },
            children:[ {
              path:"/form/step-form",
              redirect:"/form/step-form/info"
            },{
              path: "/form/step-form/info",
              name: "info",
              component: () =>import(/* webpackChunkName: "Forms" */ "../views/Forms/StepForm/StepInfo.vue"),
            },]
          }
        ]
      }
    ]
  },
  {
    path: "/user",
    name: "About",
    /* component:{
      render:(h)=>h("router-view")
    }, */
    component: () =>
      import(/* webpackChunkName: "layout" */ "../layouts/userLayout.vue"),
    children:[{
      path:"/user",
      redirect:"/user/login"
    },
      {
        path: "/user/login",
        name: "login",
        component: () =>import(/* webpackChunkName: "user" */ "../views/User/Login.vue"),
      },
      {
        path: "/user/register",
        name: "register",
        component: () =>import(/* webpackChunkName: "user" */ "../views/User/Register.vue"),
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
