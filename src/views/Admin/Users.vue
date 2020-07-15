<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs24 sm16 md8>
        <v-card class="mt-n12">
          <v-data-table dark dense
            :headers="headers"
            :items="users"
            class="elevation-1 pa-10 grey"
            :sort-by="['role_id', 'name']"
          >
            <template v-slot:item.avatar_id="{ item }">
              <v-avatar v-if="item.avatar_id > 0">
                <v-img :src="`${avatarUrl}users-${item.avatar_id}.svg`"/>
              </v-avatar>
              <v-avatar class="ma-1" v-else size="42">
                <v-img :src="item.avatar_image" max-height="100px" max-width="100px"/>
              </v-avatar>
            </template>

            <template v-slot:item.role_id="{ item }">
              {{ roles[item.role_id] }}
            </template>
            <template v-slot:item.actions="{ item }">
              <div v-if="roles[item.role_id] !== 'Admin'">
                <v-icon small class="mr-3" @click="editUser(item)">
                  mdi-pencil
                </v-icon>
                <v-icon v-if="userRole === 'Admin'" small @click="deleteUser(item)">
                  mdi-delete
                </v-icon>
              </div>
            </template>
          </v-data-table>

        </v-card>
        <user-profile ref="userProfile" :user="editedUser" :edit-flag="false"></user-profile>
        <confirm ref="confirm"></confirm>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import confirm from "../../components/ConfirmDialog"
  import UserProfile from "../../components/User/UserProfile"
  import {mapActions, mapState} from "vuex"

  export default {
    components: {
      UserProfile,
      confirm,
    },
    data: () => ({
      headers: [
        { text: 'Avatar', align: 'start',sortable: false, value: 'avatar_id' },
        { text: 'Name', align: 'center', value: 'name' },
        { text: 'Email', align: 'center',value: 'email' },
        { text: 'Role', align: 'center',value: 'role_id' },
        { text: 'Actions', align: 'end', value: 'actions', sortable: false },
      ],
      users: [],
      roles: ["TEST","Admin", "Staff", "Member"],
      editedIndex: -1,
      editedUser: {
        id: 1,
        avatar_id: 1,
        avatar_image: null,
        name: null,
        email: null,
        role_id: 4
      },
      defaultUser: {
        id: 1,
        avatar_id: 1,
        avatar_image: null,
        name: null,
        email: null,
        role_id: 4
      }
    }),

    created () {
      this.initialize()
    },

    computed: {
      ...mapState(['rules', 'themeColor', 'avatarUrl']),
      ...mapState('user', ['userRole']),
    },

    methods: {
      ...mapActions({
        updateMember: 'user/updateMember',
        deleteMember: 'user/deleteMember'
      }),

      async initialize () {
        if (!Object.keys(this.$store.state.user.users).length) {
          await this.$store.dispatch('user/getList')
        }
        this.users = this.$store.state.user.users

      },

      async editUser (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedUser = Object.assign({}, item)
        if (await this.$refs.userProfile.open('Member Info', 'Edit details.', true)) {
          this.save()
        }
        else this.close()

      },

      async deleteUser (item) {
        const index = this.users.indexOf(item)
        if (await this.$refs.confirm.open('Delete selected member.', 'Are you sure?', { color: this.themeColor.errorColor })) {
          this.editedUser = this.users[index]
          this.users.splice(index, 1)
          this.deleteMember(this.editedUser)
        }
      },

      close () {
        setTimeout(() => {
          this.editedUser = Object.assign({}, this.defaultUser)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.editedUser)
          this.close()
          this.updateMember(this.editedUser)
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .transparent {
    background-color: white!important;
    opacity: 0.8;
    border-color: transparent!important;
  }
</style>
