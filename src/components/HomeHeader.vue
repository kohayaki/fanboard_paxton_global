<template>
  <v-container
    fluid
    class="pa-0 my-brand-bg-color"
    :style="`background:${brand.color.headerBackground} !important;`"
  >
    <v-card flat color="transparent">
      <v-card-title>
        <v-spacer></v-spacer>
        <template v-if="brand.homeLogo">
          <v-container>
            <img :src="brand.homeLogo" alt="brand.title" class="logoImg">
          </v-container>
        </template>
        <template v-else>
          <h1 class="title grey--text text--lighten-4 py-2">
            <v-icon
                :style="`color:${brand.color.headerTitle}`"
                class="pr-3 pb-1 hidden-xs-only"
            >mdi-wallet-giftcard</v-icon>
            <span :style="`color:${brand.color.headerTitle}`" v-html="brand.title"></span>
          </h1>
        </template>

        <v-spacer></v-spacer>
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script>
export default {
  computed: {
    brand() {
      return this.$store.getters.brandInfo;
    }
  }
};
</script>

<style scoped>
.logoImg {
  display: block;
  max-width: 100%;
  margin: 0 auto;
}
</style>
