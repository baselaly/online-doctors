<template>
  <!--add dialog-->
      <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card v-if="loading" style="padding:50px; text-align:center;">
        <v-progress-circular indeterminate :size="70" :width="7" color="amber"></v-progress-circular>
      </v-card>
      <v-card v-if="!loading">
          <v-flex>
            <v-chip v-if="user.category" color="orange" text-color="white">
            <v-icon left>star</v-icon>
             {{user.rate}}
            </v-chip>
          </v-flex>
        <v-layout wrap justify-space-around align-center>
            <v-card-title style="text-align:center;">
                <v-avatar
                size="100"
                class="grey lighten-4"
                >
                <img class="userImage" :src="user.image" alt="avatar">
                </v-avatar>
            </v-card-title>
            <v-card-text>
                <v-flex class="textCenter" xs12 title>{{user.name}}</v-flex>
            <v-list>
                <v-subheader class="grey--text text--lighten-4">
                    {{user.email}}
                    <v-spacer></v-spacer>
                    <v-icon large color="grey lighten-5">email</v-icon>
                </v-subheader>
                <v-divider></v-divider>
                <v-subheader class="grey--text text--lighten-4">
                    {{user.address}}
                    <v-spacer></v-spacer>
                    <v-icon large color="grey lighten-5">location_on</v-icon>
                </v-subheader>
                <v-divider></v-divider>
                <v-subheader class="grey--text text--lighten-4">
                    {{user.phone}}
                    <v-spacer></v-spacer>
                    <v-icon large color="grey lighten-5">phone</v-icon>
                </v-subheader>
                <v-divider></v-divider>
                <v-subheader class="grey--text text--lighten-4">
                    {{user.role.name}}
                    <v-spacer></v-spacer>
                    <v-icon large color="grey lighten-5">perm_identity</v-icon>
                </v-subheader>
                <div v-if="user.category">
                <v-divider></v-divider>
                <v-subheader class="grey--text text--lighten-4">
                    {{user.category.name}}
                    <v-spacer></v-spacer>
                    <v-icon large color="grey lighten-5">label</v-icon>
                </v-subheader>
                </div>
                <v-divider></v-divider>
                <v-subheader v-if="user.category" class="grey--text text--lighten-4">
                    {{user.fees}} EGP
                    <v-spacer></v-spacer>
                    <v-icon large color="grey lighten-5">money</v-icon>
                </v-subheader>
            </v-list>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="closeDialog">Close</v-btn>
            </v-card-actions>
        </v-layout>
      </v-card>
    </v-dialog>
    <!--add dialog-->
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    user: {
      required: true,
      type: Object
    },
    loading: {
      required: true,
      type: Boolean,
      default: true
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-view-dialog");
    }
  }
};
</script>
<style>
.userImage {
  border: 3px solid white;
}
.textCenter {
  text-align: center !important;
  color: rgb(212, 212, 212);
}
</style>