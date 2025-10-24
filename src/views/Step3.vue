<template>
  <v-container>
    <div class="mx-auto pt-4 my-survey-wrapper">
      <v-card flat>
        <v-card-text class="pa-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <div v-for="(question, idx) in questions" class="survey-question" :key="`q-${idx}`"
                 v-if="form[question.id] !== undefined">
              <div class="question">
                Q{{ question.questionIndex + 1 }}. {{ question.title || $t(question.titleI18n) }}<required-mark v-if="question.required"/>
              </div>
              <template v-if="question.questionType === QUESTION_TYPE.question">
                <!-- Type Radio -->
                <template v-if="question.type === 'radio'">
                  <v-radio-group :rules="question.required ? [rules.requiredSelect] : []" v-model="form[question.id]">
                    <v-radio
                        v-for="o in question.options"
                        :key="'option-' + o.value"
                        :label="o.label"
                        :value="o.value"
                    />
                  </v-radio-group>
                </template>
                <!-- Type Radio -->

                <!-- Type Checkbox -->
                <template v-if="question.type === 'checkbox'">
                  <v-checkbox
                      v-model="form[question.id]"
                      v-for="(o,optionsIndex) in question.options"
                      :key="'option-' + o.value"
                      :label="o.label"
                      :value="o.value"
                      :rules="question.required ? [rules.requiredSelectCheckbox] : []"
                      :hide-details="question.options.length - 1 !== optionsIndex"
                  />
                </template>
                <!-- Type Checkbox -->

                <!-- Type Select -->
                <template v-if="question.type === 'select'">
                  <v-select
                      :rules="question.required ? [rules.requiredSelect] : []"
                      v-model="form[question.id]"
                      :items="question.options"
                      :placeholder="$t(question.placeholderI18n)"
                  ></v-select>
                </template>
                <!-- Type Select -->

                <!-- Type Text -->
                <template v-if="question.type === 'text'">
                  <v-text-field
                      :rules="[rules['max'], ...question.required ? [rules.requiredSelect] : []]"
                      v-model="form[question.id]"
                      :placeholder="$t(question.placeholderI18n)"
                  ></v-text-field>
                </template>
                <!-- Type Text -->
              </template>

              <!-- Q 商品の満足度 -->
              <template v-if="question.questionType === QUESTION_TYPE.satisfaction">
                <v-select
                    :rules="[rules.requiredSelect]"
                    v-model="form.satisfaction"
                    :items="stars"
                    :placeholder="$t(question.placeholderI18n)"
                ></v-select>
              </template>
              <!-- Q 商品の満足度 -->
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
  </v-container>
</template>

<script>
import { mask } from "vue-the-mask";
import RequiredMark from '../components/RequiredMark';
import { QUESTION_TYPE } from '../constants/questions';
import i18n from '../i18n';

export default {
  components: { RequiredMark },
  directives: {
    mask
  },
  data: () => ({
    QUESTION_TYPE,
    loading: false,
    form: {
      satisfaction: null
    },
    stars: [
      { text: i18n.t('page.step3.star5'), value: "5" },
      { text: i18n.t('page.step3.star4'), value: "4" },
      { text: i18n.t('page.step3.star3'), value: "3" },
      { text: i18n.t('page.step3.star2'), value: "2" },
      { text: i18n.t('page.step3.star1'), value: "1" }
    ],
    rules: {
      required: value => !!value || i18n.t('validation.required'),
      requiredSelect: value => !!value || i18n.t('validation.requiredSelect'),
      requiredSelectCheckbox: value => !!value.length || i18n.t('validation.requiredSelectCheckbox'),
      max: v => !v || (v && v.length <= 255) || i18n.t('validation.max', {num: 255})
    },
    valid: true
  }),
  methods: {
    clickedNext () {
      if (this.$refs.form.validate()) {
        this.goNext();
      }
    },
    async goNext () {
      let form = {};
      [{ id: "satisfaction" }, ...this.questions].forEach(q => {
        form[q.id] = this.form[q.id];
      });
      this.$store.commit("saveForm", form);
      this.loading = true
      const promises = []
      if (this.form.satisfaction && parseInt(this.form.satisfaction, 10) >= 1) {
        promises.push(this.$store.dispatch('getSendLimit'))
      }
      promises.push(this.$store.dispatch('getImageTest'))
      promises.push(this.$store.dispatch('getReviewVote'))
      await Promise.all(promises)

      this.$nextTick(async () => {
        if (this.reviewVote && parseInt(this.form.satisfaction, 10) >= 1) {
          await this.$router.push({ name: "step3ReviewVote" });
        } else if (this.imageTest) {
          await this.$router.push({ name: "step3ImageTest" });
        } else {
          this.$store.commit("saveStep", 4);
          await this.$router.push({ name: "step4" });
        }
        this.loading = false
      })
    }
  },
  computed: {
    brand () {
      return this.$store.getters.brandInfo;
    },
    questions () {
      return this.$store.getters.questions.filter(question => question.displayPage === this.$route.name)
    },
    imageTest () {
      return this.$store.getters.imageTest;
    },
    reviewVote () {
      return this.$store.getters.reviewVote;
    },
  },
  mounted () {
    this.questions.forEach(q => {
      this.$set(this.form, q.id, q.type === 'checkbox' ? [] : null);
    });
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.state.step < 3) {
        vm.$router.push({ name: "home" });
      } else if (vm.$store.state.step > 3) {
        Object.keys(vm.$store.state.form).forEach(key => {
          vm.form[key] = vm.$store.state.form[key];
        });
      }
    });
  }
};
</script>
