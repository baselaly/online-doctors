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
        <v-card-title class="headline">
            <div class="display-1 py-2">
                <v-btn icon @click="closeDialog">
                    <v-icon color="black">close</v-icon>
                </v-btn>
            </div>
            <v-spacer></v-spacer>
            patient feedback <v-icon class="mx-2" color="black">feedback</v-icon>
        </v-card-title>
        <v-card-text class="title">{{feedback}}</v-card-text>
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
    feedback: {
      required: true,
      type: String
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
      this.$emit("close-feedback-dialog");
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