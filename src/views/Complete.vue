<template>
  <div>
    <v-container class="text-center mt-4 pt-3">
      <v-icon color="success lighten-1" size="100">mdi-check-circle-outline</v-icon>
      <div class="headline pt-4">{{ $t('page.complete.receivedApplication') }}</div>
    </v-container>
    <v-container>
      <div class="mx-auto pt-4" style="max-width:720px;">
        <v-divider></v-divider>
        <div class="survey-question">
          <div class="title pt-3">
            <v-icon class="pr-1 pb-1">mdi-menu-right</v-icon>{{ $t('page.complete.captionForLine', { giftCard }) }}
          </div>
          <div class="pl-3">
            {{ $t('page.complete.captionForLine', { giftCard }) }}
          </div>
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
        </div>
        <v-divider></v-divider>
        <div class="survey-question">
          <div class="title pt-3">
            <v-icon class="pr-1 pb-1">mdi-menu-right</v-icon>{{ $t('page.complete.customerWithoutLine') }}
          </div>
          <div class="pl-3">
            {{ $t('page.complete.captionForEmail', { giftCard }) }}
          </div>
          <div class="text-center py-4">
            <v-icon class="grey--text pr-1 pb-1">mdi-email-outline</v-icon>
            <a :href="`mailto:${brand.emailAddress}`">
              <span class="title">{{brand.emailAddress}}</span>
            </a>
          </div>
        </div>
        <v-divider></v-divider>
        <div class="text-center py-4 my-4">{{$t('page.complete.thanks')}}</div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { GIFTS } from '../constants/gifts';
import i18n from '../i18n';

export default {
  computed: {
    brand() {
      return this.$store.getters.brandInfo;
    },
    giftCard() {
      const type = _.get(this.$store, ['state', 'form', 'gift'], 'giftcard')
      return _.get(GIFTS.find(gift => gift.type === type), 'label', i18n.t('gift.giftcard.name'))
    }
  }
};
</script>
