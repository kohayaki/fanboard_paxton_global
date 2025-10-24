<template>
  <v-container>
    <div class="mx-auto pt-4 my-survey-wrapper">
      <v-card flat>
        <v-card-text class="pa-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <template v-for="question in questions">
              <template v-if="question.questionType === QUESTION_TYPE.reviewContent">
                <!-- reviewContent -->
                <div class="survey-question">
                  <div class="question"> Q{{ question.questionIndex + 1 }}. {{ $t(question.titleI18n) }}<required-mark/></div>
                  <div class="q-subtitle">{{ $t(question.subTitleI18n) }}</div>
                  <v-textarea
                      v-model="form.reviewContent"
                      :rules="[rules.required, rules.min50, rules.max]"
                      counter
                      :placeholder="$t(question.placeholderI18n)"
                      ref="review"
                  ></v-textarea>
                </div>
                <!-- reviewContent -->
              </template>

              <template v-if="question.questionType === QUESTION_TYPE.reviewCheck">
                <template v-if="showReviewLink">
                  <!-- (レビューボタン) -->
                  <div class="pb-5 mb-5">
                    <div class="mx-auto pt-4" style="max-width:350px;">
                      <v-card flat color="primary" @click="clickedFeedback">
                        <v-card-title class="white--text body-1 text-center">
                          <v-spacer></v-spacer>
                          <div>
                            <div class="title">{{ $t('page.step4.copyImpression') }}</div>
                            <div class="body-2">{{ $t('page.step4.transitToShop', { shopLabel }) }}</div>
                          </div>
                          <v-icon class="pl-3 pr-3" color="white">mdi-content-copy</v-icon>
                        </v-card-title>
                      </v-card>
                    </div>
                  </div>
                  <!-- (レビューボタン) -->
                   <!-- reviewCheck -->
                  <div v-if="shop" class="survey-question">
                    <div class="question">Q{{ question.questionIndex + 1 }}. {{ $t(question.titleI18n, { shopLabel }) }}</div>
                    <div class="q-subtitle">{{ $t(question.subTitleI18n, { shopLabel }) }}</div>
                    <v-checkbox v-model="form.reviewCheck" :label="$t('page.step4.confirmedReviewVote', {shopLabel})"></v-checkbox>
                  </div>
                  <!-- reviewCheck -->
                  
                </template>
              </template>

              <template v-if="question.questionType === QUESTION_TYPE.improvementComment">
                <!-- reviewContent -->
                <div class="survey-question">
                  <div class="question">Q{{ question.questionIndex + (showReviewLink ? 1 : 0) }}. {{ $t(question.titleI18n) }}</div>
                  <v-textarea
                      v-model="form.improvementComment"
                      :rules="[rules.max]"
                      counter
                      :placeholder="$t(question.placeholderI18n)"
                  ></v-textarea>
                </div>
                <!-- reviewContent -->
              </template>

              <template v-if="question.questionType === QUESTION_TYPE.email">
                <!-- email -->
                <div class="survey-question">
                  <div class="question">Q{{ question.questionIndex + (showReviewLink ? 1 : 0) }}. {{ $t(question.titleI18n) }}<required-mark/></div>
                  <div class="q-subtitle">{{ $t(question.subTitleI18n) }}</div>
                  <v-text-field
                      :rules="[rules.required, rules.emailSpace, rules.emailAtMark, rules.email]"
                      v-model="form.email"
                      label
                      :placeholder="$t(question.placeholderI18n)"
                  ></v-text-field>
                </div>
                <!-- email -->
              </template>
            </template>
          </v-form>
        </v-card-text>
      </v-card>
      <div class="text-center pa-4">
        <v-btn
            large
            depressed
            class="white--text"
            :style="`background-color:${brand.color.brand}`"
            :loading="loading"
            @click="clickedNext"
        >
          <span class="title px-4">{{ $t('button.send') }}</span>
        </v-btn>
      </div>
    </div>
    
     <div class="mx-auto pt-4" style="max-width:600px;">
          <p class="grey--text body-2 pt-4">
            <span v-html="$t('page.home.caution1Html', {brandName: brand.label})"></span>
            <br><br>
            <span v-html="$t('page.home.caution2Html')"></span>
          </p>

          <div class="text-center py-4">
            <v-icon class="grey--text pr-1 pb-1">mdi-email-outline</v-icon>
            <a :href="`mailto:${brand.emailAddress}`">
              <span class="title">{{ brand.emailAddress }}</span>
            </a>
          </div>
        </div>
    
  </v-container>
</template>

<script>
import _ from 'lodash'
import { mask } from "vue-the-mask";
import RequiredMark from '../components/RequiredMark';
import { QUESTION_TYPE } from '../constants/questions';
import i18n from '../i18n';

export default {
  directives: {
    mask
  },
  components: {
    RequiredMark,
  },
  data: () => ({
    QUESTION_TYPE,
    form: {
      reviewContent: null,
      reviewCheck: null,
      improvementComment: null,
      email: null
    },
    rules: {
      required: value => !!value || i18n.t('validation.required'),
      requiredSelect: value => !!value || i18n.t('validation.requiredSelect'),
      min: v => v.length >= 8 || i18n.t('validation.min', { num: 8 }),
      min50: v => !v || (v && v.length >= 50) || i18n.t('validation.min', { num: 50 }),
      max: v =>
          !v || (v && v.length <= 1024) || i18n.t('validation.max', { num: 1024 }),
      email: value => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) || i18n.t('validation.email'),
      emailAtMark: value => !(value || '').includes('＠') || i18n.t('validation.emailAtMark'),
      emailSpace: value => !(value || '').includes(' ') || i18n.t('validation.emailSpace'),
    },
    valid: true,
    loading: false
  }),
  methods: {
    clickedNext () {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.$nextTick(() => {
          this.goNext();
        });
      }
    },
    goNext () {
      const reviewContent = this.form.reviewContent;
      const reviewCheck = this.form.reviewCheck;
      const email = this.form.email;
      const improvementQuestion = this.questions.find(q => q.questionType === QUESTION_TYPE.improvementComment)
      if(improvementQuestion) {
        this.$store.commit("saveForm", { reviewContent, reviewCheck, email, [improvementQuestion.id]: this.form.improvementComment });
      } else {
        this.$store.commit("saveForm", { reviewContent, reviewCheck, email });
      }
      this.$store.dispatch("sendForm", {
        type: 'form',
        callback: () => {
          this.$store.commit("saveStep", 999);
          this.$router.push({ name: "complete" });
          this.loading = false;
        },
        errorCallback: () => {
          this.loading = false;
          alert(i18n.t('error.sendLater'));
        }
      });
    },
    clickedFeedback () {
      if (this.shop) {
        const url = this.shopReviewUrl;
        const textarea = this.$refs.review[0].$refs.input;
        textarea.select();
        document.execCommand("copy");
        window.open(url, "_blank");

        this.$store.dispatch('sendSendLimit')
      }
    }
  },
  computed: {
    brand () {
      return this.$store.getters.brandInfo;
    },
    orderID () {
      return this.$store.state.form.orderId;
    },
    questions () {
      return this.$store.getters.questions.filter(question => question.displayPage === this.$route.name)
    },
    shop () {
      const shopName = this.$store.state.form.channel;
      if (shopName) {
        return this.brand.shops.find(s => {
          return s.id == shopName;
        });
      }
      return null;
    },
    shopLabel () {
      if (this.shop) {
        if (this.shop.hasOwnProperty("reviewUrl")) {
          return this.shop.label;
        } else {
          return "Amazon";
        }
      }
      return null;
    },
    productInfo () {
      return this.$store.getters.productInfo;
    },
    shopReviewUrl () {
      if (this.shop) {
        if (this.shop.hasOwnProperty("reviewUrl")) {
          return this.shop.reviewUrl;
        } else {
          if (this.productInfo && this.productInfo.ASIN) {
            return "https://www.amazon.co.jp/gp/css/order-history";
          } else {
            return "https://www.amazon.co.jp/gp/css/order-history";
          }
        }
      }
      return null;
    },
    isSelectedReview () {
      const reviewScore = _.get(this.$store.state, ['form', 'satisfaction'], null);
      const filteringRate = _.get(this.$store.getters, ['productInfo', `review-${reviewScore}-offer-rate`], null)
      const randNumber = _.get(this.$store.state, 'randNumber', null)

      if (reviewScore && filteringRate && randNumber) {
        return randNumber < filteringRate
      }
      return false
    },
    isLessThanReviewLimit () {
      const reviewCount = this.$store.getters.currentSkuTodaysReviewCount
      const reviewScore = _.get(this.$store.state, ['form', 'satisfaction'], null);
      const reviewLimit = _.get(this.$store.getters, ['productInfo', `review-${reviewScore}-offer-limit`], null)
      return reviewLimit && reviewCount < reviewLimit
    },
    showReviewLink () {
      return this.shopReviewUrl && this.shopLabel && this.isSelectedReview && this.isLessThanReviewLimit
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.state.step < 4) {
        vm.$router.push({ name: "home" });
      }
      vm.form.reviewContent = vm.$store.state.form.reviewContent;
      vm.form.reviewCheck = vm.$store.state.form.reviewCheck;
      vm.form.email = vm.$store.state.form.email;
    });
  }
};
</script>
