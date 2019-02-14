<template>
  <!--add dialog-->
      <v-dialog v-model="dialog" persistent max-width="400px">
        <v-card>
        <v-card-title class="headline">Are you sure you want to delete that feedback?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="closeDialog">close</v-btn>
          <v-btn color="green darken-1" @click="deleteFeedback">Delete</v-btn>
        </v-card-actions>
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
    feedbackId: {
      required: true
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-delete-dialog", false);
    },
    deleteFeedback() {
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/feedback/delete/${this.feedbackId}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.$emit("close-delete-dialog", true);
        })
        .catch(error => {
          this.$emit("failed-delete-feedback");
        });
    }
  }
};
</script>
<style>
</style>