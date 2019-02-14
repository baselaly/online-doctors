<template>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
            <v-card-text>
            <v-toolbar color="indigo darken-1">
                <v-btn icon dark @click="closeDialog">
                <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Add Appointment</v-toolbar-title>
                <v-spacer></v-spacer>
                    <v-toolbar-title>Duration : 30 mins</v-toolbar-title>
                    <v-btn round color="pink accent-3" dark @click="addAppointment" :disabled="!formValid">save</v-btn>            
            </v-toolbar>
                <v-form v-model="formValid">
                <v-container>
                  <v-layout row wrap>
                <v-flex xs12>
                <v-autocomplete
                  :items="patients"
                  :filter="patientFilter"
                  v-model="newAppointment.patient_id"
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
                  v-model="newAppointment.doctor_id"
                  item-text="name"
                  item-value="id"
                  label="Select doctor"
                  :rules="requiredRules"
                  @change="checkData"
                ></v-autocomplete>
                </v-flex>
                <v-flex xs12 lg5>
                    <v-date-picker color="indigo darken-1" :allowed-dates="allowedDates" @change="getAvailableHour" :min="today" v-model="newAppointment.appointment_date"></v-date-picker>
                </v-flex>
                <v-flex xs12 lg5 v-if="timePicker">
                    <v-time-picker color="indigo darken-1" :allowed-minutes="allowedMinutes" :allowed-hours="allowedHours" min="12:00" max="23:00" format="24hr" v-model="newAppointment.appointment_time"></v-time-picker>                
                </v-flex>
                </v-layout>
                </v-container>
              </v-form>
            </v-card-text>
        <v-snackbar top v-model="snackbar" :color="snackbarColor">
            {{snackbarMessage}}
        </v-snackbar>
          <div style="flex: 1 1 auto;"></div>
        </v-card>
      </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "",
      formValid: true,
      timePicker: false,
      unavailableHours: [],
      unavailableDates: [],
      newAppointment: {
        patient_id: "",
        doctor_id: "",
        appointment_date: null,
        appointment_time: null
      },
      requiredRules: [v => !!v || "this field is required"]
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    doctors: {
      required: true,
      type: Array
    },
    patients: {
      required: true,
      type: Array
    },
    today: {
      required: true,
      type: String
    }
  },
  created() {},
  methods: {
    getAvailableHour() {
      setTimeout(() => {
        this.newAppointment.appointment_time = null;
        var date = this.newAppointment.appointment_date;
        var doctor_id = this.newAppointment.doctor_id;
        if (date && doctor_id) {
          var data = {
            doctor_id: doctor_id,
            date: date
          };
          var token = localStorage.getItem("token");
          axios
            .post("/api/admin/appointment/checkHour", data, {
              headers: {
                Authorization: "Bearer " + token
              }
            })
            .then(response => {
              this.unavailableHours = response.data.unavailable_hours;
              this.timePicker = true;
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    getAvailableDate() {
      setTimeout(() => {
        this.newAppointment.appointment_time = null;
        this.newAppointment.appointment_date = null;
        var doctor_id = this.newAppointment.doctor_id;
        if (doctor_id) {
          var data = {
            doctor_id: doctor_id
          };
          var token = localStorage.getItem("token");
          axios
            .post("/api/admin/appointment/checkDate", data, {
              headers: {
                Authorization: "Bearer " + token
              }
            })
            .then(response => {
              this.unavailableDates = response.data.unavailable_dates;
              console.log(this.unavailableDates);
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    checkData() {
      this.getAvailableDate();
      this.getAvailableHour();
    },
    closeDialog() {
      this.$emit("close-add-dialog", false);
      this.clearForm();
    },
    allowedMinutes(v) {
      if (v == 0 || v == 30) {
        return true;
      } else {
        return false;
      }
    },
    allowedHours(v) {
      if (this.unavailableHours.length != 0) {
        return !this.unavailableHours.includes(v);
      } else {
        return true;
      }
    },
    allowedDates(v) {
      if (this.unavailableDates.length != 0) {
        return !this.unavailableDates.includes(v);
      } else {
        return true;
      }
    },
    addAppointment() {
      if (this.formValid) {
        if (
          this.newAppointment.appointment_date != null &&
          this.newAppointment.appointment_time != null
        ) {
          var token = localStorage.getItem("token");
          axios
            .post("/api/admin/appointment/add", this.newAppointment, {
              headers: {
                Authorization: "Bearer " + token
              }
            })
            .then(response => {
              this.$emit("close-add-dialog", true);
              this.clearForm();
            })
            .catch(error => {
              console.log(error.message);
              if (error.message == "Request failed with status code 403") {
                this.activateSnackbar(
                  true,
                  "red",
                  "please choose another time in the hour"
                );
              } else if (
                error.message == "Request failed with status code 401"
              ) {
                this.activateSnackbar(
                  true,
                  "red",
                  "this patient has live appointment with this doctor"
                );
              } else {
                this.activateSnackbar(true, "red", "something went wrong");
              }
            });
        } else {
          this.activateSnackbar(
            true,
            "red",
            "enter valid appointment date and time"
          );
        }
      } else {
        this.activateSnackbar(true, "red", "enter valid appointment data");
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
      this.newAppointment.appointment_date = null;
      this.newAppointment.patient_id = "";
      this.newAppointment.doctor_id = "";
      this.newAppointment.appointment_time = null;
      this.unavailableHours = [];
      this.timePicker = false;
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
</style>