<template>
  <!--add dialog-->
      <v-dialog v-model="dialog" persistent max-width="400px">
        <v-card>
        <v-card-title class="headline">Are you sure you want to delete that appointment?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="closeDialog">close</v-btn>
          <v-btn color="green darken-1" @click="deleteAppointment">Delete</v-btn>
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
    appointmentId: {
      required: true
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-delete-dialog", false);
    },
    deleteAppointment() {
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/appointment/delete/${this.appointmentId}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.$emit("close-delete-dialog", true);
        })
        .catch(error => {
          this.$emit("failed-delete-appointment");
        });
    }
  }
};
</script>
<style>
</style>