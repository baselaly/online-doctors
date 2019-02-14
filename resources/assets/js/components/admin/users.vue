<template>
<v-container>
    <v-layout row wrap>
    <v-flex lg10 user-table>
  <v-card>
    <v-card-title>
      <v-chip color="white" large text-color="black">Users</v-chip>
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
      :items="users"
      :search="search"
      dark
      hide-actions
      :loading="loading"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.phone }}</td>
        <td class="text-xs-left">{{ props.item.role.name }}</td>
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
    <v-pagination color="indigo" @input="usersPagination" :length="pagination_length" v-model="page"></v-pagination>
  </div>
  </v-flex>
  <addUser :dialog="add_dialog" :roles="roles" :categories="categories" @close-add-dialog="close_add_dialog"></addUser>
  <viewUser :dialog="view_dialog" :user="viewUser" :loading="viewUser_loading" @close-view-dialog="close_view_dialog"></viewUser>
  <editUser :dialog="edit_dialog" :user="viewUser" :loading="editUser_loading" :roles="roles" :categories="categories" @close-edit-dialog="close_edit_dialog"></editUser>
  <deleteUser :dialog="delete_dialog" :userId="deleted_user_id" @failed-delete-user="showFailedDeleteUser" @close-delete-dialog="close_delete_dialog"></deleteUser>
    </v-layout>
      <v-snackbar right bottom v-model="snackbar" :color="snackbarColor">
        {{snackbarMessage}}
      </v-snackbar>
</v-container>

</template>

<script>
import addUser from "./user_dialogs/addUser";
import viewUser from "./user_dialogs/viewUser";
import editUser from "./user_dialogs/editUser";
import deleteUser from "./user_dialogs/deleteUser";
export default {
  components: {
    addUser,
    viewUser,
    editUser,
    deleteUser
  },
  data() {
    return {
      pagination: false,
      page: 1,
      pagination_length: 0,
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "",
      //users table
      users: [],
      roles: [],
      categories: [],
      search: "",
      headers: [
        { text: "name", value: "name" },
        { text: "email", value: "email" },
        { text: "phone", value: "phone" },
        { text: "role", value: "role.name" },
        { text: "actions", value: "" }
      ],
      loading: true,
      defaultUser: {
        name: "",
        email: "",
        phone: "",
        role: {
          name: ""
        },
        category: {
          name: ""
        },
        address: "",
        rate: "",
        image: "",
        fees: ""
      },
      // add user
      add_dialog: false,
      //view user
      view_dialog: false,
      viewUser: {
        name: "",
        email: "",
        phone: "",
        role: {
          name: ""
        },
        category: {
          name: ""
        },
        address: "",
        rate: "",
        image: "",
        fees: ""
      },
      viewUser_loading: true,
      //delete user
      delete_dialog: false,
      deleted_user_id: "",
      //edit user
      edit_dialog: false,
      editUser_loading: true
    };
  },
  created() {
    this.getUsers();
    this.getCategories();
    this.getRoles();
  },
  methods: {
    getUsers() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/user/getAll", {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          var response = response.data.users;
          this.users = response.data;
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
    usersPagination() {
      this.loading = true;
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/user/getAll?page=${this.page}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          var response = response.data.users;
          this.users = response.data;
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
    getCategories() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/category/getAllForUsers", {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.categories = response.data.categories;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getRoles() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/role/getAll", {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.roles = response.data.roles;
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
        this.activateSnackbar(true, "green darken-2", "user added successfuly");
        this.getUsers();
      }
    },
    //view dialog
    show_view_dialog(user_id) {
      this.view_dialog = true;
      setTimeout(() => {
        this.viewUser_loading = false;
      }, 1000);
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/user/getById/${user_id}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          console.log(response);
          this.viewUser = response.data.user;
          this.viewUser["image"] = `/uploads/${response.data.user.image}`;
        })
        .catch(error => {
          console.log(error);
        });
    },
    close_view_dialog() {
      this.view_dialog = false;
      setTimeout(() => {
        this.viewUser_loading = true;
        this.viewUser = this.defaultUser;
      }, 500);
    },
    show_delete_dialog(id) {
      this.deleted_user_id = id;
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
          "user deleted successfuly"
        );
        this.getUsers();
      }
    },
    showFailedDeleteUser() {
      this.activateSnackbar(true, "red", "something went wrong");
    },
    show_edit_dialog(user_id) {
      this.edit_dialog = true;
      setTimeout(() => {
        this.editUser_loading = false;
      }, 1000);
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/user/getById/${user_id}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.viewUser = response.data.user;
          this.viewUser["image"] = `/uploads/${response.data.user.image}`;
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
          "user edited successfuly"
        );
        this.getUsers();
        setTimeout(() => {
          this.editUser_loading = true;
        }, 500);
      } else {
        this.edit_dialog = false;
        setTimeout(() => {
          this.editUser_loading = true;
        }, 500);
      }
    }
  }
};
</script>

<style>
.user-table {
  margin-top: 0px;
}
</style>