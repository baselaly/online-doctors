<template>
  <!--add dialog-->
      <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card v-if="loading" style="padding:50px; text-align:center;">
        <v-progress-circular indeterminate :size="70" :width="7" color="amber"></v-progress-circular>
      </v-card>
      <v-card v-if="!loading">
        <v-layout wrap justify-space-around align-center>
            <v-card-title style="text-align:center;">
            </v-card-title>
            <v-card-text style="word-break: break-all;">
                <v-flex class="textCenter" xs12 title>{{feedback.feedback}}</v-flex>
            </v-card-text>
            <v-card-text>
                <v-flex class="inline-class-style">
                <v-avatar
                size="50"
                class="grey lighten-4"
                >
                <img class="userImage" :src="feedback.doctor.image" alt="avatar">
                </v-avatar>
                </v-flex>
                <v-flex class="textCenter inline-class-style" xs12 title>Doctor: {{feedback.doctor.name}}</v-flex>
            </v-card-text>
            <v-card-text>
                <v-flex class="inline-class-style">
                <v-avatar
                size="50"
                class="grey lighten-4"
                >
                <img class="userImage" :src="feedback.patient.image" alt="avatar">
                </v-avatar>
                </v-flex>
                <v-flex class="textCenter inline-class-style" xs12 title>Patient: {{feedback.patient.name}}</v-flex>
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
    feedback: {
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
.textCenter {
  text-align: center !important;
  color: rgb(212, 212, 212);
}
.userImage {
  border: 3px solid white;
}
.inline-class-style {
  display: inline;
  margin: 5px 10px;
}
</style>