let map;

const routes = [
  {
    path: "/:lang(en|ja)",
    component: httpVueLoader("main.vue"),
    children: [
      {
        name: "about",
        path: "about",
        props: true,
        component: httpVueLoader("about.vue"),
      },
      {
        name: "station",
        path: "station/:station_id",
        props: true,
        component: httpVueLoader("station.vue"),
      },
      {
        name: "train",
        path: "train/:train_id",
        props: true,
        component: httpVueLoader("train.vue"),
      },
      {
        name: "route",
        path: "route/:start_id/:goal_id",
        props: true,
        component: httpVueLoader("route.vue"),
      },
      {
        path: "",
        redirect: "about",
      },
    ],
  },
  {
    path: "*",
    redirect: "/ja/about",
  },
];
const app = new Vue({
  router: new VueRouter({ routes }),
  vuetify: new Vuetify(),
  el: "#root",
});
