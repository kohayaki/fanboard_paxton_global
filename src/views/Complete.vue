<template>
  <div>
    <v-container class="text-center mt-4 pt-3">
      <v-icon color="success lighten-1" size="100">mdi-check-circle-outline</v-icon>
      <div class="headline pt-4">{{ $t('page.complete.receivedApplication') }}</div>
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
