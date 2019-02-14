<template>
  <!--add dialog-->
      <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add User</span>
        </v-card-title>
        <v-card-text>
              <v-form v-model="formValid">
                <v-container>
                  <v-layout row wrap>
                <v-flex xs12 lg6>
                  <v-text-field hint="enter your email" :rules="emailRules" v-model="newUser.email" label="Email"></v-text-field>
                  <v-text-field hint="your password must be atleast 6 chars"
                  :rules="passwordRules" 
                  :type="passwordHide?'password':'text'" 
                  v-model="newUser.password" 
                  :append-icon="passwordHide ? 'visibility' : 'visibility_off'"
                  @click:append="() => (passwordHide = !passwordHide)"
                  label="Password">
                  </v-text-field>
                  <v-text-field hint="enter your name" :rules="name_addressRules" v-model="newUser.name" label="Name"></v-text-field>
                  <v-text-field hint="enter your phone" :rules="phoneRules" v-model="newUser.phone" label="Phone"></v-text-field>
                  <v-text-field hint="enter your fees in EGP" :rules="feesRules" v-model="newUser.fees" :disabled="categoryDisabled" label="Fees in EGP"></v-text-field>
                </v-flex>
                <v-flex xs12 lg5 class="second_flex">
                  <v-text-field hint="enter your address" :rules="name_addressRules" v-model="newUser.address" label="Address"></v-text-field>
                  <v-select
                  :rules="requiredRules"
                  @change="roleChange"
                  :items="roles"
                  v-model="newUser.role_id"
                  label="Select role"
                  single-line
                  item-text="name"
                  item-value="id"
                  ></v-select>
                  <v-autocomplete
                  :items="categories"
                  :filter="customFilter"
                  v-model="category_id"
                  item-text="name"
                  item-value="id"
                  label="Select category"
                  :disabled="categoryDisabled"
                  ></v-autocomplete>
                  <label for="file-upload" class="custom-file-upload">
                      <i class="fa fa-cloud-upload"></i> Upload Your Image
                  </label>
                  <input id="file-upload" @change="getUserImage($event)" type="file"/>
                </v-flex>
                <v-flex xs12>
                  <v-btn color="info" :disabled="!formValid" @click="addUser">Save</v-btn>
                  <v-btn color="red" @click="closeDialog">Close</v-btn>
                </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
        </v-card-text>
      <v-snackbar class="snackbar_style" top v-model="snackbar" :color="snackbarColor">
        {{snackbarMessage}}
      </v-snackbar>
      </v-card>
    </v-dialog>
    <!--add dialog-->
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "",
      categoryDisabled: true,
      passwordHide: true,
      formValid: true,
      category_id: null,
      userImage: "",
      newUser: {
        email: "",
        password: "",
        name: "",
        address: "",
        phone: "",
        role_id: 1,
        fees: ""
      },
      emailRules: [
        v => !!v || "Email is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
        v => v.length <= 50 || "email has maximum 50 characters"
      ],
      passwordRules: [
        v => !!v || "password is required",
        v => v.length >= 6 || "password must be atleast 6 characters",
        v => v.length <= 40 || "password must be atmost 40 characters"
      ],
      requiredRules: [v => !!v || "this field is required"],
      name_addressRules: [
        v => !!v || "this field is required",
        v => v.length <= 30 || "this field has maximum 30 characters"
      ],
      phoneRules: [
        v => !!v || "the phone is required",
        v => /^[0-9]*$/.test(v) || "enter valid phone number",
        v => v.length <= 20 || "phone has maximum 20 numbers"
      ],
      feesRules: [
        v => /^[0-9]*$/.test(v) || "enter valid fees",
        v => v.length <= 10 || "fees has maximum 10 numbers"
      ]
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    roles: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-add-dialog", false);
      this.clearForm();
    },
    customFilter(item, queryText, itemText) {
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
    roleChange() {
      setTimeout(() => {
        if (this.newUser.role_id == 2) {
          this.categoryDisabled = false;
        } else if (this.newUser.role_id != 2) {
          this.categoryDisabled = true;
          this.category_id = null;
          this.newUser.fees = "";
        }
      });
    },
    getUserImage(event) {
      this.userImage = "";
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
          this.userImage = image;
        }
      } else {
        this.activateSnackbar(true, "red", "please choose valid image");
      }
    },
    addUser() {
      if (this.formValid) {
        let formData = new FormData();
        formData.append("name", this.newUser.name);
        formData.append("role_id", this.newUser.role_id);
        formData.append("phone", this.newUser.phone);
        formData.append("address", this.newUser.address);
        formData.append("email", this.newUser.email);
        formData.append("password", this.newUser.password);
        var passed = false;
        if (this.newUser.role_id == 2) {
          if (this.category_id != null && this.newUser.fees != "") {
            formData.append("category_id", this.category_id);
            formData.append("fees", this.newUser.fees);
            passed = true;
          } else {
            passed = false;
          }
        } else {
          passed = true;
        }
        if (passed) {
          if (this.userImage != "") {
            formData.append("image", this.userImage);
          }
          var token = localStorage.getItem("token");
          axios
            .post("/api/admin/user/add", formData, {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data"
              }
            })
            .then(response => {
              this.clearForm();
              this.$emit("close-add-dialog", true);
            })
            .catch(error => {
              if (error.message == "Request failed with status code 422") {
                this.activateSnackbar(true, "red", "email already taken");
              } else {
                this.activateSnackbar(true, "red", "something went wrong");
              }
            });
        } else {
          this.activateSnackbar(
            true,
            "red",
            "please check doctor's section or fees"
          );
        }
      } else {
        this.activateSnackbar(true, "red", "please enter valid data");
      }
    },
    clearForm() {
      this.newUser.name = "";
      this.newUser.email = "";
      this.newUser.role_id = 1;
      this.newUser.password = "";
      this.newUser.address = "";
      this.newUser.phone = "";
      this.category_id = "";
      this.newUser.fees = "";
      this.categoryDisabled = true;
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
.second_flex {
  margin-left: 20px;
}
.snackbar_style {
  top: 100px;
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
</style>
