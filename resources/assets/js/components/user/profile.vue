<template>
    <v-container>
    <v-tabs
    centered
    color="light-blue darken-3"
    dark
    icons-and-text
    >
        <v-tabs-slider color="white"></v-tabs-slider>

        <v-tab href="#tab-1">
        Edit Profile
        <v-icon>person</v-icon>
        </v-tab>

        <v-tab href="#tab-2">
        Change Password
        <v-icon>lock</v-icon>
        </v-tab>

        <v-tab-item value="tab-1">
        <v-flex xs10 lg6 mx-auto mt pb-2>
          <v-card class="card-style">
            <v-flex xs12 px-5 py-5 text-xs-center v-if="profile_loading">
              <v-progress-circular indeterminate :size="80" :width="7" color="blue darken-1"></v-progress-circular>
            </v-flex>
            <v-form v-model="editProfileForm" v-if="!profile_loading">
              <v-text-field hint="enter your email" :rules="emailRules" v-model="user.email" label="Email"></v-text-field>
              <v-text-field hint="enter your name" :rules="name_addressRules" v-model="user.name" label="Name"></v-text-field>
              <v-text-field hint="enter your address" :rules="name_addressRules" v-model="user.address" label="Address"></v-text-field>
              <v-text-field hint="enter your phone" :rules="phoneRules" v-model="user.phone" label="Phone number"></v-text-field>
              <v-avatar class="mr-2 mb-2" size="100">
                <img :src="image"/>
              </v-avatar>
              <label for="file-upload" class="custom-file-upload">
                <i class="fa fa-cloud-upload"></i> Change Your Image
              </label>
              <input id="file-upload" @change="getUserImage($event)" type="file"/>
              <v-divider light></v-divider>
              <v-spacer></v-spacer><v-btn color="info" @click="editProfile" :disabled="!editProfileForm">Save</v-btn>
            </v-form>
          </v-card>
        </v-flex>
        </v-tab-item>
        <v-tab-item value="tab-2">
        <v-flex xs10 lg6 mx-auto mt pb-2>
          <v-card class="card-style">
            <v-form v-model="editPasswordForm">
              <v-text-field type="password" hint="Enter your old password" :rules="OldPasswordRules" v-model="password.oldPassword" label="* Old Password"></v-text-field>
              <v-text-field type="password" hint="Enter you new password" :rules="NewPasswordRules" v-model="password.newPassword" label="* New Password"></v-text-field>
              <v-btn color="info" @click="editPassword" :disabled="!editPasswordForm">change password</v-btn>
            </v-form>
          </v-card>
        </v-flex>
        </v-tab-item>
    </v-tabs>
    <v-snackbar v-model="snackbar" bottom left :color="snackbarColor">
      {{snackbarMessage}}
    </v-snackbar>
    </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      editProfileForm: true,
      editPasswordForm: true,
      profile_loading: true,
      image: false,
      user: {
        email: "",
        phone: "",
        address: "",
        name: "",
        image: ""
      },
      password: {
        oldPassword: "",
        newPassword: ""
      },
      snackbarMessage: "",
      snackbarColor: "",
      snackbar: false,
      NewPasswordRules: [
        v => !!v || "password is required",
        v => v.length >= 6 || "password must be atleast 6 characters",
        v => v.length <= 40 || "password must be atmost 40 characters"
      ],
      OldPasswordRules: [v => !!v || "password is required"],
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
            this.image = this.user.image;
            this.user.image = "";
          })
          .catch(error => {
            this.activateSnackbar(true, "red", "something went wrong");
          });
      } else {
        this.activateSnackbar(true, "red", "something went wrong");
      }
      this.profile_loading = false;
    },
    getUserImage(event) {
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
          //this.activateSnackbar(true,"green darken-2","you choose valid image");
          this.showImage(image);
          this.user.image = image;
        }
      } else {
        this.activateSnackbar(true, "red", "please choose valid image");
      }
    },
    showImage(image) {
      var file = new Image();
      var reader = new FileReader();

      reader.onload = event => {
        this.image = event.target.result;
      };
      reader.readAsDataURL(image);
    },
    editProfile() {
      if (this.editProfileForm) {
        let formData = new FormData();
        formData.append("name", this.user.name);
        formData.append("phone", this.user.phone);
        formData.append("address", this.user.address);
        formData.append("email", this.user.email);
        formData.append("password", this.user.password);
        if (this.user.image != "") {
          formData.append("image", this.user.image);
        }
        var token = localStorage.getItem("token");
        this.profile_loading = true;
        axios
          .post("/api/user/editProfile", formData, {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "multipart/form-data"
            }
          })
          .then(response => {
            this.user = response.data.user;
            this.activateSnackbar(true, "light-blue", "Profile has been saved");
            setTimeout(function() {
              window.location.href = "/";
            }, 2000);
          })
          .catch(error => {
            if (error.message == "Request failed with status code 422") {
              this.activateSnackbar(true, "red", "this email already taken");
            } else {
              this.activateSnackbar(true, "red", "something went wrong");
            }
          });
      } else {
        this.activateSnackbar(true, "red", "please enter all the data");
      }
      this.profile_loading = false;
    },
    editPassword() {
      if (this.editPasswordForm) {
        var token = localStorage.getItem("token");
        axios
          .post("/api/user/editPassword", this.password, {
            headers: {
              Authorization: "Bearer " + token
            }
          })
          .then(response => {
            this.user = response.data.user;
            this.activateSnackbar(true, "light-blue", "Password saved");
            setTimeout(function() {
              window.location.href = "/";
            }, 2500);
          })
          .catch(error => {
            if (error.message == "Request failed with status code 401") {
              this.activateSnackbar(true, "red", "wrong old password");
            } else {
              this.activateSnackbar(true, "red", "something went wrong");
            }
          });
      } else {
        this.activateSnackbar(true, "red", "please enter your passwords");
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
.application.theme--light a {
  cursor: pointer;
  color: white;
}
input[type="file"] {
  display: none;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}
.card-style {
  padding: 15px;
}
</style>