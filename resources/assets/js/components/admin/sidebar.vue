<template>
<div>
    <v-btn fab color="white" @click.stop="drawer = !drawer">
      <v-icon color="black">list</v-icon>
    </v-btn>
    <v-navigation-drawer 
    permenant 
    absolute 
    enable-resize-watcher
    v-model="drawer" 
    class="sidebar">
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar size="50">
              <img :src="image_src"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{user.name}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <div v-for="item in items" :key="item.title">
        <router-link :to="{path:item.link}">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon size="23px">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="body-2">{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        </router-link>
        </div>
      <v-list-group>          
        <v-list-tile slot="activator">
          <v-list-tile-title class="body-2">Appointmnets</v-list-tile-title>
        </v-list-tile>
          <div v-for="(appointment, i) in appointments" :key="i">
          <router-link :to="{path:appointment.link}">
          <v-list-tile>
          <v-list-tile-action>
            <v-icon>{{appointment.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{appointment.title}}</v-list-tile-title>
          </v-list-tile>
          </router-link>
          </div>
        </v-list-group>
        <div class="logout-div">
          <v-btn @click="logout" color="pink" dark>logout</v-btn>
        </div>
      </v-list>
      <v-btn fab dark small color="white" style="float:right" @click.stop="drawer = !drawer">
        <v-icon color="black">keyboard_arrow_left</v-icon>
      </v-btn>
    </v-navigation-drawer>
</div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      image_src: "",
      appointments: [
        { title: "All", icon: "assignment_ind", link: "/admin/appointments" },
        {
          title: "Today",
          icon: "assignment_returned",
          link: "/admin/appointments/today"
        },
        {
          title: "checked",
          icon: "assignment_turned_in",
          link: "/admin/appointments/checked"
        },
        {
          title: "unchecked",
          icon: "assignment_late",
          link: "/admin/appointments/unchecked"
        }
      ],
      drawer: true,
      clipped: false,
      items: [
        { title: "Dashboard", icon: "dashboard", link: "/admin" },
        { title: "Users", icon: "people", link: "/admin/users" },
        { title: "Categories", icon: "work", link: "/admin/categories" },
        { title: "Feedbacks", icon: "feedback", link: "/admin/feedbacks" }
      ]
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/check", {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          this.user = response.data;
          this.image_src = "/uploads/" + this.user.image;
        })
        .catch(error => {
          console.log(error);
        });
    },
    logout() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/logout", {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then(response => {
          localStorage.removeItem("token");
          this.$router.push("/admin/login");
        })
        .catch(error => {
          localStorage.removeItem("token");
          this.$router.push("/admin/login");
        });
    }
  }
};
</script>

<style>
.application.theme--dark a {
  cursor: pointer;
  text-decoration: none;
}
div {
  color: white;
}
.sidebar {
  width: 200px !important;
  padding: 0px;
}
.logout-div {
  text-align: center;
}
</style>