<template>
  <v-container>
    <div class="mx-auto pt-4 my-survey-wrapper">
      <v-card flat>
        <v-card-text class="pa-0">
          <v-form ref="form">
            <div class="survey-question" v-if="imageTestQuestion">
              <div class="question">
                Q{{ imageTestQuestion.questionIndex + 1 }}. {{ $t(imageTestQuestion.titleI18n) }}<required-mark/>
              </div>
              <div class="mx-auto pt-4" style="max-width:600px;">
                <template v-for="(it, i) in transformedImageTest">
                  <div class="mt-8">
                    <v-card
                      outlined
                      hover
                      @click="() => onClickCard(i)"
                      :disabled="getOrder(i) !== null"
                    >
                      <div class="d-flex justify-space-between align-center pa-5">
                        <img :src="it.url" alt="" style="max-width: 200px; max-height: 200px;">
                        <div class="num-icon">{{ getOrder(i) }}</div>
                      </div>
                    </v-card>
                  </div>
                </template>
              </div>

              <div class="d-flex justify-center">
              <v-btn
                  depressed
                  class="mt-8"
                  @click="onClickReset"
                  :loading="loading"
                  :disabled="disabledNextButton"
              >
                {{ $t('button.reset') }}
              </v-btn>
              </div>
            </div>
          </v-form>
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
    selectedOrder: [],
    loading: false,
    showError: false,
  }),
  methods: {
    clickedNext () {
      this.showError = false
      if(!this.selectedOrder.length) {
        this.showError = true
        return
      }

      const data = this.selectedOrder.map(i => i + 1).join(',') // join(', ')形式で送信する場合 2, 1, 3 のようなデータが日付になってしまうのでスペースなし
      this.$store.commit("saveForm", { [this.imageTestQuestion.id]: data });
      this.$store.commit("saveStep", 4);
      this.$router.push({ name: "step4" });
    },
    onClickCard (index) {
      if(!this.selectedOrder.find(i => i === index)) {
        this.selectedOrder.push(index)
      }
    },
    onClickReset() {
      this.selectedOrder = []
    },
    getOrder(i) {
      const index = this.selectedOrder.findIndex(ord => ord === i)
      return index === -1 ? null : index + 1
    }
  },
  computed: {
    brand () {
      return this.$store.getters.brandInfo;
    },
    questions () {
      return this.$store.getters.questions.filter(question => question.displayPage === this.$route.name)
    },
    imageTestQuestion () {
      return this.questions.find(q => q.questionType === QUESTION_TYPE.imageTest)
    },
    imageTest() {
      return this.$store.getters.imageTest
    },
    transformedImageTest () {
      return this.$store.getters.imageTest.map((it, i) => ({
        index: i,
        url: it[1]
      }))
    },
    disabledNextButton () {
      return !this.selectedOrder.length
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
.num-icon {
  display: flex;
  align-items center;
  justify-content center;
  background-color: #eee;
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
</style>
