<template>
<v-container>
    <v-layout row wrap>
    <v-flex lg10 appointment-table>
  <v-card>
    <v-card-title>
      <v-chip color="white" large text-color="black">today Appointments</v-chip>
      <v-btn @click="show_add_dialog" fab dark color="indigo">
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="appointments"
      :search="search"
      dark
      hide-actions
      :loading="loading"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.appointment_date }}</td>
        <td class="text-xs-left">{{ props.item.appointment_time }}</td>
        <td class="text-xs-left">{{ props.item.doctor.name }}</td>
        <td class="text-xs-left">{{ props.item.patient.name }}</td>
        <td class="text-xs-left" v-if="props.item.status==0"><v-icon dark>schedule</v-icon></td>
        <td class="text-xs-left" v-if="props.item.status==1"><v-icon dark>done</v-icon></td>
        <td>
        <v-btn fab dark small color="success" @click="show_view_dialog(props.item.id)">
          <v-icon dark>visibility</v-icon>
        </v-btn>
        <v-btn fab dark small color="cyan" @click="show_edit_dialog(props.item.id)">
          <v-icon dark>edit</v-icon>
        </v-btn>
        <v-btn fab dark small color="red" @click="show_delete_dialog(props.item.id)">
          <v-icon dark>delete</v-icon>
        </v-btn>
        </td>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
  <div xs8 class="text-xs-center" v-if="pagination">
    <v-pagination color="indigo" @input="appointmentsPagination" :length="pagination_length" v-model="page"></v-pagination>
  </div>
  </v-flex>
  <view-appointment :dialog="view_dialog" :appointment="viewAppointment" :loading="viewAppointment_loading" @close-view-dialog="close_view_dialog"></view-appointment>
  <delete-appointment :dialog="delete_dialog" :appointmentId="deleted_appointment_id" @failed-delete-appointment="showFailedDeleteAppointment" @close-delete-dialog="close_delete_dialog"></delete-appointment>
  <add-appointment :today="today" :dialog="add_dialog" :doctors="doctors" :patients="patients" @close-add-dialog="close_add_dialog"></add-appointment>
  <edit-appointment 
  :unavailableDates="unavailableDates" 
  :unavailableHours="unavailableHours" 
  @change-Unavailable-Hours="changeUnavailableHours"
  @change-Unavailable-Dates="changeUnavailableDates" 
  :today="today" :dialog="edit_dialog" 
  :loading="editAppointment_loading" 
  :appointment="viewAppointment" 
  :doctors="doctors" 
  :patients="patients" 
  @close-edit-dialog="close_edit_dialog">
  </edit-appointment>
    </v-layout>
      <v-snackbar right bottom v-model="snackbar" :color="snackbarColor">
        {{snackbarMessage}}
      </v-snackbar>
</v-container>

</template>

<script>
import viewAppointment from "./appointment_dialogs/viewAppointment";
import deleteAppointment from "./appointment_dialogs/deleteAppointment";
import addAppointment from "./appointment_dialogs/addAppointment";
import editAppointment from "./appointment_dialogs/editAppointment";

export default {
  components: {
    viewAppointment,
    deleteAppointment,
    addAppointment,
    editAppointment
  },
  data() {
    return {
      pagination: false,
      page: 1,
      pagination_length: 0,
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "",
      //appointments table
      appointments: [],
      roles: [],
      categories: [],
      search: "",
      headers: [
        { text: "date", value: "appointment_date" },
        {
          text: "time",
          value: "appointment_hour" + ":" + "appointment_minute"
        },
        { text: "doctor", value: "doctor.name" },
        { text: "patient", value: "patient.name" },
        { text: "status", value: "status" },
        { text: "actions", value: "" }
      ],
      loading: true,
      defaultAppointment: {
        appointment_date: null,
        appointment_time: null,
        patient_id: "",
        doctor_id: ""
      },
      doctors: [],
      patients: [],
      // add appointment
      add_dialog: false,
      today: "",
      //view appointment
      view_dialog: false,
      viewAppointment: {
        appointment_date: null,
        appointment_time: null,
        patient_id: "",
        doctor_id: "",
        status: ""
      },
      viewAppointment_loading: true,
      //delete appointment
      delete_dialog: false,
      deleted_appointment_id: "",
      //edit appointment
      edit_dialog: false,
      unavailableDates: [],
      unavailableHours: [],
      editAppointment_loading: true
    };
  },
  created() {
    this.getTodayAppointments();
    this.getUsers();
    this.getToday();
  },
  methods: {
    getToday() {
      var date = new Date();
      var day = date.getDate();
      var day = day + 1;
      var month = date.getMonth();
      var month = month + 1;
      if (month < 10) {
        var month = "0" + month;
      }
      var year = date.getFullYear();
      this.today = year + "-" + month + "-" + day;
    },
    getTodayAppointments() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/appointment/today", {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          var response = response.data.appointments;
          this.appointments = response.data;
          if (response.last_page > 1) {
            this.page = response.current_page;
            this.pagination = true;
            this.pagination_length = response.last_page;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    appointmentsPagination() {
      this.loading = true;
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/appointment/today?page=${this.page}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          var response = response.data.appointments;
          this.appointments = response.data;
          if (response.last_page > 1) {
            this.page = response.current_page;
            this.pagination = true;
            this.pagination_length = response.last_page;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    getUsers() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/users/Doctors_patients", {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.doctors = response.data.doctors;
          this.patients = response.data.patients;
        })
        .catch(error => {
          console.log(error);
        });
    },
    activateSnackbar(state, color, message) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = state;
    },
    //add dialog
    show_add_dialog() {
      this.add_dialog = true;
    },
    close_add_dialog(state) {
      if (state == false) {
        this.add_dialog = false;
      } else if (state == true) {
        this.add_dialog = false;
        this.activateSnackbar(
          true,
          "green darken-2",
          "appointment added successfuly"
        );
        this.getTodayAppointments();
      }
    },
    //view dialog
    show_view_dialog(appointment_id) {
      this.view_dialog = true;
      setTimeout(() => {
        this.viewAppointment_loading = false;
      }, 1000);
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/appointment/getById/${appointment_id}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.viewAppointment = response.data.appointment;
          this.viewAppointment.doctor["image"] = `/uploads/${
            response.data.appointment.doctor.image
          }`;
          this.viewAppointment.patient["image"] = `/uploads/${
            response.data.appointment.patient.image
          }`;
        })
        .catch(error => {
          console.log(error);
        });
    },
    close_view_dialog() {
      this.view_dialog = false;
      setTimeout(() => {
        this.viewAppointment_loading = true;
        this.viewAppointment = this.defaultAppointment;
      }, 500);
    },
    show_delete_dialog(id) {
      this.deleted_appointment_id = id;
      this.delete_dialog = true;
    },
    close_delete_dialog(state) {
      if (state == false) {
        this.delete_dialog = false;
      } else if (state == true) {
        this.delete_dialog = false;
        this.activateSnackbar(
          true,
          "green darken-2",
          "appointment deleted successfuly"
        );
        this.getTodayAppointments();
      }
    },
    showFailedDeleteAppointment() {
      this.activateSnackbar(true, "red", "something went wrong");
    },
    show_edit_dialog(appointment_id) {
      this.edit_dialog = true;
      setTimeout(() => {
        this.editAppointment_loading = false;
      }, 1000);
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/appointment/getById/${appointment_id}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.viewAppointment = response.data.appointment;
          this.getAvailableHours(this.viewAppointment);
          this.getAvailableDates(this.viewAppointment);
        })
        .catch(error => {
          this.activateSnackbar(true, "red", "something went wrong");
        });
    },
    close_edit_dialog(state) {
      if (state == true) {
        this.edit_dialog = false;
        this.activateSnackbar(
          true,
          "green darken-2",
          "appointment edited successfuly"
        );
        this.getTodayAppointments();
        setTimeout(() => {
          this.editAppointment_loading = true;
          this.unavailableHours = [];
        }, 500);
      } else {
        this.edit_dialog = false;
        setTimeout(() => {
          this.editAppointment_loading = true;
          this.unavailableHours = [];
        }, 500);
      }
    },
    getAvailableHour(appointment) {
      setTimeout(() => {
        var date = appointment.appointment_date;
        var doctor_id = appointment.doctor_id;
        if (date && doctor_id) {
          var data = {
            doctor_id: doctor_id,
            date: date
          };
          var token = localStorage.getItem("token");
          axios
            .post(`/api/admin/appointment/check/${appointment.id}`, data, {
              headers: {
                Authorization: "Bearer " + token
              }
            })
            .then(response => {
              this.unavailableHours = response.data.unavailable_hours;
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    getAvailableDates(appointment) {
      setTimeout(() => {
        var doctor_id = appointment.doctor_id;
        if (doctor_id) {
          var data = {
            doctor_id: doctor_id
          };
          var token = localStorage.getItem("token");
          axios
            .post(`/api/admin/appointment/checkDate/${appointment.id}`, data, {
              headers: {
                Authorization: "Bearer " + token
              }
            })
            .then(response => {
              this.unavailableDates = response.data.unavailable_dates;
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    changeUnavailableHours(hours) {
      this.unavailableHours = hours;
    },
    changeUnavailableDates(dates) {
      this.unavailableDates = dates;
    }
  }
};
</script>

<style>
</style>