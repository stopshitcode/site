<script lang="js">
  import Comment from "./CommentComponent.svelte";
  import User from "./UserComponent.svelte"
  import AddComment from "./CommentAddComponent.svelte"

  export let issue = {};
  let comments = [];

  async function getComments() {
	  if (!window.document.gitService) {
	  return;
	}
    comments = await window.document.gitService.getIssueComments(issue);
  }

  getComments();
</script>

<div class="comment-wrapper">
	{#each comments as comment (comment.id)}
	<div class="comment">
		<User user={comment.user} />
		<div>
			<Comment {comment} />
		</div>
	</div>
	{/each}
	<AddComment {issue} {getComments} />
</div>

<style>
.comment-wrapper {
	background-color: #e9e9e9;
	margin-left: 60px;
	padding: 10px;
	border-radius: 10px;
}
.comment {
	display: flex;
}
</style>
