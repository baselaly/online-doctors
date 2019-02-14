<template>
<v-container>
    <v-layout row wrap>
      <v-flex xs12 lg3 align-content-center cardsHolder>
            <v-card color="orange lighten-1" class="white--text">
              <v-card-title primary-title>
                <div class="display-1">Users</div>
              </v-card-title>
              <v-card-text>
                <div class="title">{{admins_count}} admins</div>
                <div class="title">{{doctors_count}} Doctors</div>
                <div class="title">{{users_count}} Users</div>
              </v-card-text>
              <v-card-actions>
                <v-btn flat dark><router-link to="/admin/users">Show All</router-link></v-btn>
              </v-card-actions>
            </v-card>
      </v-flex>

      <v-flex xs12 lg3 align-content-center cardsHolder>
            <v-card color="pink" class="white--text">
              <v-card-title primary-title>
                <div class="display-1">Categories</div>
              </v-card-title>
              <v-card-text>
                <div class="title">{{categories_count}} categories</div>
              </v-card-text>
              <v-card-actions>
                <v-btn flat dark><router-link to="/admin/categories">Show All</router-link></v-btn>
              </v-card-actions>
            </v-card>
      </v-flex>

      <v-flex xs12 lg3 align-content-center cardsHolder>
            <v-card color="indigo" class="white--text">
              <v-card-title primary-title>
                <div class="display-1">Appointments</div>
              </v-card-title>
              <v-card-text>
                <div class="title">{{appointments_count}} appointments</div>
              </v-card-text>              
              <v-card-actions>
                <v-btn flat dark><router-link to="/admin/appointments">Show All</router-link></v-btn>
              </v-card-actions>
            </v-card>
      </v-flex>

      <v-flex xs12 lg3 align-content-center cardsHolder>
            <v-card color="cyan" class="white--text">
              <v-card-title primary-title>
                <div class="display-1">Feedbacks</div>
              </v-card-title>
              <v-card-text>
                <div class="title">{{feedbacks_count}} feedbacks</div>
              </v-card-text>
              <v-card-actions>
                <v-btn flat dark><router-link to="/admin/feedbacks">Show All</router-link></v-btn>
              </v-card-actions>
            </v-card>
      </v-flex>
      
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      doctors_count: "",
      users_count: "",
      admins_count: "",
      all_users_count: "",
      appointments_count: "",
      feedbacks_count: "",
      categories_count: ""
    };
  },
  created() {
    this.getStats();
  },
  methods: {
    getStats() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/statistics", {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          var data = response.data;
          this.users_count = data.users_count;
          this.admins_count = data.admins_count;
          this.categories_count = data.categories_count;
          this.doctors_count = data.doctors_count;
          this.feedbacks_count = data.feedbacks_count;
          this.appointments_count = data.appointments_count;
          this.all_users_count =
            this.doctors_count + this.users_count + this.admins_count;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style>
.cardsHolder {
  margin: 20px 30px;
}
</style>