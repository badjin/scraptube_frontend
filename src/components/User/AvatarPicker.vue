<template>
  <v-dialog width="400" v-model="show" persistent>
    <v-card>
      <v-toolbar dark :color="themeColor.cardTitleColor">
        <v-btn icon dark @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Select an Avatar</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-row no-gutters class="pt-4">
        <v-row no-gutters v-for="i in 4" :key="i" class="pb-6">
          <v-col cols="12" v-for="j in 4" :key="j" sm="3" class="text-center">
            <v-btn class="mx-2" fab icon @click="selectAvatar((i-1)*4+j)">
              <v-avatar
                class="avatar-picker-avatar"
                :class="{ 'current': (i-1)*4+j === currentAvatar }"
              >
                <img :src="`${avatarUrl}users-${(i-1)*4+j}.svg`">
              </v-avatar>
            </v-btn>
          </v-col>
        </v-row>
        </v-row>
        <v-flex>
          <v-btn block dark :color="themeColor.btnColor" @click="onPickFile">Upload Image</v-btn>
          <input type="file"
                 style="display: none"
                 ref="fileInput"
                 accept="image/png,image/jpg,image/jpeg,image/gif,"
                 @change="onFilePicked"
          >
        </v-flex>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapState} from "vuex"
  export default {
    props: {
      currentAvatar: {
        type: Number,
        required: true
      },
      value: Boolean
    },
    data() {
      return {
        image: null
      }
    },
    computed: {
      ...mapState(['rules', 'themeColor', 'avatarUrl']),
      show: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    },
    created() {

    },
    methods: {
      selectAvatar (avatar) {
        if (avatar){
          this.image = null
        }
        this.$emit('selected', {avatar, 'image': this.image})
        this.show = false
      },
      onPickFile() {
        this.$refs.fileInput.click()
      },
      onFilePicked(e) {
        let file = e.target.files[0]
        if (file.name.lastIndexOf('.') <= 0)
          return alert('Please add a valid file!')

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          this.image = e.target.result
          this.selectAvatar(0)
        }
      }
    }
  }
</script>
