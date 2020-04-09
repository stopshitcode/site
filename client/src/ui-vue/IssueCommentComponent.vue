<template>
	<div>
		<div class="comment">
			<UserProfile :user="comment.user"/>
			<div class="commet-body">
				<div class="comment-control">
					<span @click="removeComment">Delete comment</span>
				</div>
				<p v-html="comment.body"></p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import UserProfile from "./UserProfileComponent.vue";

@Component({
	components: {
		UserProfile,
	}
})
export default class IssueCommentComponent extends Vue{
	@Prop() comment!: IGitComment;

	async removeComment() {
		if (!window.document.gitService) {
			return;
		}
		await window.document.gitService.removeComment(this.comment);
		console.log("delete");
		this.$parent.$emit("refreshComments");
	}
}
</script>

<style scoped>
div.comment {
	width: 100%;
	max-width: 100%;
	display: flex;
}

.comment-control {
	text-align: right;
	font-weight: bold;
	font-size: 13px;
	padding-right: 20px;
}
.comment-control span {
	cursor: pointer;
}
.commet-body {
	width: 100%;
}
.commet-body p {
	flex-grow: 1;
	font-size: 12px;
	overflow-wrap: break-word;
	text-align: justify;
	margin-right: 10px;
}

</style>
