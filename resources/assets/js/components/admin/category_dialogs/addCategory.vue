<template>
  <!--add dialog-->
      <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Category</span>
        </v-card-title>
        <v-card-text>
              <v-form v-model="formValid">
                <v-container>
                  <v-layout row wrap>
                  <v-text-field hint="enter your category name" :rules="requiredRules" v-model="newCategory.name" label="Category name"></v-text-field>
                <v-flex xs12>
                  <v-btn color="info" :disabled="!formValid" @click="addCategory">Save</v-btn>
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
      formValid: true,
      newCategory: {
        name: ""
      },
      requiredRules: [
        v => !!v || "this field is required",
        v => v.length <= 50 || "name has maximum 50 characters"
      ]
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-add-dialog", false);
      this.clearForm();
    },
    addCategory() {
      if (this.formValid) {
        var token = localStorage.getItem("token");
        axios
          .post("/api/admin/category/add", this.newCategory, {
            headers: {
              Authorization: "Bearer " + token
            }
          })
          .then(response => {
            this.clearForm();
            this.$emit("close-add-dialog", true);
          })
          .catch(error => {
            this.activateSnackbar(true, "red", "something went wrong");
          });
      } else {
        this.activateSnackbar(true, "red", "please enter valid data");
      }
    },
    clearForm() {
      this.newCategory.name = "";
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
  top: 200px;
}
</style>