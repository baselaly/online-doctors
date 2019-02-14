<template>
  <v-dialog v-model="dialog" persistent max-width="290px">
    <v-card color="blue lighten-1" style="padding:0px!important">
      <v-btn icon dark @click="closeDialog">
        <v-icon>close</v-icon>
      </v-btn>
      <v-card-text style="padding:0px!important">
        <v-flex xs12 text-xs-center style="padding:0px!important">
          <v-date-picker @change="getDate" :allowed-dates="allowedDates" color="blue lighten-1" :min="today" v-model="appointment_date"></v-date-picker>
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
      appointment_date: null
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false
    },
    today: {
      required: true,
      type: String
    },
    unavailableDates: {
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
      this.$emit("close-date-dialog");
    },
    getDate() {
      setTimeout(() => {
        this.$emit("get-date", this.appointment_date);
        this.appointment_date = null;
      });
    }
  }
};
</script>
<style>
</style>