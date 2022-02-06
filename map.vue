<template>
  <div id="map" style="height: 100%"></div>
</template>

<script>
module.exports = {
  props: {
    info: { type: Object, required: true },
  },
  data: () => ({
    hover_id: null,
    lang: null,
  }),
  methods: {
    click_layer: function (element) {
      const link = element.features[0].properties.key;
      this.$router.push(link, () => {});
    },
    
    mouse_enter: function (element) {
      map.getCanvas().style.cursor = "pointer";
      if (this.hover_id !== null && this.hover_id !== undefined) {
        map.setFeatureState(
          { source: "railway", id: this.hover_id },
          { hover: false }
        );
      }
      this.hover_id = element.features[0].id;
      map.setFeatureState(
        { source: "railway", id: this.hover_id },
        { hover: true }
      );
    },

    mouse_leave: function () {
      map.getCanvas().style.cursor = "";
      if (this.hover_id !== null) {
        map.setFeatureState(
          { source: "railway", id: this.hover_id },
          { hover: false }
        );
      }
      this.hover_id = null;
    },

    set_map: function () {
      const make_station = (feature) => {
        const station = {
          type: "Feature",
          id: feature[1].id,
          properties: {
            name: feature[1][this.lang],
            key: `/${this.lang}/station/${feature[1].id}`,
            main: feature[1].main,
          },
          geometry: {
            type: "Point",
            coordinates: [feature[1].lon, feature[1].lat],
          },
        };
        return station;
      };

      const station_json = Object.entries(this.info.stations).map(make_station);
      const geojson = {
        type: "FeatureCollection",
        features: station_json,
      };

      const stations = {
        id: "stations",
        type: "circle",
        source: "railway",
        paint: {
          "circle-radius": {
            stops: [
              [4, 2],
              [6, 3],
            ],
          },
          "circle-color": "#FFFFFF",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#757575",
        },
        filter: ["all", ["==", "$type", "Point"], ["==", "main", false]],
      };

      const main_stations = {
        id: "main_stations",
        type: "circle",
        source: "railway",
        paint: {
          "circle-radius": {
            stops: [
              [4, 3],
              [6, 4],
            ],
          },
          "circle-color": "#FFFFFF",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#1976d2",
        },
        filter: ["all", ["==", "$type", "Point"], ["==", "main", true]],
      };

      const station_names = {
        id: "station_names",
        type: "symbol",
        source: "railway",
        minzoom: 4,
        layout: {
          "text-field": ["get", "name"],
          "text-anchor": "left",
          "text-offset": [0.5, -0.2],
          "text-size": 13,
        },
        paint: {
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
          "text-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#FF5252",
            "#212121",
          ],
        },
        filter: ["all", ["==", "$type", "Point"], ["==", "main", false]],
      };

      const main_station_names = {
        id: "main_station_names",
        type: "symbol",
        source: "railway",
        layout: {
          "text-field": ["get", "name"],
          "text-anchor": "left",
          "text-offset": [0.5, -0.2],
          "text-font": ["Open Sans Bold"],
          "text-size": 15,
        },
        paint: {
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
          "text-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#FF5252",
            "#1976D2",
          ],
        },
        filter: ["all", ["==", "$type", "Point"], ["==", "main", true]],
      };

      const source = { type: "geojson", data: geojson, generateId: true };
      map.addSource("railway", source);

      map.addLayer(stations);
      map.addLayer(main_stations);
      map.addLayer(station_names);
      map.addLayer(main_station_names);

      map.on("click", "stations", this.click_layer);
      map.on("click", "main_stations", this.click_layer);
      map.on("click", "station_names", this.click_layer);
      map.on("click", "main_station_names", this.click_layer);

      map.on("mouseover", "stations", this.mouse_enter);
      map.on("mouseover", "main_stations", this.mouse_enter);
      map.on("mouseover", "station_names", this.mouse_enter);
      map.on("mouseover", "main_station_names", this.mouse_enter);

      map.on("mouseleave", "stations", this.mouse_leave);
      map.on("mouseleave", "main_stations", this.mouse_leave);
      map.on("mouseleave", "station_names", this.mouse_leave);
      map.on("mouseleave", "main_station_names", this.mouse_leave);
    },
  },
  mounted: function () {
    const self = this;
    self.lang = this.$route.params.lang;
    self.lang = this.$route.params.lang;
    mapboxgl.accessToken =
      "pk.eyJ1IjoidHdpbnJhaWwiLCJhIjoiY2twcDJuYWoyMG9hNzJ2bzM0czc5dzI4bCJ9.s1mxyANzewlkyr0x07241Q";
    const map_data = {
      container: "map",
      style: "mapbox://styles/twinrail/ckvqnphia91jl14tgej8bg8cj/draft",
      minZoom: 3,
      maxZoom: 16,
      antialias: true,
    };
    map = new mapboxgl.Map(map_data);
    map.addControl(new mapboxgl.NavigationControl());
    this.$emit("is_ready");

    map.on("load", function () {
      self.set_map();
    });

  },
};
</script>
