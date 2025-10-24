<template>
  <v-container fluid pa-0 pb-4>
    <v-stepper
      dark
      :value="page"
      class="elevation-0 my-stepper"
      :style="`border-radius:0; background:${brand.color.headerBackground} !important;`"
    >
      <v-stepper-header>
        <template v-for="s in steps">
          <v-stepper-step
            :complete="s.step < page"
            :key="'step-' + s.step"
            :step="s.step"
          >{{s.title}}</v-stepper-step>
          <v-divider :key="'step-d-' + s.step" v-if="s.step < steps.length"></v-divider>
        </template>
      </v-stepper-header>
    </v-stepper>
  </v-container>
</template>

<script>
export default {
  data: () => ({

  }),
  props: ["page"],
  computed: {
    brand() {
      return this.$store.getters.brandInfo;
    },
    steps() {
      return [
        {
          step: 1,
          title: this.$t('header.step1'),
        },
        {
          step: 2,
          title: this.$t('header.step2'),
        },
        {
          step: 3,
          title: this.$t('header.step3'),
        },
        {
          step: 4,
          title: this.$t('header.step4'),
        }
      ]
    },
  }
};
</script>

