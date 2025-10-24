<template>
  <v-container>
    <div class="mx-auto pt-4 my-survey-wrapper">
      <v-card flat>
        <v-card-text class="pa-0">
          <v-form ref="form">
            <div class="survey-question" v-if="reviewVoteQuestion">
              <div class="question">
                Q{{ reviewVoteQuestion.questionIndex + 1 }}. {{ $t(reviewVoteQuestion.titleI18n) }}<required-mark/>
              </div>
              <div class="mx-auto pt-4" style="max-width:600px;">
                <template v-for="(rv, i) in transformedReviewVote">
                  <div class="mt-8">
                    <div>{{ i + 1 }}. {{ rv.title }}</div>
                    <div>{{ rv.content }}</div>
                    <div class="d-flex justify-center mt-5">
                      <v-btn
                          :color="reviewVoteSelected[i] === false ? 'primary' : undefined"
                          @click="() => onClickSympathize(i, false)"
                          depressed
                      >
                        {{ $t('page.step3ReviewVote.unsympathize') }}
                      </v-btn>
                      <v-btn
                          :color="reviewVoteSelected[i] === true ? 'primary' : undefined"
                          class="ml-8"
                          @click="() => onClickSympathize(i, true)"
                          depressed
                      >
                        {{ $t('page.step3ReviewVote.sympathize') }}
                      </v-btn>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
      <v-card flat v-if="selectedReviewVote.length">
        <v-card-text>
          <span v-html="$t('page.step3ReviewVote.thanksMessageHtml')"></span>

          <template v-for="rv in selectedReviewVote">
            <div class="mt-4 d-flex justify-center">
              <a
                  class="amazon-button"
                  :href="rv.link"
                  :style="`background-color:${brand.color.brand};`"
                  target="_blank"
              >
                {{ rv.index + 1 }}. {{ rv.title }}
              </a>
            </div>
          </template>

          <div class="d-flex justify-center">
            <v-checkbox v-model="reviewVoteChecked" :label="$t('page.step3ReviewVote.reviewChecked')"></v-checkbox>
          </div>
        </v-card-text>
      </v-card>
      <div class="text-center py-6">
        <v-btn
            large
            depressed
            class="white--text"
            :style="`background-color:${brand.color.brand}`"
            @click="clickedNext"
            :loading="loading"
            :disabled="disabledNextButton"
        >
          <span class="title pl-4">{{ $t('button.next') }}</span>
          <v-icon class="pl-2">mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import RequiredMark from '../components/RequiredMark';
import { QUESTION_TYPE } from '../constants/questions';

export default {
  components: {
    RequiredMark,
  },
  data: () => ({
    QUESTION_TYPE,
    reviewVoteSelected: [],
    reviewVoteChecked: false,
    loading: false
  }),
  methods: {
    clickedNext () {
      const indexes = this.reviewVoteSelected.map((item, i) => item === true ? i + 1 : null).filter(item => item !== null)
      const checked = (indexes.length && this.reviewVoteChecked) ? ' voted' : ''
      const data = indexes.join(',') + checked // join(', ')形式で送信する場合 2, 1, 3 のようなデータが日付になってしまうのでスペースなし
      this.$store.commit("saveForm", { [this.reviewVoteQuestion.id]: data });
      if (this.$store.getters.imageTest) {
        this.$router.push({ name: "step3ImageTest" });
      } else {
        this.$store.commit("saveStep", 4);
        this.$router.push({ name: "step4" });
      }
    },
    onClickSympathize (index, isSympathized) {
      this.reviewVoteSelected = this.reviewVoteSelected.map((cur, i) => index === i ? isSympathized : cur)
    },
  },
  mounted () {
    this.reviewVoteSelected = this.transformedReviewVote.map(_ => null)
  },
  computed: {
    brand () {
      return this.$store.getters.brandInfo;
    },
    questions () {
      return this.$store.getters.questions.filter(question => question.displayPage === this.$route.name)
    },
    reviewVoteQuestion () {
      return this.questions.find(q => q.questionType === QUESTION_TYPE.reviewVote)
    },
    transformedReviewVote () {
      return this.$store.getters.reviewVote.map((rv, i) => ({
        index: i,
        title: rv[1],
        content: rv[2],
        link: rv[3],
      }))
    },
    selectedReviewVote () {
      return this.reviewVoteSelected
          .map((item, i) => item ? this.transformedReviewVote[i] : null)
          .filter(Boolean)
    },
    disabledNextButton () {
      return this.transformedReviewVote.length !== this.reviewVoteSelected.filter(a => a != null).length
    },
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$store.state.step < 3) {
        vm.$router.push({ name: "home" });
      } else if (vm.$store.state.step > 3) {
        // 復元難しい
      }
    });
  }
};
</script>

<style lang="stylus" scoped>
.amazon-button {
  padding: 8px 16px;
  max-width: 400px;
  width: 100%;
  display: block;
  color: #fff !important;
  border-radius 4px;
  text-align: center;
  text-decoration none !important;
  transition-duration: 0.28s;
  transition-property: box-shadow, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    opacity: .9;
  }
}
</style>
