<template>
    <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card v-if="loading" style="padding:20px; text-align:center;">
    <div class="display-1" style="text-align:left!important;">
        <v-btn icon @click="closeDialog">
            <v-icon color="black">close</v-icon>
        </v-btn>
    </div>
    <v-progress-circular indeterminate :size="50" :width="5" color="blue darken-1"></v-progress-circular>
    </v-card>
    <v-card v-if="!loading">
    <div class="display-1 py-2">
        <v-btn icon @click="closeDialog">
            <v-icon color="black">close</v-icon>
        </v-btn>
    </div>
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
            <v-flex class="textCenter" xs12 headline>{{user.name}}</v-flex>
        <v-list>
            <v-subheader class="black--text text--lighten-4">
                <v-icon class="mx-2" large color="black">email</v-icon>
                {{user.email}}
            </v-subheader>
            <v-divider></v-divider>
            <v-subheader class="black--text text--lighten-4">
                <v-icon class="mx-2" large color="black">phone</v-icon>
                {{user.phone}}
            </v-subheader>
        </v-list>
        </v-card-text>
    </v-layout>
    </v-card>
</v-dialog>
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
      this.$emit("close-user-dialog");
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
}
</style>