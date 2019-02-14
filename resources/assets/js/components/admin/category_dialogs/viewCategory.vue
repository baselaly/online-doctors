<template>
  <!--add dialog-->
      <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card v-if="loading" style="padding:50px; text-align:center;">
        <v-progress-circular indeterminate :size="70" :width="7" color="amber"></v-progress-circular>
      </v-card>
      <v-card v-if="!loading">
        <v-layout wrap justify-space-around align-center>
            <v-card-title style="text-align:center;">
            </v-card-title>
            <v-card-text>
                <v-flex class="textCenter" xs12 title>{{category.name}}</v-flex>
            </v-card-text>
            <v-card-text>
                <v-flex class="textCenter" xs12 title>{{category.doctors_count}} doctor(s) are in this section</v-flex>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" @click="closeDialog">Close</v-btn>
            </v-card-actions>
        </v-layout>
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
    category: {
      required: true,
      type: Object
    },
    loading: {
      required: true,
      type: Boolean,
      default: true
    }
  },
  created() {},
  methods: {
    closeDialog() {
      this.$emit("close-view-dialog");
    }
  }
};
</script>
<style>
.textCenter {
  text-align: center !important;
  color: rgb(212, 212, 212);
}
</style>