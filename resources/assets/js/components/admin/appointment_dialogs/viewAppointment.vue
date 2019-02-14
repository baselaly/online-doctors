<template>
  <!--add dialog-->
      <v-dialog v-model="dialog" persistent max-width="400px">
      <v-card v-if="loading" style="padding:50px; text-align:center;">
        <v-progress-circular indeterminate :size="70" :width="7" color="amber"></v-progress-circular>
      </v-card>
      <v-card v-if="!loading">
        <v-layout wrap justify-space-around align-center>
            <v-card-text>
                <v-flex class="textCenter" xs12 title>Date: {{appointment.appointment_date}}</v-flex>
            </v-card-text>
            <v-card-text>
                <v-flex class="textCenter" xs12 title>Time: {{appointment.appointment_time}}</v-flex>
            </v-card-text>
            <v-card-text>
                <v-flex class="textCenter" xs12 title>Duration: 30 mins</v-flex>
            </v-card-text>
            <v-card-text v-if="appointment.status==1">
                <v-flex class="textCenter" xs12 title>Status: <v-icon dark>done</v-icon></v-flex>
            </v-card-text>
            <v-card-text v-if="appointment.status==0">
                <v-flex class="textCenter" xs12 title>Status: <v-icon dark>schedule</v-icon></v-flex>
            </v-card-text>
            <v-card-text>
                <v-flex class="inline-class-style">
                <v-avatar
                size="50"
                class="grey lighten-4"
                >
                <img class="userImage" :src="appointment.patient.image" alt="avatar">
                </v-avatar>
                </v-flex>
                <v-flex class="textCenter inline-class-style" xs12 title>patient: {{appointment.patient.name}}</v-flex>
            </v-card-text>
            <v-card-text>
                <v-flex class="inline-class-style">
                <v-avatar
                size="50"
                class="grey lighten-4"
                >
                <img class="userImage" :src="appointment.doctor.image" alt="avatar">
                </v-avatar>
                </v-flex>
                <v-flex class="textCenter inline-class-style" xs12 title>doctor: {{appointment.doctor.name}}</v-flex>
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
    appointment: {
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
.userImage {
  border: 3px solid white;
}
.inline-class-style {
  display: inline;
  margin: 5px 10px;
}
</style>