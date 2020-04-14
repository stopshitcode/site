<script lang="js">
  export let comment = {};
</script>

<div class="comment-wrapper">
	<div class="comment-control">
		<span>Delete</span>
	</div>
	<p>{comment.body}</p>
</div>

<style>
p {
	font-size: 12px;
	overflow-wrap: break-word;
}
.comment-wrapper {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 100%;
}
.comment-control {
	text-align: right;
	font-weight: bold;
	font-size: 12px;
}
</style>
