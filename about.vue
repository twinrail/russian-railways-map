<template>
  <v-card elevation="0" class="pb-8">
    
  <v-img
      src="header.jpg"
    ></v-img>

    <v-card-title class="pb-2" v-if="lang === 'ja'">ロシア鉄道地図について</v-card-title>
    <v-card-title class="pb-2" v-else>About China Railway Guide</v-card-title>

    <v-card-text v-if="lang === 'ja'">
      列車検索･時刻表･路線図の機能が利用できます。<br />
      当サイトのデータはロシア鉄道公式サイトから取得しています。
    </v-card-text>
    <v-card-text v-else>
      You can use the features of train search, timetable, route map.<br />
      The data on this website is taken from the official Russian Railways website.
    </v-card-text>

    <v-card-title class="pb-2" v-if="lang === 'ja'">免責事項</v-card-title>
    <v-card-title class="pb-2" v-else>Disclaimer</v-card-title>

    <v-card-text v-if="lang === 'ja'">
      当サイトは個人が運営しておりロシア鉄道とは関係ありません。<br />
      最新の時刻はロシア鉄道の公式サイトで確認してください。<br />
      当サイトにより損害が生じても一切の責任を負いません。<br />
      当サイトの全ての著作権はCC BY-SAに従います。
    </v-card-text>
    <v-card-text v-else>
      This website is operated by a private individual and is not affiliated
      with Russian Railway.<br />
      For the latest timetable, please check the official website
      of Russian Railway.<br />
      We are not responsible for any damage caused by this site.<br />
      All rights of this website are subject to CC BY-SA.
    </v-card-text>

    <v-card-title class="pb-2" v-if="lang === 'ja'">作者</v-card-title>
    <v-card-title class="pb-2" v-else>Author</v-card-title>

    <v-card-text v-if="lang === 'ja'">
      当サイトへの意見･指摘等はtwitterかメールにてご連絡ください。<br />
      Mail: twinrail at gmail dot com
    </v-card-text>
    <v-card-text v-else>
      If you have any opinions or suggestions about this site, please contact us
      via twitter or email.<br />
      Mail: twinrail at gmail dot com
    </v-card-text>

    <a
      href="https://twitter.com/twinrail_ut"
      target="_blank"
      rel="noopener noreferrer"
      class="text-decoration-none"
    >
      <v-card class="mx-4 align-center d-flex primary--text" outlined link>
        <div>
          <v-avatar class="ml-4">
            <img src="twinrail.jpg" />
          </v-avatar>
        </div>
        <div>
          <v-card-title>
            twinrail
          </v-card-title>
          <v-card-subtitle>twitter.com</v-card-subtitle>
        </div>
      </v-card>
    </a>
  </v-card>
</template>

<script>
module.exports = {
  data: () => ({
    lang: null,
    header: {
      title: {
        ja: "ロシア鉄道地図",
        en: "Russian Railways Map",
      },
    },
  }),
  created: function () {
    this.lang = this.$route.params.lang;
    document.title = this.header.title[this.lang];
  },
};
</script>
