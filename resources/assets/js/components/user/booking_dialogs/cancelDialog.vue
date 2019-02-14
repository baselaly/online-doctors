<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card color="white" style="padding:0px!important">
      <v-flex text-xs-center class="py-4 px-3">
        <label class="title">
          <v-icon color="black" size="30">report_problem</v-icon>Are you sure you want to cancel the appointment?
        </label>
      </v-flex>
      <v-flex text-xs-center xs12>
        <v-btn color="red" @click="cancelAppointment">Yes</v-btn>
        <v-btn color="blue lighten-1" @click="closeDialog">Cancel</v-btn>
      </v-flex>
      <v-snackbar v-model="snackbar" bottom left :color="snackbarColor">{{snackbarMessage}}</v-snackbar>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: ""
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    id: {
      required: true,
      type: Number
    }
  },
  created() {},
  methods: {
    cancelAppointment() {
      var token = localStorage.getItem("token");
      axios
        .get(`/api/user/cancelAppointment/${this.id}`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          this.$emit("close-cancel-dialog", true);
        })
        .catch(error => {
          this.activateSnackbar(true, "red", "something went wrong!");
        });
    },
    activateSnackbar(state, color, message) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = state;
    },
    closeDialog() {
      this.$emit("close-cancel-dialog", false);
    }
  }
};
</script>
<style>
.subheading {
  color: white;
}
.v-dialog {
  z-index: unset;
}
</style>