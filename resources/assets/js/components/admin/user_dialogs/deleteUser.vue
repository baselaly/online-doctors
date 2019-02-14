<template>
  <!--add dialog-->
      <v-dialog v-model="dialog" persistent max-width="400px">
        <v-card>
        <v-card-title class="headline">Are you sure you want to delete that user?</v-card-title>
        <v-card-text>if you delete that user you will delete all things relate to him(appointments,feedbacks..)</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="closeDialog">close</v-btn>
          <v-btn color="green darken-1" @click="deleteUser">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--add dialog-->
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
    userId: {
      required: true
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-delete-dialog", false);
    },
    deleteUser() {
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/user/delete/${this.userId}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.$emit("close-delete-dialog", true);
        })
        .catch(error => {
          this.$emit("failed-delete-user");
        });
    }
  }
};
</script>
<style>
</style>