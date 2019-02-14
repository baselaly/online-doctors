<template>
  <v-dialog v-model="dialog" persistent max-width="290px">
    <v-card color="blue lighten-1" style="padding:0px!important">
      <v-btn icon dark @click="closeDialog">
        <v-icon>close</v-icon>
      </v-btn>
      <v-card-text style="padding:0px!important">
        <v-flex xs12 text-xs-center style="padding:0px!important">
          <v-time-picker @change="getTime" :allowed-minutes="allowedMinutes" :allowed-hours="allowedHours" min="12:00" max="23:00" format="24hr" color="blue lighten-1" v-model="appointment_time"></v-time-picker>
        </v-flex>
      </v-card-text>
      <div style="flex: 1 1 auto;"></div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      requiredRules: [v => !!v || "this field is required"],
      appointment_time: null
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    unavailableHours: {
      required: true,
      type: Array
    }
  },
  created() {},
  methods: {
    allowedDates(v) {
      if (this.unavailableDates.length != 0) {
        return !this.unavailableDates.includes(v);
      } else {
        return true;
      }
    },
    closeDialog() {
      this.$emit("close-time-dialog");
    },
    allowedMinutes(v) {
      if (v == 0 || v == 30) {
        return true;
      } else {
        return false;
      }
    },
    allowedHours(v) {
      if (this.unavailableHours.length != 0) {
        return !this.unavailableHours.includes(v);
      } else {
        return true;
      }
    },
    getTime() {
      setTimeout(() => {
        this.$emit("get-time", this.appointment_time);
        this.appointment_time = null;
      });
    }
  }
};
</script>
<style>
</style>