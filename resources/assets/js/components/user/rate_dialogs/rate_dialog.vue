<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card color="white" style="padding:0px!important">
      <div class="display-1 py-3">
        <v-btn icon @click="closeDialog">
          <v-icon color="black">close</v-icon>
        </v-btn>
        <label class="pl-5">THANK YOU</label>
      </div>
      <v-spacer></v-spacer>
      <v-form>
        <v-flex xs12 pa-2>
          <v-textarea box name="input-7-4" label="Feedback" v-model.trim="feedback"></v-textarea>
        </v-flex>
        <div class="text-xs-center pa-2">
          <v-rating
            v-model="rating"
            size="50"
            background-color="blue-grey lighten-2"
            color="yellow accent-4"
            dense
            half-increments
            hover
            empty-icon="$vuetify.icons.ratingFull"
          ></v-rating>
        </div>
        <v-flex xs12 class="text-xs-center">
          <v-btn color="info" @click="rateDoctor">Submit</v-btn>
        </v-flex>
      </v-form>
      <v-snackbar v-model="snackbar" bottom left :color="snackbarColor">{{snackbarMessage}}</v-snackbar>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      rating: 0,
      feedback: "",
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
    appointment_id: {
      required: true
    }
  },
  created() {},
  methods: {
    rateDoctor() {
      var token = localStorage.getItem("token");
      var data = {
        rate: this.rating,
        appointment_id: this.appointment_id,
        feedback: this.feedback
      };
      if (this.checkRateForm()) {
        axios
          .post(`/api/user/rateDoctor`, data, {
            headers: {
              Authorization: "Bearer " + token
            }
          })
          .then(response => {
            this.rating = 0;
            this.feedback = "";
            this.$emit("close-rate-dialog", true);
          })
          .catch(error => {
            this.activateSnackbar(true, "red", "something went wrong");
          });
      } else {
        this.activateSnackbar(true, "red", "please rate this appointment");
      }
    },
    checkRateForm() {
      if (this.rating == 0) {
        return false;
      } else {
        return true;
      }
    },
    activateSnackbar(state, color, message) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = state;
    },
    closeDialog() {
      this.rating = 0;
      this.feedback = "";
      this.$emit("close-rate-dialog", false);
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