<template>
  <v-card
    outlined
    hover
    class="mb-2"
    @click="clicked"
    :style="'color: transparent;' + (active ? 'border: 1px solid var(--brand-color) !important;border-radius:8px;opacity:1;': 'border: 1px solid #ddd;border-radius:8px;opacity:1;')"
  >
    <div class="d-flex flex-no-wrap justify-space-between">
      <div class="pa-4 grey--text text--darken-4">
        <v-card-title class="headline" v-text="title"></v-card-title>
        <v-card-subtitle></v-card-subtitle>
      </div>
      <v-avatar class="ma-3 pa-4" size="125" tile>
        <v-img contain :src="item['product-image']"></v-img>
      </v-avatar>
    </div>
  </v-card>
</template>

<script>
export default {
  props: ["item", "active"],
  methods: {
    clicked() {
      this.$emit("click-product");
    }
  },
  computed: {
    title() {
      if (this.item) {
        if (this.item.hasOwnProperty("product-name")) {
          return this.item["product-name"];
        }
        if (this.item.hasOwnProperty("sku")) {
          return this.item["sku"];
        }
      }
      return "--";
    }
  }
};
</script>
