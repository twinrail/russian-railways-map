<template>
  <v-list>
    <v-list-item>
      <v-list-item-icon>
        <v-icon x-large color="error">place</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="text-h5">
          {{ station[lang] }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-subtitle-1" v-if="lang !== 'en'">
          {{ station.en }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class="text-subtitle-1">
          {{ station.ru }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item class="pb-4">
      <v-col class="py-0">
        <v-btn
          color="error"
          block
          elevation="0"
          class="text-subtitle-1 text-capitalize"
          @click="set_start"
        >
          <v-icon color="white">place</v-icon>
          {{ header.start[lang] }}
        </v-btn>
      </v-col>
      <v-col class="py-0">
        <v-btn
          color="error"
          block
          elevation="0"
          class="text-subtitle-1 text-capitalize"
          @click="set_goal"
        >
          <v-icon color="white">place</v-icon>
          {{ header.goal[lang] }}
        </v-btn>
      </v-col>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item v-if="!station.times.length">
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          <v-icon large color="error">bus_alert</v-icon>
          {{ header.no_train[lang] }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-else>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          <v-icon large color="error">departure_board</v-icon>
          {{ header.table[lang] }}
        </v-list-item-title>

        <v-list-item-title class="text-subtitle-1 py-2">
          <v-icon color="error">schedule</v-icon>
          UTC +{{ station.utc }}
        </v-list-item-title>

        <v-simple-table dense>
          <template>
            <thead>
              <tr>
                <th>{{ header.number[lang] }}</th>
                <th>{{ header.destination[lang] }}</th>
                <th>{{ header.arrival[lang] }}</th>
                <th>{{ header.departure[lang] }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="train in station.times" v-bind:key="train.id">
                <td>
                  <router-link
                    class="text-decoration-none"
                    :to="{
                      name: 'train',
                      params: { lang: lang, train_id: train.id },
                    }"
                  >
                    {{ info.trains[train.id].name }}
                  </router-link>
                </td>
                <td>
                  <router-link
                    class="text-decoration-none"
                    :to="{
                      name: 'station',
                      params: {
                        lang: lang,
                        station_id: info.trains[train.id].times.slice(-1)[0].id,
                      },
                    }"
                  >
                    {{
                      info.stations[
                        info.trains[train.id].times.slice(-1)[0].id
                      ][lang]
                    }}
                  </router-link>
                </td>
                <td>
                  {{ info.trains[train.id].times[train.index].arr }}
                </td>
                <td>
                  {{ info.trains[train.id].times[train.index].dep }}
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
    lang: null,
    station: {
      id: null,
      en: null,
      ja: null,
      ru: null,
      utc: null,
      lon: null,
      lat: null,
      main: null,
      times: [],
    },
    marker: null,
    header: {
      number: { ja: "番号", en: "Number" },
      destination: { ja: "行先", en: "Destination" },
      arrival: { ja: "到着", en: "Arrival" },
      departure: { ja: "出発", en: "Departure" },
      start: { ja: "出発駅に設定", en: "Set as Dep." },
      goal: { ja: "到着駅に設定", en: "Set as Arr." },
      table: { ja: "時刻表", en: "Timetable" },
      title: {
        ja: " 駅 | ロシア鉄道地図",
        en: " Station | Russian Railways Map",
      },
      no_train: {
        ja: "当駅を経由する列車はありません",
        en: "No Train through This Station",
      },
    },
  }),
  methods: {
    write: function () {
      this.lang = this.$route.params.lang;
      this.station = this.info.stations[this.$route.params.station_id];
      const coord = [this.station.lon, this.station.lat];

      document.title = this.station[this.lang] + this.header.title[this.lang];
      this.marker = new mapboxgl.Marker({ color: "#FF5252" });
      this.marker.setLngLat(coord);
      this.marker.addTo(map);
      map.flyTo({ center: coord, zoom: 10, essential: true });
    },
    remove_data: function () {
      if (this.marker != null) {
        this.marker.remove();
      }
    },
    set_start: function () {
      this.$emit("set_station", true, this.station.id, this.station[this.lang]);
    },
    set_goal: function () {
      this.$emit(
        "set_station",
        false,
        this.station.id,
        this.station[this.lang]
      );
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
