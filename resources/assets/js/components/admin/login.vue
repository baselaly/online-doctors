<template>
<v-app>
        <v-content>
            <v-container>
                <v-flex xs10 lg4 mx-auto mt>
                    <v-flex center-who display-2>
                        who's there?
                    </v-flex>
                    <v-card class="card-style">
                        <v-form v-model="formValid">
                            <v-text-field hint="enter your email" :rules="emailRules" v-model="email" label="Email"></v-text-field>
                            <v-text-field hint="enter your password"
                             :rules="passwordRules" 
                             :type="passwordHide?'password':'text'" 
                             v-model="password" 
                             :append-icon="passwordHide ? 'visibility' : 'visibility_off'"
                             @click:append="() => (passwordHide = !passwordHide)"
                             label="Password">
                             </v-text-field>
                            <v-btn color="info" :disabled="!formValid" @click="login">login</v-btn>
                        </v-form>
                    </v-card>
                </v-flex>
                    <v-snackbar bottom right v-model="snackbar" :color="snackbarColor">
                    {{snackbarMessage}}
                    </v-snackbar>
            </v-container>
        </v-content>
</v-app>
</template>

<script>
export default {
  data() {
    return {
      snackbarMessage: "",
      snackbarColor: "",
      snackbar: false,
      passwordHide: true,
      formValid: true,
      email: "",
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
  methods: {
    validate_email() {
      this.emailErrors = [];
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        return true;
      } else {
        this.emailErrors.push("error");
        return false;
      }
    },
    validate_password() {
      this.passwordErrors = [];
      if (this.password !== "" && this.password) {
        return true;
      } else {
        this.passwordErrors.push("error");
        return false;
      }
    },
    login() {
      this.validate_email();
      this.validate_password();
      if (this.emailErrors.length == 0 && this.passwordErrors.length == 0) {
        axios
          .post("/api/admin/login", {
            email: this.email,
            password: this.password
          })
          .then(response => {
            localStorage.setItem("token", response.data.token);
            this.$router.push("/admin");
          })
          .catch(error => {
            if (error.message == "Request failed with status code 422") {
              this.activateSnackbar(true, "red", "please check your info");
            } else if (error.message == "Request failed with status code 401") {
              this.activateSnackbar(true, "red", "wrong Email or password");
            } else {
              this.activateSnackbar(true, "red", "something went wrong");
            }
          });
      } else {
        if (this.emailErrors.length != 0) {
          this.activateSnackbar(true, "red", "please check your email");
        } else if (this.passwordErrors.length != 0) {
          this.activateSnackbar(true, "red", "please check your password");
        }
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
.v-content {
  background: #06beb6; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #48b1bf,
    #06beb6
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #48b1bf,
    #06beb6
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: rgb(255, 255, 255);
}
.mt {
  margin-top: 150px;
}
.card-style {
  padding: 15px;
}
.center-who {
  text-align: center;
}
</style>