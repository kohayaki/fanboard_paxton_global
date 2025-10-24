<template>
  <div>
    <v-container fluid :style="`background:${brand.color.heroBackground} !important;`">
      <v-container class="text-center pt-4 px-0 mt-4">
        <div class="mx-auto my-japanese" style="max-width:600px;">
          <h3
            class="display-1 py-3"
            :style="`color:${brand.color.heroTitle} !important;`"
            v-html="brand.heroTitle"
          ></h3>
        </div>
        <template v-if="!hideGiftSelect">
          <template v-if="isSingleGift">
            <div class="mx-auto pt-4" style="max-width:220px;">
              <gift-card :type="gifts[0].type" :amount="gifts[0].amount" :bg-color="brand.color.giftCardBackground"></gift-card>
            </div>
          </template>
          <template v-else>
            <div class="mx-auto pt-4" style="max-width:800px;">
              <v-item-group active-class="transparent" v-model="giftIdx">
                <v-container>
                  <v-row>
                    <v-col
                        v-for="(gift, i) in gifts"
                        :key="i"
                        cols="12"
                        :md="cardItemSize"
                        class="pa-0 px-2"
                    >
                      <v-item v-slot:default="{ active, toggle }">
                        <v-card
                            class="d-flex align-center"
                            flat
                            color="transparent"
                            :ripple="false"
                            :style="active ? 'border: 1px solid ' + selectColor + ' !important;border-radius:8px;opacity:1;': 'border: 2px solid #fff;border-radius:8px;opacity:.8;'"
                            height="180"
                            @click="toggle"
                        >
                          <div class="mx-auto" style="max-width:220px;">
                            <gift-card :type="gift.type" :amount="gift.amount" :bg-color="brand.color.giftCardBackground"></gift-card>
                          </div>
                        </v-card>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-container>
              </v-item-group>
            </div>
          </template>
        </template>

        <div class="mx-auto pt-4" style="max-width:600px;">
          <p
            class="subtitle-1 py-4"
            :style="`color:${brand.color.heroContent} !important;`"
            v-html="brand.heroContent"
          ></p>
        </div>
      </v-container>
    </v-container>
    <v-container fluid :style="`background:${brand.color.topBottomBackground || 'transparent'} !important;`">
      <v-container class="text-left grey--text text--darken-3 pb-4 mb-4">
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
        <template v-if="isSingleGift">
          <div class="text-center py-4 mb-4">
            <v-btn
                depressed
                :style="`background-color:${brand.color.brand}`"
                large
                class="white--text"
                @click="clickedApply"
            >
              <v-icon class="pr-1">mdi-menu-right</v-icon>
              <span class="title pr-2">{{$t('button.apply')}}</span>
            </v-btn>
          </div>
        </template>
        <template v-else>
          <div class="mx-auto pt-4" style="max-width:450px;">
            <v-select
                :label="$t('page.home.selectorLabel')"
                v-model="form.gift"
                :items="giftOptions"
                outlined
                :placeholder="$t('page.home.selectorPlaceHolder')"
            ></v-select>
          </div>
          <div class="text-center py-4 mb-4">
            <v-btn
                depressed
                :style="`background-color:${brand.color.brand}`"
                large
                class="white--text"
                @click="clickedApply"
                :disabled="form.gift == null"
            >
              <v-icon class="pr-1">mdi-menu-right</v-icon>
              <span class="title pr-2">
              <template v-if="form.gift">{{$t('button.apply')}}</template>
              <template v-else>{{$t('button.selectCard')}}</template>
            </span>
            </v-btn>
          </div>
        </template>

        <TermsLinkSection v-if="brand.termsURL" />
        
            <div class="text-center py-4">
            <a :href="brand.lineAddFriendUrl" target="_blank">
              <img
                style="width: auto;"
                height="36"
                border="0"
                src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"
              />
            </a>
          </div>
        
      </v-container>
      
    </v-container>
  </div>

  
</template>

<script>
import GiftCard from "@/components/GiftCard.vue";
import TermsLinkSection from "@/components/TermsLinkSection.vue";
import { GIFTS } from '../constants/gifts';
export default {
  components: {
    GiftCard,
    TermsLinkSection,
  },
  data: () => ({
    form: {
      gift: null
    }
  }),
  methods: {
    clickedApply() {
      const gift = this.isSingleGift ? this.gifts[0].type : this.form.gift;
      this.$store.commit("saveForm", { gift });
      this.$store.commit("saveStep", 1);
      this.$router.push({ name: "step1" });
    }
  },
  computed: {
    brand() {
      return this.$store.getters.brandInfo;
    },
    gifts() {
      if (this.brand) {
        return this.brand.gifts;
      }
      return [];
    },
    isSingleGift() {
      if (this.gifts) {
        return this.gifts.length == 1;
      }
      return false;
    },
    cardItemSize() {
      if (this.gifts) {
        const c = this.gifts.length;
        if (c == 3) {
          return 4;
        } else if (c == 2) {
          return 6;
        }
      }
      return 12;
    },
    selectColor() {
      if (this.form.gift) {
        const config = GIFTS.find(g => g.type == this.form.gift);
        if (config) {
          return config.color;
        }
      }
      return "#000";
    },
    giftOptions() {
      if (this.gifts) {
        return this.gifts
          .filter(g => GIFTS.map(gc => gc.type).indexOf(g.type) >= 0)
          .map(g => {
            const label = GIFTS.find(gc => gc.type === g.type).label
            return {
              text: `${label}(${g.amount}${this.$t('gift.currency')})`,
              value: g.type
            };
          });
      }
      return [];
    },
    giftIdx: {
      get() {
        if (this.gifts && this.form.gift) {
          return this.gifts.findIndex(g => {
            return g.type == this.form.gift;
          });
        }
        return null;
      },
      set(val) {
        this.form.gift = this.gifts[val].type;
      }
    },
    hideGiftSelect() {
      return _.get(this.$store.getters, ['brandInfo', 'autoSelectFirstGift'], false)
    },
  },
  mounted() {
    if (_.get(this.$store.getters, ['brandInfo', 'autoSelectFirstGift'], false)) {
      this.form.gift = this.gifts[0].type
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.form.gift = vm.$store.state.form.gift;
    });
  }
};
</script>




