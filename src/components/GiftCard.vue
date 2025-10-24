<template>
  <v-card
      elevation="4"
      class="my-4"
      :style="{borderRadius: '8px', backgroundColor: this.bgColor || '#fff'}"
  >
    <v-responsive :aspect-ratio="16/10">
      <v-card-text v-if="type == 'amazon_giftcard'">
        <img class="py-2" style="width:90%;" src="@/assets/amazon_gift.jpg" />
        <div class="pt-1 pl-4">
          <span class="display-2 orange--text text--darken-1">{{amount}}</span>
          <span class="pl-1 title orange--text">{{ $t('gift.currency') }}</span>
        </div>
      </v-card-text>
      <v-card-text v-else-if="type == 'starbucks_giftcard'">
        <img class="py-0" style="width:95%;" src="@/assets/starbucks_gift.png" />
        <div class="pt-2 pl-4">
          <span class="display-2 green--text text--darken-3">{{amount}}</span>
          <span class="pl-1 title green--text text--darken-3">{{ $t('gift.currency') }}</span>
        </div>
      </v-card-text>
      <v-card-text v-else-if="type == 'quocard'">
        <img class="py-0" style="width:50%;" src="@/assets/quocard.jpg" />
        <div class="pt-2 pl-4">
          <span class="display-2 blue--text text--darken-4">{{amount}}</span>
          <span class="pl-1 title blue--text text--darken-4">{{ $t('gift.currency') }}</span>
        </div>
      </v-card-text>
    </v-responsive>
  </v-card>
</template>

<script>
export default {
  props: ["type", "amount", "bgColor"],
  computed: {
    color() {
      if (this.type == "starbucks_giftcard") {
        return "green";
      }
    }
  }
};
</script>
