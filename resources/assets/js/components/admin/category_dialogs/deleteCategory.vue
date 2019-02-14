<template>
  <!--delete dialog-->
      <v-dialog v-model="dialog" persistent max-width="400px">
        <v-card>
        <v-card-title class="headline">Are you sure you want to delete that category?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="closeDialog">close</v-btn>
          <v-btn color="green darken-1" @click="deleteCategory">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--delete dialog-->
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    categoryId: {
      required: true
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-delete-dialog", false);
    },
    deleteCategory() {
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/category/delete/${this.categoryId}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.$emit("close-delete-dialog", true);
        })
        .catch(error => {
          if (error.message == "Request failed with status code 403") {
            this.$emit("failed-delete-category", true);
          } else {
            this.$emit("failed-delete-category", false);
          }
        });
    }
  }
};
</script>
<style>
</style>