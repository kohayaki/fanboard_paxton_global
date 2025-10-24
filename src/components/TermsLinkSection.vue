<template>
  <div class="text-center">
    <div class="mt-2 body-2">{{ $t('page.step1.approveTerms') }}</div>
    <div class="mt-2">
      <a :href="brand.termsURL" target="_blank">{{ $t('page.step1.terms') }}</a>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    brand () {
      return this.$store.getters.brandInfo;
    },
  }
}
</script>
