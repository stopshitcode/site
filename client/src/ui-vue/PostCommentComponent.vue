<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      commentBody: "VueJS + Typescript + Webpack"
    };
  },
  methods: {
    postCommentSubmit() {
      const userProfile = window.document.userProfile;
      if (userProfile !== null && !(userProfile instanceof Promise)) {
        alert("postCommentSubmit as " + userProfile.email);
      } else {
        alert("postCommentSubmit as anonymous");
      }
    }
  }
});
</script>

<style>
textarea.html-text-box {
  background-color: #ffffff;
  background-image: url(http://);
  background-repeat: no-repeat;
  background-attachment: fixed;
  border-width: 1;
  border-style: solid;
  border-color: #cccccc;
  font-family: Verdana;
  font-size: 14pt;
  color: #000000;
}
input.html-text-box {
  background-color: #ffffff;
  font-family: Verdana;
  font-size: 14pt;
  color: #000000;
}
</style>

<template>
  <form v-on:submit.prevent="postCommentSubmit">
    <textarea name="comments" cols="30" rows="5" class="html-text-box" v-model="commentBody"></textarea>
    <br />
    <input type="submit" value="Post" class="html-text-box" />
  </form>
</template>
