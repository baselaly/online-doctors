<template>
    <v-app dark>
        <sidebar></sidebar>
        <div class="holder">
            <router-view></router-view>
        </div>
    </v-app>
</template>

<script>
import sidebar from "./sidebar";
export default {
  components: {
    sidebar
  }
};
</script>
<style>
    .holder{
        margin-left:250px;
    }
      @media only screen and (max-width : 992px) {
    .holder{
        margin-left: 10px;
        margin-right:10px;
    }
  }
</style>