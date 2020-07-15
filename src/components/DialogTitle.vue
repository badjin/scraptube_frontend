<template>
  <div class="d-flex flex-no-wrap justify-space-between">
    <div>
      <v-card-title class="myFont33">{{title}}</v-card-title>
      <v-card-subtitle class="myFontNormal">{{subTitle}}</v-card-subtitle>
    </div>
    <v-img src="@/assets/dialog_logo.png"
           max-width="98"
           max-height="55"
           class="mt-2"
    >
    </v-img>
  </div>
</template>

<script>
  export default {
    props: ['title', 'subTitle']
  }
</script>
