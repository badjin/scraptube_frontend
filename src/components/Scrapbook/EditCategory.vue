<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400px">
      <v-form v-model="valid">
        <v-card class="pa-4">
          <v-container>
            <v-card-text class="myFont33 text-center">{{subject}}</v-card-text>
            <v-row v-for="(category, index) in categories" :key="index">
              <v-col cols="12">
                <v-text-field :label="`Category ${index+1}`"
                              v-model="category.name"
                              :rules="[rules.required, rules.min3, rules.max12]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled="!valid">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script>

  import {mapState} from "vuex";

  export default {
    name: "EditCategory",

    data () {
      return {
        valid: false,
        dialog: false
      }
    },

    watch: {
      dialog (val) {
        val || this.close
      }
    },

    computed: {
      ...mapState(['rules']),
      ...mapState('scrapbook',['categories'])
    },

    methods: {
      open(subject) {
        this.dialog = true
        this.subject = subject

        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },

      async save() {
        await this.$store.dispatch('scrapbook/updateCategories')
        this.resolve(true)
        this.dialog = false
      },

      cancel() {
        this.$store.dispatch('scrapbook/getCategories')
        this.resolve(false)
        this.dialog = false
      },
    }
  }
</script>

<style scoped>

</style>
