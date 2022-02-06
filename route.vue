<template>
  <v-list>
    <v-list-item>
      <v-list-item-icon>
        <v-icon large color="error">directions</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          <router-link
            class="text-decoration-none"
            :to="{
              name: 'station',
              params: { lang: lang, station_id: start.id },
            }"
          >
            {{ start[lang] }}
          </router-link>
        </v-list-item-title>
        <v-list-item-title class="text-h5">
          <router-link
            class="text-decoration-none"
            :to="{
              name: 'station',
              params: { lang: lang, station_id: goal.id },
            }"
          >
            {{ goal[lang] }}
          </router-link>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item class="pb-4">
      <v-btn
        color="error"
        block
        elevation="0"
        class="text-subtitle-1 text-capitalize"
        @click="reverse"
      >
        <v-icon color="white">swap_horiz</v-icon>
        {{ header.reverse[lang] }}
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item v-if="!routes.length">
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          <v-icon large color="error">bus_alert</v-icon>
          {{ header.no_route[lang] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-else>
      <v-list-item-content>
        <v-simple-table dense>
          <template>
            <thead>
              <tr>
                <th>{{ header.number[lang] }}</th>
                <th>{{ header.departure[lang] }}</th>
                <th>{{ header.arrival[lang] }}</th>
                <th>{{ header.req_time[lang] }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="route in routes" v-bind:key="route.id">
                <td>
                  <router-link
                    class="text-decoration-none"
                    :to="{
                      name: 'train',
                      params: { lang: lang, train_id: route.id },
                    }"
                  >
                    {{ info.trains[route.id].name }}
                  </router-link>
                </td>
                <td>{{ route.start }}</td>
                <td>{{ route.goal }}</td>
                <td>{{ route.time }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
module.exports = {
  props: {
    info: { type: Object, required: true },
  },
  data: () => ({
    routes: [],
    start: null,
    goal: null,
    start_marker: null,
    goal_marker: null,
    lang: null,
    route_hover_id: null,
    route_popup: null,
    header: {
      number: { ja: "番号", en: "Number" },
      departure: { ja: "出発", en: "Departure" },
      arrival: { ja: "到着", en: "Arrival" },
      req_time: { ja: "時間", en: "Time" },
      reverse: { ja: "逆方向", en: "Reverse Direction" },
      title: {
        ja: " | ロシア鉄道地図",
        en: " | Russian Railways Map",
      },
      no_route: {
        ja: "両駅を直通する列車はありません",
        en: "No Direct Train between Both Stations",
      },
    },
  }),
  methods: {
    set_data: function (start_id, goal_id) {
      this.start = this.info.stations[start_id];
      this.goal = this.info.stations[goal_id];
      const title = this.header.title[this.lang];
      document.title = `${this.start[this.lang]} → ${
        this.goal[this.lang]
      }${title}`;
      const goal_map = Object.fromEntries(
        this.goal.times.map((train) => [train.id, train.index])
      );
      const trains = this.start.times
        .filter((train) => train.id in goal_map)
        .filter((train) => goal_map[train.id] > train.index)
        .map((train) => {
          dep_info = this.info.trains[train.id].times[train.index];
          arr_info = this.info.trains[train.id].times[goal_map[train.id]];
          interval = arr_info.arr_min - dep_info.dep_min;
          time = `${Math.floor(interval / 60)}:${String(interval % 60).padStart(
            2,
            "0"
          )}`;
          return {
            id: train.id,
            start: dep_info.dep,
            goal: arr_info.arr,
            time: time,
          };
        });
      this.routes = trains;
      
      const start_coord = [this.start.lon, this.start.lat];
      const goal_coord = [this.goal.lon, this.goal.lat];
      this.start_marker = new mapboxgl.Marker({ color: "#FF5252" });
      this.goal_marker = new mapboxgl.Marker({ color: "#FF5252" });
      this.start_marker.setLngLat(start_coord);
      this.goal_marker.setLngLat(goal_coord);
      this.start_marker.addTo(map);
      this.goal_marker.addTo(map);
      
      let bounds = new mapboxgl.LngLatBounds();
      bounds.extend(start_coord);
      bounds.extend(goal_coord);
      map.fitBounds(bounds, { padding: 100, essential: true });
    },
    write: function () {
      this.lang = this.$route.params.lang;
      const start_id = this.$route.params.start_id;
      const goal_id = this.$route.params.goal_id;
      this.set_data(start_id, goal_id);
    },
    remove_data: function () {
      if (this.start_marker != null) {
        this.start_marker.remove();
      }
      if (this.goal_marker != null) {
        this.goal_marker.remove();
      }
    },
    reverse: function () {
      const link = `/${this.lang}/route/${this.goal.id}/${this.start.id}`;
      this.$router.push(link, () => {});
    },
  },
  created: function () {
    this.write();
  },
  destroyed: function () {
    this.remove_data();
  },
  watch: {
    $route() {
      this.remove_data();
      this.write();
    },
  },
};
</script>
