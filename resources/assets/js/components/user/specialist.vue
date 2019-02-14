<template>
<v-flex>
    <v-card>
        <v-parallax
        class="white--text py-4"
        :src="header"
        height="250"
        >
        <v-container fill-height fluid>
            <v-layout fill-height>
            <v-flex xs12>
                <v-card elevation-10 class="search_form">
                    <v-form class="px-4 py-1">
                        <v-flex xs12>
                            <v-flex xs12 lg4 mx-4 class="display_inline_div">
                                <v-autocomplete
                                prepend-icon="business_center"
                                :items="categories"
                                :filter="categoryFilter"
                                v-model="search.category_id"
                                item-text="name"
                                item-value="id"
                                label="Select doctor specialist"
                                ></v-autocomplete>
                            </v-flex>
                            <v-flex mx-4 xs12 lg4 class="doctor-name-div display_inline_div">
                                <v-text-field
                                v-model="search.name"
                                label="search by Doctor name"
                                ></v-text-field>
                            </v-flex>
                            <v-flex mx-4 xs12 lg3 d-inline-block class="search-btn">
                                <v-btn @click="searchDoctors" color="light-blue" class="white--text">
                                    <v-icon>search</v-icon> 
                                    Search
                                </v-btn>
                                <v-btn fab small @click="clearSearch" color="error" class="white--text">
                                    <v-icon>refresh</v-icon> 
                                </v-btn>
                            </v-flex>
                        </v-flex>
                    </v-form>
                </v-card>
            </v-flex>
            </v-layout>
        </v-container>
        </v-parallax>
    <v-layout fill-height px-5 py-5 text-xs-center v-if="doctors_loading">
        <v-flex xs12>
            <v-progress-circular indeterminate :size="80" :width="7" color="blue darken-1"></v-progress-circular>
        </v-flex>
    </v-layout>
    <v-layout fill-height px-5 py-5 text-xs-center v-if="no_doctors">
        <v-flex xs12>
            <span class="headline">No Doctors Found</span>
        </v-flex>
    </v-layout>
    <v-layout fill-height py-5 px-4 text-xs-left v-if="!doctors_loading">
        <v-flex xs12>
        <v-flex xs12 text-xs-center v-if="!no_doctors">
            <span class="headline">Our Doctors</span>
        </v-flex>
          <v-flex class="mx-1 my-5" v-for="(doctor, i) in doctors" :key="i" xs12>
            <v-card color="white" class="black--text py-3">
              <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <v-flex xs12 lg2>
                  <router-link :to="{ name: 'doctor', params: {id: doctor.id, name: doctor.name } }">
                      <v-avatar
                      size="100"
                      class="grey lighten-4 ma-2"
                      >
                        <img :src="doctor.image" alt="avatar">
                      </v-avatar>
                  </router-link>
                </v-flex>
                <v-flex lg7 xs12 text-xs-left>
                  <v-card-title primary-title>
                    <div>
                  <router-link class="doctor-link" :to="{ name: 'doctor', params: {id: doctor.id, name: doctor.name } }">
                      <div class="title">Dr. {{doctor.name}}</div>
                  </router-link>
                      <div class="body-2 py-1">Specialist : {{doctor.category.name}}</div>
                      <div class="caption py-1">Fees : {{doctor.fees}} EGP</div>
                      <div class="caption py-1">Waiting time : 30 Minutes</div>
                      <div class="caption py-1">16676 - Cost of regular call</div>
                    </div>
                    <v-spacer></v-spacer>
                  </v-card-title>
                </v-flex>
                <v-flex xs12 lg2>
                <div>
                  <router-link :to="{ name: 'doctor', params: {id: doctor.id, name: doctor.name } }">
                    <v-btn large color="light-blue darken-3" class="white--text">BOOK NOW</v-btn>
                  </router-link>
                </div>
                </v-flex>
              </v-layout>
              </v-container>
              <v-layout>
                <v-flex xs12>
                  <v-card color="grey lighten-2" class="black--text" flat>
                    <div v-if="doctor.feedback">
                      <v-card-text>
                        <div class="title">
                          <span class="feedback-span" style="color:black!important;">" </span>{{doctor.feedback.feedback}}<span class="feedback-span"> "</span>
                        </div>
                      </v-card-text>
                      <v-card-title>
                        <div class="caption">{{doctor.feedback.time}}</div>                    
                      </v-card-title>
                    </div>
                    <div v-else>
                      <v-card-title>
                        <div class="headline">No feedback for this doctor</div>                    
                      </v-card-title>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-divider light></v-divider>
              <v-card-actions class="pa-3">
                <v-spacer></v-spacer>
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
                 from {{doctor.appointments_count}} Appointment(s)
              </v-card-actions>
            </v-card>
            </v-flex>
            <div xs8 class="text-xs-center" v-if="pagination">
                <v-pagination color="blue darken-1" @input="doctorsPagination" :length="pagination_length" v-model="page"></v-pagination>
            </div>
        </v-flex>
            <v-snackbar v-model="snackbar" bottom left color="light-blue">
                {{snackbarMessage}}
        <v-btn color="white" flat @click="closeSnackBar">Close</v-btn>
    </v-snackbar>
    </v-layout>
    </v-card>
</v-flex>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      pagination: false,
      page: 1,
      pagination_length: 0,
      snackbarMessage: "",
      doctors: [],
      no_doctors: false,
      doctors_loading: true,
      categories: [],
      snackbar: false,
      searchDone: false,
      category: "",
      search: {
        category_id: null,
        name: null
      },
      searchDone: false,
      header:
        "https://cdn.vezeeta.com/vezeeta-live-9-0-9-17/Assets/Img/search-header-background-en.jpg"
    };
  },
  created() {
    this.getDoctors();
    this.getCategories();
  },
  methods: {
    getDoctors() {
      this.doctors_loading = true;
      this.category = this.$route.params.id;
      this.searchDone = false;
      axios
        .get(`/api/user/categoryDoctors/${this.category}`)
        .then(response => {
          var response = response.data.doctors;
          this.doctors = response.data;
          this.handlePagination(response);
          this.doctors.length == 0
            ? (this.no_doctors = true)
            : (this.no_doctors = false);
          this.doctors_loading = false;
        })
        .catch(error => {
          this.no_doctors = true;
          this.doctors_loading = false;
        });
    },
    doctorsPagination() {
      this.doctors_loading = true;
      if (this.searchDone == true) {
        var url = `/api/user/doctorSearch/${this.search.category_id}/${
          this.search.name
        }?page=${this.page}`;
      } else {
        var url = `/api/user/categoryDoctors/${this.category}?page=${
          this.page
        }`;
      }
      axios
        .get(url)
        .then(response => {
          var response = response.data.doctors;
          this.doctors = response.data;
          this.handlePagination(response);
          this.doctors.length == 0
            ? (this.no_doctors = true)
            : (this.no_doctors = false);
          this.doctors_loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCategories() {
      axios
        .get(`/api/user/getCategories`)
        .then(response => {
          var response = response.data;
          this.categories = response.categories;
        })
        .catch(error => {
          console.log(error);
        });
    },
    categoryFilter(item, queryText, itemText) {
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
    searchDoctors() {
      this.doctors_loading = true;
      this.search.name == null ? (this.search.name = "") : "";
      this.search.category_id == null ? (this.search.category_id = 0) : "";
      this.searchDone = true;
      axios
        .get(
          `/api/user/doctorSearch/${this.search.category_id}/${
            this.search.name
          }`
        )
        .then(response => {
          var response = response.data.doctors;
          this.doctors = response.data;
          if (this.doctors.length == 0) {
            this.showSnackBar("no result match your search");
          }
          this.handlePagination(response);
          this.doctors.length == 0
            ? (this.no_doctors = true)
            : (this.no_doctors = false);
          this.doctors_loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    clearSearch() {
      this.search.name = null;
      this.search.category_id = null;
      this.searchDone == true ? this.getDoctors() : "";
    },
    showSnackBar(message) {
      this.snackbarMessage = message;
      this.snackbar = true;
    },
    closeSnackBar() {
      this.snackbar = false;
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
  font-size: 18px;
  color: black;
  font-weight: bold;
}
.doctor-link {
  color: black !important;
}
.search_form{
  background-color: #ffffff80!important;
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