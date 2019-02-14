<template>
  <!--edit dialog-->
      <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card v-if="loading" style="padding:50px; text-align:center;">
        <v-progress-circular indeterminate :size="70" :width="7" color="amber"></v-progress-circular>
      </v-card>
      <v-card v-if="!loading">
        <v-card-title>
          <span class="headline">Edit Category</span>
        </v-card-title>
        <v-card-text>
              <v-form v-model="formValid">
                <v-container>
                  <v-layout row wrap>
                  <v-text-field hint="enter your category" :rules="requiredRules" v-model="category.name" label="Category name"></v-text-field>
                <v-flex xs12>
                  <v-btn color="info" :disabled="!formValid" @click="editCategory">Save</v-btn>
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
    },
    loading: {
      default: true,
      type: Boolean,
      required: true
    },
    category: {
      required: true,
      type: Object
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-edit-dialog", false);
    },
    editCategory() {
      if (this.formValid) {
        var token = localStorage.getItem("token");
        axios
          .post(`/api/admin/category/edit/${this.category.id}`, this.category, {
            headers: {
              Authorization: "Bearer " + token
            }
          })
          .then(response => {
            this.$emit("close-edit-dialog", true);
          })
          .catch(error => {
            this.activateSnackbar(true, "red", "something went wrong");
          });
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
