<template>
    <v-app>
        <navbar></navbar>
        <div class="holder">
            <router-view></router-view>
        </div>
        <footerbar></footerbar>
    </v-app>
</template>

<script>
import navbar from "./navbar";
import footerbar from "./footer";

export default {
  components: {
    navbar,
    footerbar
  }
};
</script>
<style>
.holder{
    min-height: 100%;
}
</style>