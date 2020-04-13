<script lang="js">

  export let issue = {};
  let comment = "";

  async function addComment() {
	if (!window.document.gitService) {
	  return;
	}
	await window.document.gitService.addComment(issue, comment);
  }

</script>

<div>
<form on:submit|preventDefault={addComment}>
	<textarea bind:value={comment}></textarea>
	<button type="submit">Add comment</button>
</form>
</div>
