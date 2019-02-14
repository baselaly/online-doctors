<template>
  <!--edit dialog-->
      <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card v-if="loading" style="padding:50px; text-align:center;">
        <v-progress-circular indeterminate :size="70" :width="7" color="amber"></v-progress-circular>
      </v-card>
      <v-card v-if="!loading">
        <v-card-title>
          <span class="headline">Edit feedback</span>
        </v-card-title>
        <v-card-text>
              <v-form v-model="formValid">
                <v-container>
                  <v-layout row wrap>
                  <v-text-field multi-line hint="enter your feedback" :rules="feedbackRules" v-model="feedback.feedback" label="Feedback"></v-text-field>
                <v-flex xs12>
                <v-autocomplete
                  :items="patients"
                  :filter="patientFilter"
                  v-model="feedback.patient_id"
                  item-text="name"
                  item-value="id"
                  label="Patient"
                  :rules="requiredRules"
                ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                <v-autocomplete
                  :items="doctors"
                  :filter="doctorFilter"
                  v-model="feedback.doctor_id"
                  item-text="name"
                  item-value="id"
                  label="Doctor"
                  :rules="requiredRules"
                ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-btn color="info" :disabled="!formValid" @click="editFeedback">Save</v-btn>
                  <v-btn color="red" @click="closeDialog">Close</v-btn>
                </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
        </v-card-text>
      <v-snackbar class="snackbar_style" top v-model="snackbar" :color="snackbarColor">
        {{snackbarMessage}}
      </v-snackbar>
      </v-card>
    </v-dialog>
    <!--add dialog-->
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "",
      formValid: true,
      requiredRules: [v => !!v || "this field is required"],
      feedbackRules: [
        v => !!v || "this field is required",
        v => v.length <= 400 || "feedback has maximum 400 characters"
      ]
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    loading: {
      default: true,
      type: Boolean,
      required: true
    },
    feedback: {
      required: true,
      type: Object
    },
    doctors: {
      type: Array,
      required: true
    },
    patients: {
      type: Array,
      required: true
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-edit-dialog", false);
    },
    editFeedback() {
      if (this.formValid) {
        var token = localStorage.getItem("token");
        axios
          .post(`/api/admin/feedback/edit/${this.feedback.id}`, this.feedback, {
            headers: {
              Authorization: "Bearer " + token
            }
          })
          .then(response => {
            this.$emit("close-edit-dialog", true);
          })
          .catch(error => {
            this.activateSnackbar(true, "red", "something went wrong");
          });
      } else {
        this.activateSnackbar(true, "red", "please enter valid data");
      }
    },
    patientFilter(item, queryText, itemText) {
      const hasValue = val => (val != null ? val : "");
      const text = hasValue(item.name);
      const query = hasValue(queryText);
      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      );
    },
    doctorFilter(item, queryText, itemText) {
      const hasValue = val => (val != null ? val : "");
      const text = hasValue(item.name);
      const query = hasValue(queryText);
      return (
        text
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
      );
    },
    activateSnackbar(state, color, message) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = state;
    }
  }
};
</script>
<style>
.second_flex {
  margin-left: 20px;
}
.snackbar_style {
  top: 100px;
}
</style>