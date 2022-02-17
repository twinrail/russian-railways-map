<template>
  <v-app :style="app_height">
    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
      short
      :height="$vuetify.breakpoint.xs ? 112 : 56"
    >
      <v-row no-gutters align="center">
        <v-col cols="12" sm="auto">
          <v-app-bar-nav-icon @click="show = !show">
            <v-icon>menu</v-icon>
          </v-app-bar-nav-icon>

          <v-app-bar-nav-icon @click="show = true">
            <router-link
              class="text-decoration-none"
              :to="{ path: `/${lang}/about` }"
            >
              <v-icon color="white">help</v-icon>
            </router-link>
          </v-app-bar-nav-icon>

          <v-app-bar-nav-icon>
            <v-icon @click="share">share</v-icon>
          </v-app-bar-nav-icon>

          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-app-bar-nav-icon v-bind="attrs" v-on="on">
                <v-icon>translate</v-icon>
              </v-app-bar-nav-icon>
            </template>
            <v-list>
              <router-link class="text-decoration-none" :to="{ path: `/ja` }">
                <v-list-item @click="lang">
                  <v-list-item-title>日本語</v-list-item-title>
                </v-list-item>
              </router-link>
              <router-link class="text-decoration-none" :to="{ path: `/en` }">
                <v-list-item @click="lang">
                  <v-list-item-title>English</v-list-item-title>
                </v-list-item>
              </router-link>
            </v-list>
          </v-menu>

          <v-app-bar-nav-icon @click="show_route = !show_route">
            <v-icon v-show="show_route">directions</v-icon>
            <v-icon v-show="!show_route">travel_explore</v-icon>
          </v-app-bar-nav-icon>
        </v-col>

        <v-col cols="12" sm="6" md="5" lg="4" xl="3">
          <v-row
            no-gutters
            align="center"
            :justify="$vuetify.breakpoint.xs ? 'space-between' : 'start'"
          >
            <v-col class="px-2" v-show="show_route">
              <v-autocomplete
                id="start"
                v-model="start"
                :items="dep_results"
                item-text="name"
                item-value="key"
                :search-input.sync="dep_search"
                hide-no-data
                no-filter
                :placeholder="header.dep[lang]"
                hide-details
                return-object
                append-icon=""
              >
              </v-autocomplete>
            </v-col>

            <v-col cols="auto" v-show="show_route">
              <v-app-bar-nav-icon @click="swap_stations">
                <v-icon color="white">swap_horiz</v-icon>
              </v-app-bar-nav-icon>
            </v-col>

            <v-col class="px-2" v-show="show_route">
              <v-autocomplete
                id="goal"
                v-model="goal"
                :items="arr_results"
                item-text="name"
                item-value="key"
                :search-input.sync="arr_search"
                hide-no-data
                no-filter
                :placeholder="header.arr[lang]"
                hide-details
                return-object
                append-icon=""
              >
              </v-autocomplete>
            </v-col>

            <v-col cols="auto" v-show="show_route">
              <v-app-bar-nav-icon @click="search_route">
                <v-icon>search</v-icon>
              </v-app-bar-nav-icon>
            </v-col>

            <v-col cols="12" class="px-2 py-2" v-show="!show_route">
              <v-autocomplete
                v-model="link"
                :items="word_results"
                item-text="name"
                item-value="link"
                :search-input.sync="word_search"
                hide-no-data
                no-filter
                :placeholder="header.search[lang]"
                hide-details
                append-icon=""
              >
                <template v-slot:item="{ item }">
                  <v-list-item-icon>
                    <v-icon v-if="item.type === 'station'" color="error">
                      place
                    </v-icon>
                    <v-icon v-else color="success">train</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-navigation-drawer
      v-if="!this.$vuetify.breakpoint.xs"
      app
      clipped
      v-model="show"
      hide-overlay
      touchless
      mobile-breakpoint="0"
      :width="full ? '100%' : 480"
    >
      <router-view
        :info="info"
        v-if="ready"
        @set_station="set_station"
      ></router-view>
    </v-navigation-drawer>

    <v-bottom-sheet
      v-if="this.$vuetify.breakpoint.xs"
      v-model="show"
      scrollable
    >
      <v-card>
        <v-card-text
          class="px-0 mx-0"
          :style="{ height: full ? '100%' : '300px' }"
        >
          <v-col class="text-right py-1 pr-4">
            <v-btn icon @click="full = !full" color="primary">
              <v-icon v-show="full">expand_more</v-icon>
              <v-icon v-show="!full">expand_less</v-icon>
            </v-btn>

            <v-btn icon @click="show = false" color="primary">
              <v-icon>close</v-icon>
            </v-btn>
          </v-col>

          <v-divider></v-divider>

          <router-view
            :info="info"
            v-if="ready"
            @set_station="set_station"
          ></router-view>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <v-main>
      <main-map :info="info" v-if="ready_map" @is_ready="is_ready"></main-map>
    </v-main>
  </v-app>
</template>

<script>
module.exports = {
  components: {
    "main-map": httpVueLoader("map.vue"),
  },
  data: () => ({
    info: null,
    words: null,
    word_search: null,
    dep_search: null,
    arr_search: null,
    word_results: [],
    dep_results: [],
    arr_results: [],
    link: null,
    show: true,
    full: false,
    lang: null,
    ready: false,
    ready_map: false,
    app_height: null,
    show_route: true,
    start: { key: null, name: null },
    goal: { key: null, name: null },
    header: {
      dep: { ja: "出発駅を入力", en: "Enter Start Station" },
      arr: { ja: "到着駅を入力", en: "Enter Goal Station" },
      search: { ja: "駅名･列車検索", en: "Search Station or Train" },
    },
  }),
  created: function () {
    this.set_height();
    window.addEventListener("resize", this.set_height);
    this.lang = this.$route.params.lang;

    fetch("data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.info = data;
        this.words = Object.keys(data.words);
        this.ready_map = true;
      });
  },
  methods: {
    share(){
      const share_data = {
        title: document.title,
        text: document.title,
        url: location.href,
      }
      navigator.share(share_data)
    },
    set_height() {
      this.app_height = { "--app-height": window.innerHeight + "px" };
    },
    search_route() {
      if (this.start.key === null || this.goal.key === null) {
        return;
      }
      this.$router.push(
        `/${this.lang}/route/${this.start.key}/${this.goal.key}`,
        () => {}
      );
    },
    swap_stations() {
      const start = this.start;
      const goal = this.goal;
      const dep_results = this.dep_results;
      const arr_results = this.arr_results;
      this.start = goal;
      this.goal = start;
      this.dep_results = arr_results;
      this.arr_results = dep_results;
    },
    is_ready() {
      this.ready = true;
    },
    set_station(is_start, station_key, station_name) {
      const station = {
        key: station_key,
        name: station_name,
        link: `${this.lang}/station/${station_key}`,
        type: "station",
      };
      if (is_start) {
        this.start = station;
        this.dep_results = [station];
        return;
      }
      this.goal = station;
      this.arr_results = [station];
    },
    search(query, mode) {
      if (!query) {
        if (mode === "dep") {
          this.dep_results = [];
        } else if (mode === "arr") {
          this.arr_results = [];
        } else {
          this.word_results = [];
        }
        return;
      }
      match_words = this.words.filter((word) =>
        word.startsWith(query.toLowerCase())
      );
      if (mode === "dep" || mode === "arr") {
        match_words = match_words.filter(
          (word) => this.info.words[word].type === "station"
        );
      }
      results = match_words.map((word) => {
        search_id = this.info.words[word].id;
        search_type = this.info.words[word].type;
        return {
          key: search_id,
          name:
            search_type === "station"
              ? this.info.stations[search_id][this.lang]
              : this.info.trains[search_id].name,
          link: `${this.lang}/${search_type}/${search_id}`,
          type: search_type,
        };
      });
      if (mode === "dep") {
        this.dep_results = results;
      } else if (mode === "arr") {
        this.arr_results = results;
      } else {
        this.word_results = results;
      }
    },
  },
  watch: {
    link(link) {
      this.$router.push(`/${link}`, () => {});
    },
    word_search(query) {
      this.search(query, "word");
    },
    dep_search(query) {
      this.search(query, "dep");
    },
    arr_search(query) {
      this.search(query, "arr");
    },
    $route(to, from) {
      if (!this.show) {
        this.full = false;
      }
      this.show = true;
      if (from.params.lang !== to.params.lang) {
        this.$router.go({ path: this.$router.currentRoute.path, force: true });
      }
    },
  },
};
</script>
<style>
body::-webkit-scrollbar {
  display: none;
}
.v-application--wrap {
  min-height: var(--app-height);
}
</style>
