<template>
  <v-flex>
    <v-layout fill-height px-5 py-5 text-xs-center v-if="appointments_loading">
      <v-flex xs12>
        <v-progress-circular indeterminate :size="80" :width="7" color="blue darken-1"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout fill-height px-5 py-5 text-xs-center v-if="no_appointments">
      <v-flex xs12>
        <span class="headline">No Upcoming Appointments</span>
      </v-flex>
    </v-layout>
    <v-layout fill-height px-2 py-5 text-xs-left v-if="!appointments_loading">
      <v-flex xs12>
        <v-flex
          class="mx-5 my-5 display_inline_div"
          v-for="(appointment, i) in appointments"
          :key="i"
          xs12
          lg4
        >
          <v-card xs12 class="black--text">
            <v-layout>
              <v-flex xs12 lg3>
                <v-avatar size="70" class="grey lighten-4 ma-2">
                  <img :src="appointment.patient.image" alt="avatar">
                </v-avatar>
              </v-flex>
              <v-flex xs6>
                <v-card-title primary-title>
                  <div>
                    <div class="body-2 py-1 text-truncate">{{appointment.time}}</div>
                    <div class="body-1 py-1 text-truncate">
                      <v-icon size="20" color="black">person</v-icon>
                      {{appointment.patient.name}}
                    </div>
                    <div class="body-1 py-1 text-truncate">
                      <v-icon size="20" color="black">phone</v-icon>
                      {{appointment.patient.phone}}
                    </div>
                  </div>
                </v-card-title>
              </v-flex>
              <v-flex xs3>
                <v-flex xs2>
                  <v-tooltip top v-if="appointment.can_cancelled">
                    <v-btn
                      slot="activator"
                      @click="openCancel(appointment.id)"
                      fab
                      dark
                      small
                      color="red"
                    >
                      <v-icon dark>clear</v-icon>
                    </v-btn>
                    <span>cancel</span>
                  </v-tooltip>
                  <v-tooltip v-else top>
                    <v-btn slot="activator" small disabled fab>
                      <v-icon dark>clear</v-icon>
                    </v-btn>
                    <span>you cant cancel today appointment!</span>
                  </v-tooltip>
                </v-flex>
                <v-tooltip top>
                  <v-btn
                    slot="activator"
                    @click="openUserView(appointment.patient.id)"
                    color="white"
                    fab
                    small
                    dark
                  >
                    <v-icon color="black">person</v-icon>
                  </v-btn>
                  <span>view patient</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <div xs8 class="text-xs-center" v-if="pagination">
          <v-pagination
            color="blue darken-1"
            @input="appointmentsPagination"
            :length="pagination_length"
            v-model="page"
          ></v-pagination>
        </div>
      </v-flex>
      <v-snackbar v-model="snackbar" bottom left :color="snackbarColor">
        {{snackbarMessage}}
        <v-btn color="white" flat @click="closeSnackBar">Close</v-btn>
      </v-snackbar>
    </v-layout>
    <userDialog
      :dialog="user_dialog"
      :loading="user_loading"
      :user="user"
      @close-user-dialog="closeUserDialog"
    ></userDialog>
    <cancel-dialog :dialog="cancel_dialog" :id="cancel_id" @close-cancel-dialog="closeCancelDialog"></cancel-dialog>
  </v-flex>
</template>

<script>
import userDialog from "./user_dialogs/viewUser";
import cancelDialog from "./user_dialogs/cancelDialog";

export default {
  components: {
    userDialog,
    cancelDialog
  },
  data() {
    return {
      appointments: [],
      appointments_loading: true,
      no_appointments: false,
      user_dialog: false,
      user_loading: true,
      user: {},
      page: 1,
      pagination: false,
      pagination_length: 0,
      cancel_dialog: false,
      cancel_id: 0,
      If_pagination: false,
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "light-blue"
    };
  },
  created() {
    this.getUpcoming();
  },
  methods: {
    getUpcoming() {
      var token = localStorage.getItem("token");
      axios
        .get(`/api/doctor/upcoming`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          var response = response.data.live_appointments;
          this.appointments = response.data;
          this.handlePagination(response);
          if (this.appointments.length == 0) {
            this.activateSnackbar(true, "red", "no appointments found");
            this.no_appointments = true;
          }
          this.appointments_loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handlePagination(response) {
      if (response.last_page > 1) {
        this.page = response.current_page;
        this.pagination = true;
        this.pagination_length = response.last_page;
      } else {
        this.page = response.current_page;
        this.pagination = false;
        this.pagination_length = response.last_page;
      }
    },
    appointmentsPagination() {
      this.If_pagination = true;
      this.appointments_loading = true;
      var token = localStorage.getItem("token");
      axios
        .get(`/api/doctor/upcoming?page=${this.page}`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          var response = response.data.live_appointments;
          this.appointments = response.data;
          this.handlePagination(response);
          if (this.appointments.length == 0) {
            this.activateSnackbar(true, "red", "no appointments found");
            this.no_appointments = true;
          }
          this.appointments_loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    openUserView(id) {
      this.user_dialog = true;
      var token = localStorage.getItem("token");
      axios
        .get(`/api/doctor/getPatient/${id}`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          this.user = response.data.patient;
          setTimeout(() => {
            this.user_loading = false;
          }, 1000);
        })
        .catch(error => {
          console.log(error);
        });
    },
    openCancel(id) {
      this.cancel_id = id;
      this.cancel_dialog = true;
    },
    closeCancelDialog(state) {
      this.cancel_id = 0;
      this.cancel_dialog = false;
      if (state == true) {
        this.activateSnackbar(
          true,
          "blue lighten-1",
          "appointment cancelled!,thank you for using online doctors"
        );
        this.If_pagination ? this.appointmentsPagination() : this.getUpcoming();
      }
    },
    closeUserDialog() {
      this.user_dialog = false;
      setTimeout(() => {
        this.user_loading = true;
      }, 500);
    },
    closeSnackBar() {
      this.snackbar = false;
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
.theme--light .card {
  background-color: rgba(255, 255, 255, 0.49);
}
.doctor-name-div {
  vertical-align: bottom;
}
.search-btn {
  vertical-align: sub;
}
.list__tile__content {
  color: black;
}
.badge {
  display: -webkit-box;
}
.title {
  font-weight: 100;
}
.feedback-span {
  font-size: 30px;
  color: white;
  font-weight: bold;
}
.specialist-link {
  color: #2e9bf3 !important;
}
.doctor-card {
  border-radius: 10px;
}
.booking-header {
  background-color: #0277bd;
  color: white !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.booking-card {
  border-radius: 10px;
}
.feedback-card {
  background-color: #c1c1c140;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 0px #929292;
}
.v-icon {
  vertical-align: top;
}
.avatar {
  box-shadow: 1px 1px 14px 0px #7b7b7b;
}
@media (min-width: 1264px) {
  .display_inline_div {
    -ms-flex-preferred-size: 33.33333333333333%;
    flex-basis: 33.33333333333333%;
    -webkit-box-flex: 0;
    -ms-flex-positive: 0;
    display: inline-block;
    width: 25%;
    flex-grow: 0;
    max-width: 33.33333333333333%;
  }
}
</style>