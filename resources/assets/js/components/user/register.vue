<template>
    <v-container>
        <v-flex xs10 lg4 mx-auto mt pb-5>
            <v-flex center-who headline color="white">
                register
            </v-flex>
            <v-card class="card-style">
                <v-form v-model="registerForm">
                  <v-text-field hint="enter your email" :rules="emailRules" v-model="user.email" label="Email"></v-text-field>
                  <v-text-field hint="enter your name" :rules="name_addressRules" v-model="user.name" label="Name"></v-text-field>
                  <v-text-field hint="enter your password"
                      :rules="passwordRules" 
                      :type="passwordHide?'password':'text'" 
                      v-model="user.password" 
                      :append-icon="passwordHide ? 'visibility' : 'visibility_off'"
                      @click:append="() => (passwordHide = !passwordHide)"
                      label="Password">
                  </v-text-field>
                  <v-text-field hint="enter your address" :rules="name_addressRules" v-model="user.address" label="Address"></v-text-field>
                  <v-text-field hint="enter your phone" :rules="phoneRules" v-model="user.phone" label="Phone number"></v-text-field>
                  <!--<label for="file-upload" class="custom-file-upload">
                    <i class="fa fa-cloud-upload"></i> Upload Your Image
                  </label>
                  <input id="file-upload" @change="getUserImage($event)" type="file"/>-->
                  <v-btn color="info" @click="register" :disabled="!registerForm">register</v-btn>
                  <v-flex d-inline-block ml-5 class="subheading">already user? 
                    <router-link style="color: #0277bd;" class="body-1" to="/login">login</router-link>
                  </v-flex>
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
      registerForm: true,
      user: {
        email: "",
        phone: "",
        password: "",
        address: "",
        name: "",
        image: ""
      },
      snackbarMessage: "",
      snackbarColor: "",
      snackbar: false,
      passwordHide: true,
      passwordRules: [
        v => !!v || "password is required",
        v => v.length >= 6 || "password must be atleast 6 characters",
        v => v.length <= 40 || "password must be atmost 40 characters"
      ],
      emailRules: [
        v => !!v || "Email is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
        v => v.length <= 50 || "email has maximum 50 characters"
      ],
      phoneRules: [
        v => !!v || "the phone is required",
        v => /^[0-9]*$/.test(v) || "enter valid phone number",
        v => v.length <= 20 || "phone has maximum 20 numbers"
      ],
      name_addressRules: [
        v => !!v || "this field is required",
        v => v.length <= 30 || "this field has maximum 30 characters"
      ]
    };
  },
  created() {},
  methods: {
    register() {
      if (this.registerForm) {
        /*let formData = new FormData();
        formData.append("name", this.user.name);
        formData.append("phone", this.user.phone);
        formData.append("address", this.user.address);
        formData.append("email", this.user.email);
        formData.append("password", this.user.password);
        if (this.user.image != "") {
          formData.append("image", this.user.image);
        }*/
        axios
          .post("/api/user/register", this.user)
          .then(response => {
            localStorage.setItem("token", response.data.token);
            window.location.href = "/";
          })
          .catch(error => {
            if (error.message == "Request failed with status code 422") {
              this.activateSnackbar(true, "red", "this email already taken");
            } else {
              this.activateSnackbar(true, "red", "something went wrong");
            }
          });
      } else {
        this.activateSnackbar(
          true,
          "red",
          "please enter all the required data"
        );
      }
    },
    /*getUserImage(event) {
      this.user.image = "";
      var image = event.target.files[0];
      if (image != "" && image != null && image != undefined) {
        var type = image.type;
        if (
          type != "image/png" &&
          type != "image/jpg" &&
          type != "image/jpeg"
        ) {
          this.activateSnackbar(true, "red", "please choose valid image");
        } else {
          this.activateSnackbar(true, "green darken-2", "your image is valid");
          this.user.image = image;
        }
      } else {
        this.activateSnackbar(true, "red", "please choose valid image");
      }
    },*/
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
  margin-top: 70px;
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
input[type="file"] {
  display: none;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}
</style>