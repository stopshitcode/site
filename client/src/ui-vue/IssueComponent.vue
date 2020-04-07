<template>
	<div>
		<div class="issue">
			<UserProfile :user="issue.user"/>
			<div>
				<p class="title">{{issue.title}}</p>
				<p class="body" v-html="issue.body"></p>
			</div>
		</div>
		<div class=comments>
			<IssueComment
				v-for="comment of comments"
				:comment="comment"
				:key="comment.id" />
			<CommentAdd
				:issue="issue"
				@refreshComments="this.getComments"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import IssueComment from "./IssueCommentComponent.vue";
import UserProfile from "./UserProfileComponent.vue";
import CommentAdd from "./CommentAddComponent.vue";

@Component({
	components: {
		IssueComment,
		UserProfile,
		CommentAdd,
	}
})
export default class IssueComponent extends Vue{
	@Prop() issue!: IGitIssue;

	private comments: IGitComment[] = [];

	private async getComments(): Promise<void> {
		if (!window.document.gitService) {
			return;
		}
		this.comments = await window.document.gitService.getIssueComments(this.issue);
	}

	created() {
		this.getComments();	
	}
}
</script>

<style>
	div {
		margin-bottom: 10px;
	}
	div.issue {
		padding: 10px;
		border-radius: 10px;
		background-color: #e5eaee;
		display: flex;
	}
	p.title  {
		margin: 0;
		font-weight: bold;
		font-size: 16px;
		line-height: 50px;
	}
	p.body {
		margin-right: 10px;
		font-size: 12px;
		text-align: justify;
	}
	p.body img {
		display: block;
	}
	.comments {
		margin: 10px 0 0 60px;
		padding: 10px;
		border-radius: 10px;
		background-color: #b9c7ca;
	}
</style>
