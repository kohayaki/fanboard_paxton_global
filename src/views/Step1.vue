<template>
  <v-container>
    <div class="mx-auto pt-4 my-survey-wrapper">
      <v-card flat>
        <v-card-text class="pa-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <div class="survey-question" v-for="question in questions">
              <template v-if="question.questionType === QUESTION_TYPE.shop">
                <div class="question">Q{{question.questionIndex + 1}}. {{ $t(question.titleI18n) }}<required-mark /></div>
                <v-radio-group v-model="form.channel" :rules="[rules.requiredSelect]">
                  <v-radio
                      v-for="o in shops"
                      :key="'option-' + o.id"
                      :label="o.label"
                      :value="o.id"
                      :disabled="loading"
                  ></v-radio>
                </v-radio-group>
              </template>
              <template v-if="question.questionType === QUESTION_TYPE.orderId">
                <div class="question">Q{{question.questionIndex + 1}}. {{ $t(question.titleI18n) }}<required-mark /></div>
                <div class="q-subtitle" v-if="selectedShop && selectedShop.hasOwnProperty('url')" v-html="$t(question.subTitleI18n, {shopLink: shopLinkHTML})"></div>
                <template v-if="selectedShop">
                  <template v-if="selectedShop.hasOwnProperty('masks')">
                    <v-text-field
                        key="fa"
                        :placeholder="$t(question.placeholderI18n)"
                        :rules="[rules.required, rulesByMasks(selectedShop.masks)]"
                        v-mask="selectedShop.masks"
                        v-model="form.orderId"
                        :hint="$t(question.hintI18n)"
                    ></v-text-field>
                  </template>
                  <template v-else>
                    <v-text-field
                        key="fo"
                        placeholder="注文番号"
                        :rules="[rules.required]"
                        v-model="form.orderId"
                        hint="記入例：123-4567890-1234567"
                    ></v-text-field>
                  </template>
                </template>
                <template v-else>
                  <v-text-field placeholder="注文番号" disabled hint="記入例：123-4567890-1234567"></v-text-field>
                </template>
              </template>
              <template v-if="question.questionType === QUESTION_TYPE.email">
                <!-- email -->
                <div class="survey-question">
                  <div class="question">Q{{ question.questionIndex + 1 }}. {{ $t(question.titleI18n) }}<required-mark/></div>
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
            </div>
          </v-form>
        </v-card-text>
      </v-card>
      <div class="text-center pa-4">
        <v-btn
          large
          depressed
          class="white--text"
          :style="`background-color:${brand.color.brand}`"
          @click="clickedNext"
          :loading="loading"
        >
          <span class="title pl-4">{{ $t('button.next') }}</span>
          <v-icon class="pl-2">mdi-chevron-right</v-icon>
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
import { mask } from "vue-the-mask";
import RequiredMark from '../components/RequiredMark';
import { QUESTION_TYPE } from '../constants/questions';
import i18n from '../i18n';
import TermsLinkSection from "@/components/TermsLinkSection.vue";

export default {
  directives: {
    mask
  },
  components:{
    RequiredMark,
    TermsLinkSection,
  },
  data: () => ({
    QUESTION_TYPE,
    form: {
      channel: null,
      orderId: "",
      email: '',
    },
    loading: false,
    rules: {
      required: value => !!value || i18n.t('validation.required'),
      requiredSelect: value => !!value || i18n.t('validation.requiredSelect'),
      min: v => v.length >= 8 || i18n.t('validation.min', { num: 8 }),
      email: value => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) || i18n.t('validation.email'),
      emailAtMark: value => !(value || '').includes('＠') || i18n.t('validation.emailAtMark'),
      emailSpace: value => !(value || '').includes(' ') || i18n.t('validation.emailSpace'),
    },
    valid: true
  }),
  methods: {
    rulesByMasks(masks) {
      const strs = masks.map(m => m.replace(/#/g, "\\d"));
      const rule = v => {
        return (
          strs.some(str => {
            return new RegExp(`^${str}$`, "g").test(v);
          }) || i18n.t('validation.orderIdMask')
        );
      };
      return rule;
    },
    async clickedNext() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        await this.checkOrderNumber();
      }
    },
    async checkOrderNumber() {
      const orderNumber = this.form.orderId;
      const channel = this.form.channel;
      try {
        const { existsOrderNumber, purchasedOverOneWeekAgo } = await this.$store.dispatch("checkOrderNumber", { orderNumber, channel })
        if (existsOrderNumber) {
          this.goNext(purchasedOverOneWeekAgo);
        } else {
          alert(i18n.t('error.enterCorrectOrderId'))
        }
      } catch(e) {
        alert(i18n.t('error.sendLater'));
        this.loading = false;
      }
      this.loading = false;
    },
    goNext(purchasedOverOneWeekAgo) {
      const channel = this.form.channel;
      const orderId = this.form.orderId;
      const email = this.form.email;
      if(this.emailQuestion) {
        this.$store.commit("saveForm", { channel, orderId, email });
      } else {
        this.$store.commit("saveForm", { channel, orderId });
      }

      if(this.emailQuestion && !purchasedOverOneWeekAgo) {
        this.$store.dispatch("sendForm", {
          type: 'followup',
          callback: () => {
            this.$router.push({ name: "completeFollowUp" });
            this.loading = false;
          },
          errorCallback: () => {
            alert(i18n.t('error.sendLater'));
            this.loading = false;
          }
        });
      } else if (!purchasedOverOneWeekAgo) {
        alert(i18n.t('error.shouldApplyAfterOneWeek'));
      } else {
        this.$store.commit("saveStep", 2);
        this.$router.push({ name: "step2" });
        this.loading = false;
      }
    }
  },
  computed: {
    questions() {
      return this.$store.getters.questions.filter(question => question.displayPage === this.$route.name)
    },
    emailQuestion() {
      return this.questions.find(q => q.questionType === QUESTION_TYPE.email)
    },
    selectedShop() {
      if (this.brand && this.form.channel) {
        return this.brand.shops.find(s => s.id == this.form.channel);
      }
      return null;
    },
    shops() {
      if (this.brand) {
        return this.brand.shops;
      }
      return [];
    },
    brand() {
      return this.$store.getters.brandInfo;
    },
    shopLinkHTML() {
      return `<a href="${this.selectedShop.url}" target="_blank">${this.selectedShop.label}<a>`
    },
  },
  mounted () {
    if (this.shops.length === 1) {
      this.form.channel = this.shops[0].id
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$store.state.step < 1) {
        vm.$router.push({ name: "home" });
      } else if (vm.$store.state.step > 1) {
        vm.form.channel = vm.$store.state.form.channel;
        vm.form.orderId = vm.$store.state.form.orderId;
      }
    });
  }
};
</script>
