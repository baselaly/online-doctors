<template>
<v-container>
    <v-layout row wrap>
    <v-flex lg10 feedback-table>
  <v-card>
    <v-card-title>
      <v-chip color="white" large text-color="black">feedbacks</v-chip>
      <v-btn @click="show_add_dialog" fab dark color="indigo">
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="feedbacks"
      :search="search"
      dark
      hide-actions
      :loading="loading"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.feedback }}</td>
        <td class="text-xs-left">{{ props.item.patient.name }}</td>
        <td class="text-xs-left">{{ props.item.doctor.name }}</td>
        <td>
        <v-btn fab dark small color="success" @click="show_view_dialog(props.item.id)">
          <v-icon dark>visibility</v-icon>
        </v-btn>
        <v-btn fab dark small color="cyan" @click="show_edit_dialog(props.item.id)">
          <v-icon dark>edit</v-icon>
        </v-btn>
        <v-btn fab dark small color="red" @click="show_delete_dialog(props.item.id)">
          <v-icon dark>delete</v-icon>
        </v-btn>
        </td>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
  </v-card>
  <div xs8 class="text-xs-center" v-if="pagination">
    <v-pagination color="indigo" @input="feedbacksPagination" :length="pagination_length" v-model="page"></v-pagination>
  </div>
  </v-flex>
    </v-layout>
      <v-snackbar right bottom v-model="snackbar" :color="snackbarColor">
        {{snackbarMessage}}
      </v-snackbar>
      <add-feedback :doctors="doctors" :patients="patients" :dialog="add_dialog" @close-add-dialog="close_add_dialog"></add-feedback>
      <view-feedback :dialog="view_dialog" :loading="viewFeedback_loading" :feedback="viewFeedback" @close-view-dialog="close_view_dialog"></view-feedback>
      <delete-feedback :dialog="delete_dialog" :feedbackId="deleted_feedback_id" @failed-delete-feedback="showFailedDeleteFeedback" @close-delete-dialog="close_delete_dialog"></delete-feedback>
      <edit-feedback :dialog="edit_dialog" :loading="editFeedback_loading" :feedback="viewFeedback" :doctors="doctors" :patients="patients" @close-edit-dialog="close_edit_dialog"></edit-feedback>

</v-container>
</template>

<script>
import addFeedback from "./feedback_dialogs/addFeedback";
import viewFeedback from "./feedback_dialogs/viewFeedback";
import deleteFeedback from "./feedback_dialogs/deleteFeedback";
import editFeedback from "./feedback_dialogs/editFeedback";
export default {
  components: {
    addFeedback,
    viewFeedback,
    deleteFeedback,
    editFeedback
  },
  data() {
    return {
      pagination: false,
      page: 1,
      pagination_length: 0,
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "",
      //categories table
      feedbacks: [],
      doctors: [],
      patients: [],
      search: "",
      headers: [
        { text: "feedback", value: "feedback" },
        { text: "patient", value: "patient.name" },
        { text: "doctor", value: "doctor.name" },
        { text: "actions", value: "" }
      ],
      loading: true,
      defaultFeedback: {
        feedback: ""
      },
      // add category
      add_dialog: false,
      //view category
      view_dialog: false,
      viewFeedback: {
        feedback: ""
      },
      viewFeedback_loading: true,
      //delete category
      delete_dialog: false,
      deleted_feedback_id: "",
      //edit category
      edit_dialog: false,
      editFeedback_loading: true
    };
  },
  created() {
    this.getFeedbacks();
    this.getUsers();
  },
  methods: {
    getFeedbacks() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/feedback/getAll", {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          var response = response.data.feedbacks;
          this.feedbacks = response.data;
          if (response.last_page > 1) {
            this.page = response.current_page;
            this.pagination = true;
            this.pagination_length = response.last_page;
          }
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    feedbacksPagination() {
      this.loading = true;
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/feedback/getAll?page=${this.page}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          var response = response.data.feedbacks;
          this.feedbacks = response.data;
          if (response.last_page > 1) {
            this.page = response.current_page;
            this.pagination = true;
            this.pagination_length = response.last_page;
          }
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    getUsers() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/users/Doctors_patients", {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.doctors = response.data.doctors;
          this.patients = response.data.patients;
        })
        .catch(error => {
          console.log(error);
        });
    },
    activateSnackbar(state, color, message) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.snackbar = state;
    },
    //add dialog
    show_add_dialog() {
      this.add_dialog = true;
    },
    close_add_dialog(state) {
      if (state == false) {
        this.add_dialog = false;
      } else if (state == true) {
        this.add_dialog = false;
        this.activateSnackbar(
          true,
          "green darken-2",
          "feedback added successfuly"
        );
        this.getFeedbacks();
      }
    },
    //view dialog
    show_view_dialog(feedback_id) {
      this.view_dialog = true;
      setTimeout(() => {
        this.viewFeedback_loading = false;
      }, 1000);
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/feedback/getById/${feedback_id}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.viewFeedback = response.data.feedback;
          this.viewFeedback.doctor["image"] = `/uploads/${
            response.data.feedback.doctor.image
          }`;
          this.viewFeedback.patient["image"] = `/uploads/${
            response.data.feedback.patient.image
          }`;
        })
        .catch(error => {
          console.log(error);
        });
    },
    close_view_dialog() {
      this.view_dialog = false;
      setTimeout(() => {
        this.viewFeedback_loading = true;
        this.viewFeedback = this.defaultFeedback;
      }, 500);
    },
    //delete dialog
    show_delete_dialog(id) {
      this.deleted_feedback_id = id;
      this.delete_dialog = true;
    },
    close_delete_dialog(state) {
      if (state == false) {
        this.delete_dialog = false;
      } else if (state == true) {
        this.delete_dialog = false;
        this.activateSnackbar(
          true,
          "green darken-2",
          "feedback deleted successfuly"
        );
        this.getFeedbacks();
      }
    },
    showFailedDeleteFeedback() {
      this.activateSnackbar(true, "red", "something went wrong");
    },
    //edit dialog
    show_edit_dialog(feedback_id) {
      this.edit_dialog = true;
      setTimeout(() => {
        this.editFeedback_loading = false;
      }, 1000);
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/feedback/getById/${feedback_id}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.viewFeedback = response.data.feedback;
        })
        .catch(error => {
          console.log(error);
        });
    },
    close_edit_dialog(state) {
      if (state == true) {
        this.edit_dialog = false;
        this.activateSnackbar(
          true,
          "green darken-2",
          "feedback edited successfuly"
        );
        this.getFeedbacks();
        setTimeout(() => {
          this.editFeedback_loading = true;
        }, 500);
      } else {
        this.edit_dialog = false;
        setTimeout(() => {
          this.editFeedback_loading = true;
        }, 500);
      }
    }
  }
};
</script>

<style>
.feedback-table {
  margin-top: 0px;
}
</style>