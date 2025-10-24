<template>
  <v-container>
    <div class="mx-auto pt-4 my-survey-wrapper">
      <v-card flat>
        <v-card-text class="pa-0">
          <v-form ref="form">
            <!-- Q3 -->
            <div class="survey-question" v-for="question in questions">
              <div class="question">Q{{question.questionIndex + 1}}. {{ $t(question.titleI18n) }}<required-mark /></div>
              <div class="mx-auto pt-4" style="max-width:600px;">
                <div v-for="(item, idx) in products" :key="`item-${idx}`">
                  <product-card
                    :item="item"
                    :active="form.sku === item.sku"
                    @click-product="form.sku = item.sku"
                  ></product-card>
                </div>
              </div>
            </div>
            <!-- Q3 -->
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
          :disabled="form.sku == null"
        >
          <span class="title pl-4">
            <template v-if="form.sku == null">{{ $t('button.selectProduct') }}</template>
            <template v-else>{{ $t('button.next') }}</template>
          </span>
          <v-icon class="pl-2">mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import ProductCard from "@/components/ProductCard.vue";
import RequiredMark from '../components/RequiredMark';

export default {
  components: {
    ProductCard,
    RequiredMark,
  },
  data: () => ({
    form: {
      sku: null
    },
    loading: false
  }),
  methods: {
    clickedNext() {
      const sku = this.form.sku;
      this.$store.commit("saveForm", { sku });
      this.$store.commit("saveStep", 3);
      this.$router.push({ name: "step3" });
    }
  },
  computed: {
    brand() {
      return this.$store.getters.brandInfo;
    },
    allProducts() {
      return this.$store.state.products;
    },
    pProducts() {
      return this.$store.state.pProducts;
    },
    products() {
      if (this.allProducts && this.pProducts) {
        return this.pProducts.map(item => {
          return Object.assign(
            item,
            this.allProducts.find(pr => {
              return item.sku == pr.sku;
            })
          );
        });
      }
      return [];
    },
    questions() {
      return this.$store.getters.questions.filter(question => question.displayPage === this.$route.name)
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$store.state.step < 2) {
        vm.$router.push({ name: "home" });
      } else if (vm.$store.state.step > 2) {
        vm.form.sku = vm.$store.state.form.sku;
      }
    });
  }
};
</script>
