import Vue from "vue";
import VueRouter from "vue-router";
import NotFound from "../views/NotFound"

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
      },{
          path: "/cart",
          name: "cart",
          component: () =>import(/* webpackChunkName: "dashboard" */ "../views/Cart/Cart.vue"),
      },{
          path: "/cartVuex",
          name: "cartVuex",
          component: () =>import(/* webpackChunkName: "dashboard" */ "../views/Cart/CartVuex.vue"),
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
            component: () =>import(/* webpackChunkName: "dashboard" */ "../views/Forms/StepForm"),
            /* component:{
              render:(h)=>h("router-view")
            }, */
            children:[ {
              path:"/form/step-form",
              redirect:"/form/step-form/info"
            },{
              path: "/form/step-form/info",
              name: "info",
              component: () =>import(/* webpackChunkName: "Forms" */ "../views/Forms/StepForm/Step1"),
            },{
              path: "/form/step-form/confirm",
              name: "confirm",
              component: () =>import(/* webpackChunkName: "Forms" */ "../views/Forms/StepForm/Step2"),
            },{
              path: "/form/step-form/result",
              name: "result",
              component: () =>import(/* webpackChunkName: "Forms" */ "../views/Forms/StepForm/Step3"),
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
  },{
    path:"*",
    name:"404",
    component:NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
/* router.breforeEach((to,from,next)=>{
    //NProgress.start();
    next();
})
router.afterEach((to,from,next)=>{
  //NProgress.done();
}) */

export default router;
