<template>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card mx-auto v-if="loading" style="padding:50px; text-align:center;">
            <v-progress-circular indeterminate :size="70" :width="7" color="amber" style="left: 45%; top: 40%;"></v-progress-circular>
        </v-card>
        <v-card tile v-if="!loading">
            <v-card-text>
            <v-toolbar color="indigo darken-1">
                <v-btn icon dark @click="closeDialog">
                <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>edit Appointment</v-toolbar-title>
                <v-spacer></v-spacer>
                    <v-btn round color="pink accent-3" dark @click="editAppointment" :disabled="!formValid">save</v-btn>            
            </v-toolbar>
                <v-form v-model="formValid">
                <v-container>
                  <v-layout row wrap>
                <v-flex xs12>
                <v-autocomplete
                  :items="patients"
                  :filter="patientFilter"
                  v-model="appointment.patient_id"
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
                  v-model="appointment.doctor_id"
                  item-text="name"
                  item-value="id"
                  label="Select doctor"
                  :rules="requiredRules"
                  @change="checkData"
                ></v-autocomplete>
                </v-flex>
                <v-flex xs12>
                <v-switch label="Done" color="indigo" v-model="appointment.status"></v-switch>
                </v-flex>
                <v-flex xs12 lg5>
                    <v-date-picker color="indigo darken-1" :allowed-dates="allowedDates" @change="getAvailableHour" :min="today" v-model="appointment.appointment_date"></v-date-picker>
                </v-flex>
                <v-flex xs12 lg5>
                    <v-time-picker color="indigo darken-1" :allowed-minutes="allowedMinutes" :allowed-hours="allowedHours" v-model="appointment.appointment_time" format="24hr" min="12:00" max="23:00"></v-time-picker>                
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
    appointment: {
      required: true,
      type: Object
    },
    loading: {
      required: true,
      type: Boolean,
      default: true
    },
    today: {
      required: true,
      type: String
    },
    unavailableHours: {
      required: true,
      type: Array
    },
    unavailableDates: {
      required: true,
      type: Array
    }
  },
  created() {},
  methods: {
    getAvailableHour() {
      setTimeout(() => {
        this.appointment.appointment_time = null;
        var date = this.appointment.appointment_date;
        var doctor_id = this.appointment.doctor_id;
        if (date && doctor_id) {
          var data = {
            doctor_id: doctor_id,
            date: date
          };
          var token = localStorage.getItem("token");
          axios
            .post(
              `/api/admin/appointment/checkHour/${this.appointment.id}`,
              data,
              {
                headers: {
                  Authorization: "Bearer " + token
                }
              }
            )
            .then(response => {
              var unavailableHours = response.data.unavailable_hours;
              this.$emit("change-Unavailable-Hours", unavailableHours);
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    getAvailableDates() {
      setTimeout(() => {
        this.appointment.appointment_time = null;
        this.appointment.appointment_date = null;
        var doctor_id = this.appointment.doctor_id;
        if (doctor_id) {
          var data = {
            doctor_id: doctor_id
          };
          var token = localStorage.getItem("token");
          axios
            .post(
              `/api/admin/appointment/checkDate/${this.appointment.id}`,
              data,
              {
                headers: {
                  Authorization: "Bearer " + token
                }
              }
            )
            .then(response => {
              var unavailableDates = response.data.unavailable_dates;
              this.$emit("change-Unavailable-Dates", unavailableDates);
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    checkData() {
      this.getAvailableDates();
      this.getAvailableHour();
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
    closeDialog() {
      this.$emit("close-edit-dialog", false);
      this.clearForm();
    },
    editAppointment() {
      if (this.formValid) {
        if (
          this.appointment.appointment_date != null &&
          this.appointment.appointment_time != null
        ) {
          var token = localStorage.getItem("token");
          axios
            .post(
              `/api/admin/appointment/edit/${this.appointment.id}`,
              this.appointment,
              {
                headers: {
                  Authorization: "Bearer " + token
                }
              }
            )
            .then(response => {
              this.$emit("close-edit-dialog", true);
              this.clearForm();
            })
            .catch(error => {
              if (error.message == "Request failed with status code 403") {
                this.activateSnackbar(
                  true,
                  "red",
                  "please choose another time in the hour"
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
      this.appointment.appointment_date = null;
      this.appointment.patient_id = "";
      this.appointment.doctor_id = "";
      this.appointment.appointment_time = null;
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