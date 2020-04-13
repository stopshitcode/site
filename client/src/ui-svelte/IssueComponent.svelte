<script lang="js">
	import Comments from "./CommentsComponent.svelte";
	import User from "./UserComponent.svelte"

	export let issue = {};
</script>

<div>
	<div class="issue">
		<User user={issue.user} />
		<div>
			<p class="title">{issue.title}</p>
			<p class="body">{@html issue.body}</p>
		</div>
	</div>
	<Comments {issue} />
</div>

<style>
	.issue {
		display: flex;
	}
	.title {
		font-weight: bold;
	}
	.body {
		font-size: 12px;
	}
	:global(.body img) {
		display: block;
	} 
</style>
