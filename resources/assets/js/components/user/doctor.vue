<template>
  <v-flex>
    <v-layout fill-height px-5 py-5 text-xs-center v-if="doctor_loading && !no_doctor">
      <v-flex xs12>
        <v-progress-circular indeterminate :size="80" :width="7" color="blue darken-1"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout fill-height px-5 py-5 text-xs-center v-if="no_doctor">
      <v-flex xs12 text-xs-center py-5>
        <div class="display-2">
          <v-icon right size="50" color="black">sentiment_very_dissatisfied</v-icon>Content Not Found
        </div>
      </v-flex>
    </v-layout>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap v-if="!doctor_loading && !no_doctor" my-5>
        <v-flex xs12 lg5 mx-4>
          <v-card color="white" class="doctor-card black--text">
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <v-flex xs12 lg4 py-1>
                  <v-img :src="doctor.image" height="125px" contain></v-img>
                </v-flex>
                <v-flex xs12 lg8 text-xs-left>
                  <v-card-title primary-title>
                    <div>
                      <div class="headline text-xs-center text-truncate">Doctor {{doctor.name}}</div>
                      <v-card-actions class="text-xs-center">
                        <div class="text-xs-center">
                          <v-rating
                            v-model="doctor.rate"
                            readonly
                            background-color="yellow darken-2"
                            color="yellow darken-2"
                            medium
                            half-increments
                          ></v-rating>
                        </div>
                      </v-card-actions>
                      <div class="body-2 py-1 text-truncate">specialized in
                        <router-link
                          class="specialist-link"
                          :to="{ name: 'specialist', params: {id: doctor.category.id } }"
                        >{{doctor.category.name}}</router-link>
                      </div>
                      <div class="caption py-1 text-truncate">Fees : {{doctor.fees}} EGP</div>
                      <div
                        class="caption py-1 text-truncate"
                      >{{doctor.appointments_count}} Appointment(s)</div>
                      <div class="caption py-1 text-truncate">Waiting time : 30 Minutes</div>
                      <div class="caption py-1 text-truncate">16676 - Cost of regular call</div>
                    </div>
                  </v-card-title>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex xs12 lg6 ma-3>
          <v-card color="white" class="text-xs-center booking-card black--text">
            <v-layout>
              <v-flex xs12 class="booking-header py-1">
                <div class="subheading">Booking information</div>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 class="py-2">
                <div class="subheading d-inline-block" style="color:black!important;">Examination</div>
                <v-icon size="30">keyboard_arrow_down</v-icon>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout>
              <v-flex xs6 class="py-1">
                <v-icon size="35" color="blue darken-2">money</v-icon>
                <div
                  class="subheading text-truncate"
                  style="color:black!important;"
                >Fees : {{doctor.fees}} EGP</div>
              </v-flex>
              <v-flex xs6 class="py-1">
                <v-icon size="35" color="blue darken-2">schedule</v-icon>
                <div
                  class="subheading text-truncate"
                  style="color:black!important;"
                >Waiting Time 30 minutes</div>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 class="py-5">
                <div xs12 text-xs-center py-5 v-if="booking_progress">
                  <v-progress-circular indeterminate :size="20" :width="5" color="blue darken-1"></v-progress-circular>
                </div>
                <div
                  v-if="enable_booking && !booking_progress"
                >book now to recieve the address and the phone number
                  <v-spacer></v-spacer>
                  <router-link to="#">
                    <v-btn
                      @click="openDateDialog"
                      large
                      color="light-blue"
                      class="white--text"
                    >BOOK NOW</v-btn>
                  </router-link>
                </div>
                <div
                  class="no_booking"
                  xs12
                  text-xs-center
                  py-5
                  v-if="!enable_booking && !booking_progress"
                >
                  <v-icon size="20" color="white">error_outline</v-icon>you have a not finished appointment with this doctor
                </div>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-snackbar bottom left v-model="snackbar" :color="snackbarColor">{{snackbarMessage}}</v-snackbar>
      </v-layout>
    </v-container>
    <v-layout
      v-if="!doctor_loading && !no_doctor && !no_feedbacks"
      fill-height
      px-2
      py-2
      text-xs-center
    >
      <v-flex xs12 text-xs-left>
        <v-card color="white" class="booking-card black--text">
          <v-layout>
            <v-flex xs12 class="booking-header py-2 text-xs-center">
              <div class="subheading d-inline-block">Patient's Review</div>
              <v-icon size="30" color="white">star_half</v-icon>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 v-if="feedback_loading" text-xs-center py-5>
              <v-progress-circular indeterminate :size="50" :width="7" color="blue darken-1"></v-progress-circular>
            </v-flex>
            <v-flex v-if="!feedback_loading" xs12 class="px-3">
              <v-flex
                xs12
                class="feedback-card px-3 py-3 my-4"
                v-for="(feedback,i) in feedbacks"
                :key="i"
              >
                <v-flex xs12 lg3>
                  <v-avatar class="mr-2" size="70">
                    <img :src="feedback.patient.image">
                  </v-avatar>
                </v-flex>
                <v-flex xs12 lg11 class="title text_break" py-2 offset-lg1>" {{feedback.feedback}} "</v-flex>
                <v-flex xs12 lg9 class="py-3">{{feedback.time}}</v-flex>
              </v-flex>
              <div xs8 class="text-xs-center py-3" v-if="pagination">
                <v-pagination
                  color="blue darken-1"
                  @input="feedbackPagination"
                  :length="pagination_length"
                  v-model="page"
                ></v-pagination>
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <date-dialog
      :unavailableDates="unavailableDates"
      :today="today"
      :dialog="date_dialog"
      @get-date="get_chosen_date"
      @close-date-dialog="close_date_dialog"
    ></date-dialog>
    <time-dialog
      :unavailableHours="unavailableHours"
      :dialog="time_dialog"
      @get-time="get_chosen_time"
      @close-time-dialog="close_time_dialog"
    ></time-dialog>
  </v-flex>
</template>

<script>
import dateDialog from "./booking_dialogs/dateDialog";
import timeDialog from "./booking_dialogs/timeDialog";

export default {
  components: {
    dateDialog,
    timeDialog
  },
  data() {
    return {
      doctor_loading: true,
      no_feedbacks: false,
      feedback_loading: false,
      pagination: false,
      page: 1,
      pagination_length: 0,
      no_doctor: false,
      doctor_id: null,
      doctor: "",
      unavailableDates: [],
      today: "",
      feedbacks: [],
      date_dialog: false,
      appointment_date: null,
      unavailableHours: [],
      time_dialog: false,
      appointment_time: null,
      snackbar: false,
      snackbarColor: "",
      snackbarMessage: "",
      enable_booking: false,
      booking_progress: true
    };
  },
  created() {
    this.getDoctor();
    this.getBookingStatus();
    this.getToday();
    this.getAvailableDates();
  },
  methods: {
    getDoctor() {
      var token = localStorage.getItem("token");
      this.doctor_id = this.$route.params.id;
      axios
        .get(`/api/user/getDoctor/${this.doctor_id}`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          this.doctor = response.data.doctor;
          this.handlePagination(this.doctor.feedbacks);
          this.feedbacks = this.doctor.feedbacks.data;
          this.no_doctor = false;
          this.doctor_loading = false;
          this.feedbacks.length == 0
            ? (this.no_feedbacks = true)
            : (this.no_feedbacks = false);
        })
        .catch(error => {
          this.doctor_loading = false;
          this.no_doctor = true;
        });
    },
    getToday() {
      var date = new Date();
      var day = date.getDate();
      var day = day + 1;
      var month = date.getMonth();
      var month = month + 1;
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      var year = date.getFullYear();
      this.today = year + "-" + month + "-" + day;
    },
    feedbackPagination() {
      this.feedback_loading = true;
      var token = localStorage.getItem("token");
      this.doctor_id = this.$route.params.id;
      axios
        .get(`/api/user/getDoctor/${this.doctor_id}?page=${this.page}`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          this.doctor = response.data.doctor;
          this.handlePagination(this.doctor.feedbacks);
          this.feedbacks = this.doctor.feedbacks.data;
          this.no_doctor = false;
          this.doctor_loading = false;
          this.feedbacks.length == 0
            ? (this.no_feedbacks = true)
            : (this.no_feedbacks = false);
          this.feedback_loading = false;
        })
        .catch(error => {
          this.doctor_loading = false;
          this.no_doctor = true;
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
    getAvailableDates() {
      var doctor_id = this.doctor_id;
      if (doctor_id) {
        var data = {
          doctor_id: doctor_id
        };
        var token = localStorage.getItem("token");
        axios
          .post(`/api/user/appointment/checkDate`, data, {
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
    },
    openDateDialog() {
      this.date_dialog = true;
    },
    close_date_dialog() {
      this.date_dialog = false;
    },
    get_chosen_date(date) {
      this.appointment_date = date;
      if (this.appointment_date && this.doctor_id) {
        var data = {
          doctor_id: this.doctor_id,
          date: this.appointment_date
        };
        var token = localStorage.getItem("token");
        axios
          .post(`/api/user/appointment/checkHour`, data, {
            headers: {
              Authorization: "Bearer " + token
            }
          })
          .then(response => {
            this.unavailableHours = response.data.unavailable_hours;
            this.date_dialog = false;
            this.time_dialog = true;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    close_time_dialog() {
      this.time_dialog = false;
      this.appointment_date = null;
      this.appointment_time = null;
    },
    get_chosen_time(time) {
      this.appointment_time = time;
      if (this.appointment_date && this.appointment_time) {
        var data = {
          doctor_id: this.doctor_id,
          appointment_date: this.appointment_date,
          appointment_time: this.appointment_time
        };
        var token = localStorage.getItem("token");
        axios
          .post(`/api/user/appointment/book`, data, {
            headers: {
              Authorization: "Bearer " + token
            }
          })
          .then(response => {
            this.activateSnackbar(
              true,
              "blue lighten-1",
              "you have booked successfully"
            );
            this.enable_booking = false;
          })
          .catch(error => {
            if (error.message == "Request failed with status code 401") {
              this.activateSnackbar(
                true,
                "red",
                "you already have booked appointment with this doctor"
              );
            } else if (error.message == "Request failed with status code 403") {
              this.activateSnackbar(
                true,
                "red",
                "you could have booked another time in chosen hour"
              );
            } else {
              this.activateSnackbar(true, "red", "something went wrong");
            }
          });
        this.close_time_dialog();
      }
    },
    getBookingStatus() {
      var token = localStorage.getItem("token");
      this.doctor_id = this.$route.params.id;
      axios
        .get(`/api/user/getBookingStatus/${this.doctor_id}`, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          var status = response.data.status;
          if (status == true) {
            this.booking_progress = false;
            this.enable_booking = true;
          } else if (status == false) {
            this.booking_progress = false;
            this.enable_booking = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
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
  background: #d3cce3; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #e9e4f0,
    #d3cce3
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #e9e4f0,
    #d3cce3
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border-radius: 10px;
  box-shadow: 0px 0px 5px 0px #929292;
}
.v-icon {
  vertical-align: top;
}
.avatar {
  box-shadow: 1px 1px 14px 0px #7b7b7b;
}
.container.grid-list-md .layout:not(:only-child) {
  margin: auto 0px !important;
}
.text_break {
  word-break: break-word;
}
.no_booking {
  background: #d31027; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #ea384d, #d31027);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #ea384d,
    #d31027
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: white;
  padding: 5px;
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