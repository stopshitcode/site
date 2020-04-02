<script lang="js">
  const a = "Svelte";
  const b = "Typescript";
  const c = "Webpack";

  function postCommentSubmit() {
    const userProfile = window.document.userProfile;
    if (userProfile !== null) {
      alert("postCommentSubmit as " + userProfile.email);
    } else {
      alert("postCommentSubmit as anonymous");
    }
  }
</script>

<style lang="scss">
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

<form on:submit|preventDefault={postCommentSubmit}>
  <textarea name="comments" cols="30" rows="5" class="html-text-box">
    {a} + {b} + {c}
  </textarea>
  <br />
  <input type="submit" value="Post" class="html-text-box" />
</form>
