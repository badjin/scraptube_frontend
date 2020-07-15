<template>
  <v-pagination
    v-model="currentPage"
    :length="lastPage"
    :total-visible="8"
  ></v-pagination>
</template>

<script>
  export default {
    name: "Paginate",
    props: ['table', 'keyword', 'store'],
    watch: {
      currentPage (newVal) {
        this.paginatePage(newVal)
      }
    },
    computed: {
      currentPage: {
        get() {
          return this.$store.state[this.store].currentPage
        },
        set(value) {
          this.$store.commit(this.store+'/SET_CURRENT_PAGES',value)
        }
      },
      lastPage: {
        get() {
          return this.$store.state[this.store].lastPage
        }
      }
    },
    methods: {
      paginatePage(pageNumber) {
        this.$store.dispatch(this.store+'/getList', {
          page: pageNumber,
          table: this.table,
          keyword: this.keyword
        })
      }
    }
  }
</script>

<style scoped>

</style>
