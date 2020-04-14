<script lang="js">
  export let issue = {};
  export let getComments;

  let comment = "";

  async function addComment() {
    if (!window.document.gitService) {
      return;
    }
    await window.document.gitService.addComment(issue, comment);
    getComments();
  }
</script>

<div>
  <form on:submit|preventDefault={addComment}>
    <textarea bind:value={comment} />
    <button type="submit">Add comment</button>
  </form>
</div>
