<template>
    <v-card raised tile class="nav-card">
        <v-toolbar class="px-5" color="light-blue darken-3">
            <v-toolbar-title>        
              <router-link to="/">
                <img :src="logo" alt="avatar">
              </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>

                <v-menu open-on-hover bottom offset-y v-if="AuthUser">
                  <v-btn slot="activator" flat color="white">
                    <v-avatar class="mr-2 navbar-avatar" size="40">
                      <img :src="user.image"/>
                    </v-avatar>
                    {{user.name}} <v-icon color="white">keyboard_arrow_down</v-icon>
                  </v-btn>

                  <v-list color="light-blue darken-3">
                    <router-link to="/profile">
                      <v-list-tile color="black">
                        <v-list-tile-title>
                          <v-icon color="black">person</v-icon> profile
                        </v-list-tile-title>
                      </v-list-tile>
                    </router-link>
                    <router-link to="/upcoming">
                      <v-list-tile color="black">
                        <v-list-tile-title>
                          <v-icon color="black">event_available</v-icon> upcomming
                        </v-list-tile-title>
                      </v-list-tile>
                    </router-link>
                    <router-link to="/finished">
                      <v-list-tile color="black">
                        <v-list-tile-title>
                          <v-icon color="black">history</v-icon> history
                        </v-list-tile-title>
                      </v-list-tile>
                    </router-link>
                    <router-link v-on:click.native="logout" to="/">
                      <v-list-tile color="black">
                        <v-list-tile-title>
                          <v-icon color="black">lock</v-icon> logout
                        </v-list-tile-title>
                      </v-list-tile>
                    </router-link>
                  </v-list>
                </v-menu>
            
            <div class="mx-2" v-if="NotAuthUser">
            <router-link class="body-1 navbar-link" to="/register">
            |    sign up
            </router-link>
            </div>
            <div class="mx-2" v-if="NotAuthUser">
            <router-link class="body-1 navbar-link" to="/login">
            |    login
            </router-link>
            </div>
            <div class="mx-2">
            <router-link class="body-1 navbar-link" to="/doctor/login">
            |    Are you Doctor?
            </router-link>
            </div>
            <div class="mx-2">
            <router-link class="body-1 navbar-link" to="#">
            |    contact us
            </router-link>
            </div>
        </v-toolbar>
    </v-card>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: "",
        image: ""
      },
      AuthUser: false,
      NotAuthUser: false,
      logo:
          "https://cdn.vezeeta.com/vezeeta-live-9-0-9-9/Assets/Img/whitelogowithdotcom.png"
        //null
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      var token = localStorage.getItem("token");
      if (token) {
        axios
          .get("/api/user/check", {
            headers: {
              Authorization: "Bearer " + token
            }
          })
          .then(response => {
            this.user = response.data;
            this.AuthUser = true;
          })
          .catch(error => {
            this.NotAuthUser = true;
          });
      } else {
        this.NotAuthUser = true;
      }
    },
    logout() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/user/logout", {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          localStorage.removeItem("token");
          window.location.href = "/";
        })
        .catch(error => {
          localStorage.removeItem("token");
          window.location.href = "/";
        });
    }
  }
};
</script>

<style>
.navbar-link {
  cursor: pointer;
  color: white;
  text-decoration: none;
}

.application.theme--light a {
  text-decoration: none;
}
.nav-card {
  z-index: 1005;
}
.theme--light .list {
  /*background: #0277bd;*/
  color: rgba(0, 0, 0, 0.87);
}
.navbar-avatar {
  box-shadow: -1px 1px 12px 0px #0000008f;
}
</style>