<template>
    <v-container>
        <v-flex xs10 lg4 mx-auto mt pb-5>
            <v-flex center-who headline color="white" background-color="red">
                login
            </v-flex>
            <v-card class="card-style">
                <v-form v-model="loginForm">
                    <v-text-field hint="enter your email" :rules="emailRules" v-model="email" label="Email"></v-text-field>
                    <v-text-field hint="enter your password"
                      :rules="passwordRules" 
                      :type="passwordHide?'password':'text'" 
                      v-model="password" 
                      :append-icon="passwordHide ? 'visibility' : 'visibility_off'"
                      @click:append="() => (passwordHide = !passwordHide)"
                      label="Password">
                    </v-text-field>
                    <v-btn color="info" @click="login" :disabled="!loginForm">login</v-btn>
                    <v-flex d-inline-block ml-5 class="subheading">New user? <router-link style="color: #0277bd;" class="body-1" to="/register">sign up</router-link></v-flex>
                </v-form>
            </v-card>
        </v-flex>
        <v-snackbar bottom right v-model="snackbar" :color="snackbarColor">
        {{snackbarMessage}}
        </v-snackbar>
    </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loginForm: true,
      email: "",
      snackbarMessage: "",
      snackbarColor: "",
      snackbar: false,
      passwordHide: true,
      password: "",
      passwordRules: [v => !!v || "password is required"],
      emailRules: [
        v => !!v || "Email is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid"
      ]
    };
  },
  created() {},
  methods: {
    login() {
      if (this.loginForm) {
        axios
          .post("/api/user/login", {
            email: this.email,
            password: this.password
          })
          .then(response => {
            localStorage.setItem("token", response.data.token);
            //this.$router.push("/");
            window.location.href = '/';
          })
          .catch(error => {
            this.activateSnackbar(true, "red", "check your email and password");
          });
      } else {
        this.activateSnackbar(
          true,
          "red",
          "please enter email and password"
        );
      }
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
.mt {
  margin-top: 130px;
  margin-bottom: 50px;
}
.card-style {
  padding: 15px;
}
.center-who {
  text-align: center;
  background-color: #0277bd;
  color: white;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
}
/* .application.theme--light a {
  cursor: pointer;
  color: white;
} */
</style>