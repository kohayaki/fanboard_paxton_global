<template>
  <v-app
    class="myapp"
    :style="`--brand-color:${brand.color.brand}; --header-bgcolor:${brand.color.headerBackground};`"
  >
    <v-content>
      <home-header v-if="isActiveHomeHeader"></home-header>
      <survey-header v-else-if="stepNumber >= 0" :page="stepNumber"></survey-header>
      <transition appear name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import HomeHeader from "@/components/HomeHeader.vue";
import SurveyHeader from "@/components/SurveyHeader.vue";

export default {
  components: {
    HomeHeader,
    SurveyHeader
  },
  computed: {
    brand() {
      return this.$store.getters.brandInfo;
    },
    isActiveHomeHeader() {
      const page = this.$route.name;
      return page === "home" || page === "complete" || page === 'completeFollowUp';
    },
    stepNumber() {
      switch(this.$route.name) {
        case 'step1':
          return 1;
        case 'step2':
          return 2;
        case 'step3':
        case 'step3ImageTest':
        case 'step3ReviewVote':
          return 3;
        case 'step4':
          return 4;
        default:
          return null
      }
    }
  }
};
</script>


<style lang="stylus">
html, body, button, .v-application {
  font-family: 'Lato', 'Noto Sans JP', '游ゴシック Medium', '游ゴシック体', 'Yu Gothic Medium', YuGothic, 'ヒラギノ角ゴ ProN', 'Hiragino Kaku Gothic ProN', 'メイリオ', Meiryo, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.v-application.myapp {
  @media only screen and (max-width: 959px) {
    .v-stepper:not(.v-stepper--vertical) .v-stepper__label {
      display: block;
    }
  }

  @media only screen and (max-width: 750px) {
    .v-stepper:not(.v-stepper--vertical) .v-stepper__label {
      display: none;
    }
  }

  .theme--dark.v-stepper .v-stepper__step__step.primary {
    background-color: #000 !important;
    border-color: #000 !important;
    color: var(--header-bgcolor);
  }

  .theme--dark.v-stepper .v-stepper__step__step .v-icon {
    color: var(--header-bgcolor);
  }

  .primary--text {
    color: var(--brand-color) !important;
    caret-color: var(--brand-color) !important;
  }

  .primary {
    background-color: var(--brand-color) !important;
    border-color: var(--brand-color) !important;
  }

  a {
    color: var(--brand-color);
    text-decoration: underline dotted;
  }

  .my-japanese {
    span {
      display: inline-block;
    }
  }

  .my-survey-wrapper {
    max-width: 720px;
  }

  .survey-question {
    padding-top: 10px;
    padding-bottom: 20px;
  }

  .question {
    font-size: 20px;
    line-height: 32px;
    font-weight: normal;
    padding-bottom: 4px;
    color: #444;
  }

  .q-subtitle {
    padding: 6px 0 3px 0;
    white-space: pre-wrap;
  }
}
</style>
