<template>
	<div>
		<form v-on:submit.prevent="postCommentSubmit">
			<h1>TEST </h1>
			<textarea name="comments" cols="30" rows="5" class="html-text-box" v-model="commentBody"></textarea>
			<br />
			<input type="submit" value="Post" class="html-text-box" />
		</form>
		<IssueComponent v-for="issue of issues"
		:issue="issue"
		:key="issue.id" />
	</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import IssueComponent from "./IssueComponent.vue";

@Component({
	components: {
		IssueComponent,
	}
})
export default class PostComment extends Vue{
	commentBody: string =  "VueJS + Typescript + Webpack";

	issues: IGitIssue[] = [];

	postCommentSubmit() {
      const userProfile = window.document.userProfile;
      if (userProfile !== null && !(userProfile instanceof Promise)) {
        alert("postCommentSubmit as " + userProfile.email);
      } else {
        alert("postCommentSubmit as anonymous");
      }
	}
	
	private async getIssues(): Promise<void> {
		if (!window.document.gitService) {
			return;
		}
		this.issues = await window.document.gitService.getIssues();
	}

	created() {
		this.getIssues();
	}
}
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
