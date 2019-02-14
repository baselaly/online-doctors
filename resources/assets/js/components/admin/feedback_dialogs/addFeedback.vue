<template>
  <!--add dialog-->
      <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Feedback</span>
        </v-card-title>
        <v-card-text>
              <v-form v-model="formValid">
                <v-container>
                  <v-layout row wrap>
                  <v-text-field multi-line hint="enter your feedback" :rules="feedbackRules" v-model="newFeedback.feedback" label="Feedback"></v-text-field>
                <v-flex xs12>
                <v-autocomplete
                  :items="patients"
                  :filter="patientFilter"
                  v-model="newFeedback.patient_id"
                  item-text="name"
                  item-value="id"
                  label="Select patient"
                  :rules="requiredRules"
                ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                <v-autocomplete
                  :items="doctors"
                  :filter="doctorFilter"
                  v-model="newFeedback.doctor_id"
                  item-text="name"
                  item-value="id"
                  label="Select doctor"
                  :rules="requiredRules"
                ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                  <v-btn color="info" :disabled="!formValid" @click="addFeedback">Save</v-btn>
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
      newFeedback: {
        feedback: "",
        patient_id: "",
        doctor_id: ""
      },
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
      this.$emit("close-add-dialog", false);
      this.clearForm();
    },
    addFeedback() {
      if (this.formValid) {
        var token = localStorage.getItem("token");
        axios
          .post("/api/admin/feedback/add", this.newFeedback, {
            headers: {
              Authorization: "Bearer " + token
            }
          })
          .then(response => {
            this.clearForm();
            this.$emit("close-add-dialog", true);
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
    clearForm() {
      this.newFeedback.feedback = "";
      this.newFeedback.patient_id = "";
      this.newFeedback.doctor_id = "";
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
  top: 200px;
}
</style>