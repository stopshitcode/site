<script lang="js">
  export let user = {};
</script>

<div>
	<img src={user.avatar_url} alt="user avatar" />
	<p>{user.login}</p>
</div>

<style>
div {
	min-width: 60px;
	flex-direction: column;
	align-items: center;
	padding-right: 10px;
}
p {
	font-size: 12px;
	font-weight: bold;
}
img {
	border-radius: 50%;
	width: 50px;
}
</style>
