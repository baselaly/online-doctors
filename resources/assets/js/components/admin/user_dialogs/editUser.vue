<template>
  <!--edit dialog-->
      <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card v-if="loading" style="padding:50px; text-align:center;">
        <v-progress-circular indeterminate :size="70" :width="7" color="amber"></v-progress-circular>
      </v-card>
      <v-card v-if="!loading">
        <v-card-title>
          <span class="headline">Edit User</span>
        </v-card-title>
        <v-card-text>
              <v-form v-model="formValid">
                <v-container>
                  <v-layout row wrap>
                <v-flex xs12 lg6>
                  <v-text-field hint="enter your email" :rules="emailRules" v-model="user.email" label="Email"></v-text-field>
                  <v-text-field hint="your password must be atleast 6 chars"
                  :type="passwordHide?'password':'text'" 
                  v-model="Newpassword" 
                  :append-icon="passwordHide ? 'visibility' : 'visibility_off'"
                  @click:append="() => (passwordHide = !passwordHide)"
                  label="Password">
                  </v-text-field>
                  <v-text-field hint="enter your name" :rules="name_addressRules" v-model="user.name" label="Name"></v-text-field>
                  <v-text-field hint="enter your phone" :rules="phoneRules" v-model="user.phone" label="Phone"></v-text-field>
                  <v-text-field hint="enter your fees in EGP" :rules="feesRules" v-model="user.fees" v-if="user.role_id==2" label="Fees in EGP"></v-text-field>
                </v-flex>
                <v-flex xs12 lg5 class="second_flex">
                  <v-text-field hint="enter your address" :rules="name_addressRules" v-model="user.address" label="Address"></v-text-field>
                  <v-select
                  :rules="requiredRules"
                  @change="roleChange"
                  :items="roles"
                  v-model="user.role_id"
                  label="Select role"
                  single-line
                  :disabled="true"
                  item-text="name"
                  item-value="id"
                  ></v-select>
                  <v-autocomplete
                  :items="categories"
                  :filter="customFilter"
                  v-model="user.category_id"
                  item-text="name"
                  item-value="id"
                  label="Select category"
                  :disabled="user.role_id!=2"
                  ></v-autocomplete>
                  <label for="edit-file-upload" class="custom-file-upload">
                      <i class="fa fa-cloud-upload"></i> Upload Your Image
                  </label>
                  <input id="edit-file-upload" @change="getUserImage($event)" type="file"/>
                </v-flex>
                <v-flex xs12>
                  <v-btn color="info" :disabled="!formValid" @click="editUser">Save</v-btn>
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
      passwordHide: true,
      formValid: true,
      Newpassword: "",
      userImage: "",
      emailRules: [
        v => !!v || "Email is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
        v => v.length <= 50 || "email has maximum 50 characters"
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
      feesRules: [v => /^[0-9]*$/.test(v) || "enter valid fees"]
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
    },
    loading: {
      default: true,
      type: Boolean,
      required: true
    },
    user: {
      required: true,
      type: Object
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-edit-dialog", false);
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
        if (this.user.role_id == 2) {
        } else if (this.user.role_id != 2) {
          this.user.category_id = null;
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
    editUser() {
      if (this.formValid) {
        let formData = new FormData();
        formData.append("name", this.user.name);
        formData.append("role_id", this.user.role_id);
        formData.append("phone", this.user.phone);
        formData.append("address", this.user.address);
        formData.append("email", this.user.email);
        if (this.Newpassword.length > 1) {
          if (this.Newpassword.length >= 6) {
            formData.append("password", this.Newpassword);
          } else {
            this.activateSnackbar(
              true,
              "red",
              "your password must be at least 6 chars"
            );
            return;
          }
        }
        var passed = false;
        if (this.user.role_id == 2) {
          if (this.user.category_id != null) {
            formData.append("category_id", this.user.category_id);
            if (this.user.fees != null && this.user.fees > 1) {
              formData.append("fees", this.user.fees);
            } else {
              this.activateSnackbar(true, "red", "please enter valid fees");
              return;
            }
            passed = true;
          } else {
            passed = false;
            this.activateSnackbar(true, "red", "please enter valid specialist");
            return;
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
            .post(`/api/admin/user/edit/${this.user.id}`, formData, {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "multipart/form-data"
              }
            })
            .then(response => {
              this.$emit("close-edit-dialog", true);
            })
            .catch(error => {
              if (error.message == "Request failed with status code 422") {
                this.activateSnackbar(true, "red", "email already taken");
              } else {
                this.activateSnackbar(true, "red", "something went wrong");
              }
            });
        } else {
          this.activateSnackbar(true, "red", "please choose doctor's category");
        }
      } else {
        this.activateSnackbar(true, "red", "please enter valid data");
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
