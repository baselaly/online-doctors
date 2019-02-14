<template>
  <v-flex>
    <v-layout fill-height px-5 py-5 text-xs-center v-if="appointments_loading">
      <v-flex xs12>
        <v-progress-circular indeterminate :size="80" :width="7" color="blue darken-1"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout fill-height px-5 py-5 text-xs-center v-if="no_appointments">
      <v-flex xs12>
        <span class="headline">No Finished Appointments</span>
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
            <v-toolbar color="blue darken-1" dark>
              <v-toolbar-title>
                <div class="body-2 py-1 text-truncate">
                  <div style="display:inline-flex" v-if="appointment.rate!=null" class="px-3">
                    <v-rating
                      v-model="appointment.rate"
                      color="yellow accent-4"
                      dense
                      readonly
                      half-increments
                      hover
                      size="20"
                      background-color="grey darken-1"
                      empty-icon="$vuetify.icons.ratingFull"
                    ></v-rating>
                    {{appointment.rate==null?'': '('+appointment.rate+')'}}
                  </div>
                </div>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <div v-if="appointment.status==0" class="px-3">
                <div>
                  <v-btn @click="finishAppointment(appointment.id)" color="white" fab small dark>
                    <v-icon color="black">check</v-icon>
                  </v-btn>
                </div>
              </div>
              <div v-if="appointment.has_feedback" class="px-3">
                <div>
                  <v-btn @click="showFeedback(appointment.id)" color="white" fab small dark>
                    <v-icon color="black">feedback</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-toolbar>
            <v-layout>
              <v-flex xs4>
                <v-avatar size="100" class="grey lighten-4 ma-2">
                  <img :src="appointment.patient.image" alt="avatar">
                </v-avatar>
              </v-flex>
              <v-flex xs7>
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
            </v-layout>
            <v-divider dark></v-divider>
            <v-card-actions class="pa-3"></v-card-actions>
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
    <feedback-dialog
      :dialog="feedback_dialog"
      :loading="feedback_loading"
      :feedback="feedback"
      @close-feedback-dialog="closeFeedbackDialog"
    ></feedback-dialog>
  </v-flex>
</template>

<script>
import feedbackDialog from "./user_dialogs/feedback";

export default {
  components: {
    feedbackDialog
  },
  data() {
    return {
      appointments: [],
      appointments_loading: true,
      no_appointments: false,
      page: 1,
      pagination: false,
      pagination_length: 0,
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "light-blue",
      rate_dialog: false,
      appointment_id: null,
      If_pagination: false,
      feedback_dialog: false,
      feedback_loading: true,
      feedback: ""
    };
  },
  created() {
    this.getFinished();
  },
  methods: {
    getFinished() {
      var token = localStorage.getItem("token");
      axios
        .get(`/api/doctor/finished`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          var response = response.data.finished_appointments;
          this.appointments = response.data;
          console.log(this.appointments);
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
      this.appointments_loading = true;
      var token = localStorage.getItem("token");
      axios
        .get(`/api/doctor/finished?page=${this.page}`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          var response = response.data.finished_appointments;
          this.appointments = response.data;
          this.handlePagination(response);
          if (this.appointments.length == 0) {
            this.activateSnackbar(true, "red", "no appointments found");
            this.no_appointments = true;
          }
          this.appointments_loading = false;
          this.If_pagination = true;
        })
        .catch(error => {
          console.log(error);
        });
    },
    finishAppointment(id) {
      var token = localStorage.getItem("token");
      axios
        .get(`/api/doctor/finishAppointment/${id}`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          var message = response.data.message;
          this.activateSnackbar(
            true,
            "blue lighten-1",
            "appointment finished successfully"
          );
          this.If_pagination
            ? this.appointmentsPagination()
            : this.getFinished();
        })
        .catch(error => {
          this.activateSnackbar(true, "red", "something went wrong");
        });
    },
    showFeedback(id) {
      this.feedback_dialog = true;
      var token = localStorage.getItem("token");
      axios
        .get(`/api/doctor/getFeedback/${id}`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          this.feedback = response.data.feedback.feedback;
          setTimeout(() => {
            this.feedback_loading = false;
          }, 1000);
        })
        .catch(error => {
          console.log(error);
        });
    },
    closeFeedbackDialog() {
      this.feedback_dialog = false;
      setTimeout(() => {
        this.feedback_loading = true;
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
.doctor2-link {
  color: white;
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