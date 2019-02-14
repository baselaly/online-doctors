<template>
  <v-container>
    <v-layout row wrap>
      <v-flex lg10 category-table>
        <v-card>
          <v-card-title>
            <v-chip color="white" large text-color="black">Categories</v-chip>
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
            :items="categories"
            :search="search"
            dark
            :loading="loading"
            hide-actions
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{ props.item.name }}</td>
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
            <v-alert
              slot="no-results"
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </v-data-table>
        </v-card>
        <div xs8 class="text-xs-center" v-if="pagination">
          <v-pagination
            color="indigo"
            @input="categoriesPagination"
            :length="pagination_length"
            v-model="page"
          ></v-pagination>
        </div>
      </v-flex>
    </v-layout>
    <v-snackbar right bottom v-model="snackbar" :color="snackbarColor">{{snackbarMessage}}</v-snackbar>
    <add-category :dialog="add_dialog" @close-add-dialog="close_add_dialog"></add-category>
    <view-category
      :dialog="view_dialog"
      :loading="viewCategory_loading"
      :category="viewCategory"
      @close-view-dialog="close_view_dialog"
    ></view-category>
    <delete-category
      :dialog="delete_dialog"
      :categoryId="deleted_category_id"
      @failed-delete-category="showFailedDeleteCategory"
      @close-delete-dialog="close_delete_dialog"
    ></delete-category>
    <editCategory
      :dialog="edit_dialog"
      :category="viewCategory"
      :loading="editCategory_loading"
      @close-edit-dialog="close_edit_dialog"
    ></editCategory>
  </v-container>
</template>

<script>
import addCategory from "./category_dialogs/addCategory";
import viewCategory from "./category_dialogs/viewCategory";
import deleteCategory from "./category_dialogs/deleteCategory";
import editCategory from "./category_dialogs/editCategory";
export default {
  components: {
    addCategory,
    viewCategory,
    deleteCategory,
    editCategory
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
      categories: [],
      search: "",
      headers: [
        { text: "name", value: "name" },
        { text: "actions", value: "" }
      ],
      loading: true,
      defaultCategory: {
        name: ""
      },
      // add category
      add_dialog: false,
      //view category
      view_dialog: false,
      viewCategory: {
        name: ""
      },
      viewCategory_loading: true,
      //delete category
      delete_dialog: false,
      deleted_category_id: "",
      //edit category
      edit_dialog: false,
      editCategory_loading: true
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    getCategories() {
      var token = localStorage.getItem("token");
      axios
        .get("/api/admin/category/getAll", {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          var response = response.data.categories;
          this.categories = response.data;
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
    categoriesPagination() {
      this.loading = true;
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/category/getAll?page=${this.page}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          var response = response.data.categories;
          this.categories = response.data;
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
          "category added successfuly"
        );
        this.getCategories();
      }
    },
    //view dialog
    show_view_dialog(category_id) {
      this.view_dialog = true;
      setTimeout(() => {
        this.viewCategory_loading = false;
      }, 1000);
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/category/getById/${category_id}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.viewCategory = response.data.category;
        })
        .catch(error => {
          console.log(error);
        });
    },
    close_view_dialog() {
      this.view_dialog = false;
      setTimeout(() => {
        this.viewCategory_loading = true;
        this.viewCategory = this.defaultCategory;
      }, 500);
    },
    //delete dialog
    show_delete_dialog(id) {
      this.deleted_category_id = id;
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
          "category deleted successfuly"
        );
        this.getCategories();
      }
    },
    showFailedDeleteCategory(state) {
      if (state == true) {
        this.activateSnackbar(
          true,
          "red",
          "there is doctor(s) in that section"
        );
      } else if (state == false) {
        this.activateSnackbar(true, "red", "something went wrong");
      }
    },
    //edit dialog
    show_edit_dialog(category_id) {
      this.edit_dialog = true;
      setTimeout(() => {
        this.editCategory_loading = false;
      }, 1000);
      var token = localStorage.getItem("token");
      axios
        .get(`/api/admin/category/getById/${category_id}`, {
          headers: { Authorization: "Bearer " + token }
        })
        .then(response => {
          this.viewCategory = response.data.category;
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
          "category edited successfuly"
        );
        this.getCategories();
        setTimeout(() => {
          this.editCategory_loading = true;
        }, 500);
      } else {
        this.edit_dialog = false;
        setTimeout(() => {
          this.editCategory_loading = true;
        }, 500);
      }
    }
  }
};
</script>

<style>
.category-table {
  margin-top: 0px;
}
</style>