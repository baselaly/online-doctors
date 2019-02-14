<template>
<v-flex>
    <v-card color="black">
        <v-parallax
        class="white--text py-5"
        :src="header"
        height="600"
        >
        <v-container fill-height fluid>
            <v-layout fill-height>
            <v-flex xs12>
                <v-flex xs12 align-end flexbox>
                    <span class="display-2">Visit the Best doctors when you want to</span>
                </v-flex>
                <v-flex mx-3 pt-2 xs12 align-end flexbox>
                    <span class="headline">Book Online or Call <v-icon color="black">phone</v-icon> 16676</span>
                </v-flex>
                <v-card class="mt-5 search_form" elevation-10>
                    <v-form class="px-4 py-3">
                        <v-flex xs12>
                            <v-flex xs12 lg4 mx-4 class="display_inline_div">
                                <v-autocomplete
                                prepend-icon="business_center"
                                :items="categories"
                                :loading="category_search_loading"
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
    </v-card>
    <v-layout fill-height px-5 pt-4>
        <v-flex xs12 text-xs-center>
            <span class="display-1">How to Book with Online Doctors</span>
        </v-flex>
    </v-layout>
    <v-layout fill-height px-1 py-5 text-xs-center>
        <v-flex xs12>
            <v-flex class="mx-5 my-5 display_inline_div" xs12 lg4>
                <v-card xs12 class="white--text elevation-15" color="light-blue darken-3">
                <v-layout text-xs-center>
                    <v-flex xs12 text-xs-center>
                    <v-card-title primary-title text-xs-center>
                        <div class="text-xs-center">
                        <div class="headline">
                            <v-badge left color="black" class="badge">
                            <span slot="badge">1</span>
                            </v-badge>                                
                        </div>
                        <div class="title">
                            <v-icon
                                color="black"
                                size="40"
                            >
                                search
                            </v-icon>
                            Search for doctors</div>
                        </div>
                    </v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider light></v-divider>
                <v-card-actions class="pa-3">
                        <div class="subheading">By Name and specialisty</div>
                </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex class="mx-5 my-5 display_inline_div" xs12 lg4>
                <v-card xs12 class="white--text elevation-15" color="light-blue darken-3">
                <v-layout text-xs-center>
                    <v-flex xs12 text-xs-center>
                    <v-card-title primary-title text-xs-center>
                        <div class="text-xs-center">
                        <div class="headline">
                            <v-badge left color="black" class="badge">
                            <span slot="badge">2</span>
                            </v-badge>                                
                        </div>
                        <div class="title">
                            <v-icon
                                color="black"
                                size="40"
                            >
                                find_in_page
                            </v-icon>
                            Compare and Choose</div>
                        </div>
                    </v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider light></v-divider>
                <v-card-actions class="pa-3">
                        <div class="subheading">By other patient's rating</div>
                </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex class="mx-5 my-5 display_inline_div" xs12 lg4>
                <v-card xs12 class="white--text elevation-15" color="light-blue darken-3">
                <v-layout text-xs-center>
                    <v-flex xs12 text-xs-center>
                    <v-card-title primary-title text-xs-center>
                        <div class="text-xs-center">
                        <div class="headline">
                            <v-badge left color="black" class="badge">
                            <span slot="badge">3</span>
                            </v-badge>                                
                        </div>
                        <div class="title">
                            <v-icon
                                color="black"
                                size="40"
                            >
                                date_range
                            </v-icon>
                            Book your Appointment</div>
                        </div>
                    </v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider light></v-divider>
                <v-card-actions class="pa-3">
                        <div class="subheading">Hassle-free</div>
                </v-card-actions>
                </v-card>
            </v-flex>
        </v-flex>
    </v-layout>
    <v-layout fill-height px-5 pt-4>
    <v-flex xs12 text-xs-center>
        <span class="display-1">Our Doctors</span>
    </v-flex>
    </v-layout>
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
    <v-layout fill-height px-3 py-5 text-xs-center v-if="!doctors_loading">
        <v-flex xs12>
            <v-flex class="mx-3 my-5 display_inline_div" v-for="(doctor, i) in doctors" :key="i" xs12 lg4>
                <v-card xs12 class="black--text">
                <v-layout>
                    <v-flex xs4>
                    <router-link :to="{ name: 'doctor', params: {id: doctor.id, name: doctor.name } }">
                        <v-img
                            :src="doctor.image"
                            height="125px"
                            contain
                            class="ml-2"
                        ></v-img>
                    </router-link>
                    </v-flex>
                    <v-flex xs8 text-xs-left>
                    <v-card-title primary-title>
                        <div>
                        <div class="title py-1 text-truncate"><router-link class="doctor-link" :to="{ name: 'doctor', params: {id: doctor.id, name: doctor.name } }"> Dr. {{doctor.name}} </router-link></div>
                        <div class="body-1 py-1 text-truncate">specialist: <router-link class="specialist-link" :to="{ name: 'specialist', params: {id: doctor.category.id } }">{{doctor.category.name}}</router-link></div>
                        <div class="caption py-1 text-truncate">{{doctor.appointments_count}} Appointment(s)</div>
                        </div>
                    </v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider light></v-divider>
                <v-card-actions class="pa-3 text-xs-center">
                    <div class="text-xs-center">
                        <v-rating
                        readonly
                        v-model="doctor.rate"
                        background-color="yellow darken-2"
                        color="yellow darken-2"
                        size="22"
                        half-increments
                        >
                        </v-rating>
                    </div>
                    <v-spacer></v-spacer>
                    <router-link :to="{ name: 'doctor', params: {id: doctor.id, name: doctor.name } }">
                        <v-btn
                        color="light-blue darken-3"
                        class="white--text"
                        small
                        >
                        Book
                        <v-icon right dark>event</v-icon>
                        </v-btn>
                    </router-link>
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
</v-flex>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      pagination: false,
      category_search_loading: false,
      page: 1,
      pagination_length: 0,
      snackbarMessage: "",
      doctors: [],
      searchDone: false,
      no_doctors: false,
      doctors_loading: true,
      categories: [],
      snackbar: false,
      search: {
        category_id: null,
        name: null
      },
      header:
        "https://cdn.vezeeta.com/vezeeta-live-9-0-9-9/Assets/Img/homecovernewen3-eg.jpg"
    };
  },
  created() {
    this.getDoctors();
    this.getCategories();
  },
  methods: {
    getDoctors() {
      this.searchDone = false;
      axios
        .get("/api/user/getDoctors")
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
    doctorsPagination() {
      this.doctors_loading = true;
      if (this.searchDone == true) {
        var url = `/api/user/doctorSearch/${this.search.category_id}/${
          this.search.name
        }?page=${this.page}`;
      } else {
        var url = `/api/user/getDoctors?page=${this.page}`;
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
      this.category_search_loading = true;
      const hasValue = val => (val != null ? val : "");
      const text = hasValue(item.name);
      const query = hasValue(queryText);
      this.category_search_loading = false;
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
.specialist-link {
  color: #2e9bf3 !important;
}
.doctor-link {
  color: black !important;
}
.v-card__title--primary {
    padding-top: 20px!important;
}
.v-card__title {
    padding-left: 5px!important;
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