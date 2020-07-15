<template>
  <v-combobox
    v-model="tagModel"
    prepend-icon="mdi-tag"
    :filter="filter"
    :hide-no-data="!search"
    :items="tagItems"
    :search-input.sync="search"
    hide-selected
    label="Tags"
    multiple
    chips
  >
    <template v-slot:no-data>
      <v-list-item>
        <span class="subheading">Create</span>
        <v-chip
          label
          small
        >
          {{ search }}
        </v-chip>
      </v-list-item>
    </template>
    <template v-slot:selection="{ attrs, item, parent, selected }">
      <v-chip
        v-if="item === Object(item)"
        v-bind="attrs"
        color="orange lighten-3"
        :input-value="selected"
      >
          <span class="pr-2">
            {{ item.text }}
          </span>
        <v-icon
          @click="parent.selectItem(item)"
        >mdi-close</v-icon>
      </v-chip>
    </template>
    <template v-slot:item="{ index, item }">
      <v-text-field
        v-if="editing === item"
        v-model="editing.text"
        autofocus
        flat
        background-color="transparent"
        hide-details
        solo
        @keyup.enter="editTag(index, item)"
      ></v-text-field>
      <v-chip
        v-else
        label
        small
      >
        {{ item.text }}
      </v-chip>
      <v-spacer></v-spacer>
      <v-col class="text-right">
        <v-icon small class="mr-2" @click.stop.prevent="editTag(index, item)">
          {{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}
        </v-icon>
        <v-icon small @click.stop.prevent="deleteTag(index, item)">
          mdi-delete
        </v-icon>
      </v-col>
    </template>
  </v-combobox>
</template>

<script>
  export default {
    props: ['search', 'index', 'tagModel'],
    data: () => ({
      editing: null
    }),

    watch: {
      tagModel (val, prev) {
        if (prev !== null){
          if (val.length === prev.length)
            return
        }
        this.tagModel = val.map(v => {
          if (typeof v === 'string') {
            v = {
              text: v
            }
            this.tagItems.push(v)
          }
          return v
        })
        this.$emit('updateModel', this.tagModel)
      }
    },

    computed: {
      tagItems: {
        get() {
          return this.$store.state.scrapbook.tags
        },
        set(value) {
          this.$store.state.scrapbook.tags = value
        }
      }
    },

    methods: {
      editTag (index, item) {
        if (!this.editing) {
          this.editing = item
          this.index = index
        } else {
          this.editing = null
          this.index = -1
        }
      },
      deleteTag(index, item) {
        this.tagItems.splice(this.tagItems.indexOf(item), 1)
      },
      filter (item, queryText, itemText) {
        if (item.header) return false

        const hasValue = val => val != null ? val : ''

        const text = hasValue(itemText)
        const query = hasValue(queryText)

        return text.toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      },
    },
  }
</script>
