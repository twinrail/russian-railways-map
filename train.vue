<template>
  <v-list>
    <v-list-item>
      <v-list-item-icon>
        <v-icon x-large color="success">train</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          {{ train.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-h6">
          <router-link
            class="text-decoration-none"
            :to="{
              name: 'station',
              params: {
                lang: lang,
                station_id: info.stations[train.times[0].id].id,
              },
            }"
          >
            {{ info.stations[train.times[0].id][lang] }}
          </router-link>
        </v-list-item-subtitle>
        <v-list-item-subtitle class="text-h6">
          <router-link
            class="text-decoration-none"
            :to="{
              name: 'station',
              params: {
                lang: lang,
                station_id: info.stations[train.times.slice(-1)[0].id].id,
              },
            }"
          >
            {{ info.stations[train.times.slice(-1)[0].id][lang] }}
          </router-link>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          <v-icon large color="success">departure_board</v-icon>
          {{ header.table[lang] }}
        </v-list-item-title>

        <v-simple-table dense>
          <template>
            <thead>
              <tr>
                <th>{{ header.station[lang] }}</th>
                <th>{{ header.arrival[lang] }}</th>
                <th>{{ header.departure[lang] }}</th>
                <th>UTC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="station in train.times" v-bind:key="station.id">
              <td>
                <router-link
                  class="text-decoration-none"
                  :to="{
                    name: 'station',
                    params: { lang: lang, station_id: station.id },
                  }"
                  >{{ info.stations[station.id][lang] }}</router-link
                >
              </td>
              <td>
                {{ station.arr }}
              </td>
              <td>
                {{ station.dep }}
              </td>
              <td>
                +{{ info.stations[station.id].utc }}
              </td>
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
    lang: 'ja',
    train: {
      id: null,
      name: null,
      times: [{id:'Moscow-Kurskiy'}],
    },
    markers: [],
    theme_color: null,
    header: {
      date: { ja: "運行日", en: "Service Dates" },
      facility: { ja: "設備", en: "Facility" },
      table: { ja: "時刻表", en: "Timetable" },
      station: { ja: "駅名", en: "Station" },
      arrival: { ja: "到着", en: "Arrival" },
      departure: { ja: "出発", en: "Departure" },
      title: {
        ja: " 列車 | ロシア鉄道地図",
        en: " Train | Russian Railways Map",
      },
    },
  }),
  methods: {
    set_data: function () {},
    write: function () {
      this.lang = this.$route.params.lang;
      this.train = this.info.trains[this.$route.params.train_id];
      let bounds = new mapboxgl.LngLatBounds();
      document.title = this.train.name + this.header.title[this.lang];

      for (time of this.train.times) {
        const station = this.info.stations[time.id];
        const coord = [station.lon, station.lat];
        const pop = new mapboxgl.Popup({ closeButton: false });
        pop.setText(station[this.lang]);
        const marker = new mapboxgl.Marker({ color: "#FF5252" });
        marker.setLngLat(coord);
        marker.setPopup(pop);
        this.markers.push(marker);
        const marker_div = marker.getElement();
        marker_div.id = station.id;
        marker_div.addEventListener("mouseenter", () => marker.togglePopup());
        marker_div.addEventListener("mouseleave", () => marker.togglePopup());
        marker_div.addEventListener("click", (element) => {
          const link = `/${this.lang}/station/${element.path[4].id}`;
          this.$router.push(link, () => {});
        });
        marker.addTo(map);
        bounds.extend(coord);
      }
      map.fitBounds(bounds, { padding: 100, essential: true });
    },
    remove_data: function () {
      if (map.getSource("train_line")) {
        map.removeLayer("train_line");
        map.removeSource("train_line");
      }

      if (this.markers) {
        for (marker of this.markers) {
          marker.remove();
        }
      }
      this.markers = [];
    },
  },
  mounted: function () {
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
