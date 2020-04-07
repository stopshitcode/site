<template>
	<div>
		<img :src="user.avatar_url" />
		<p>{{user.login}}</p>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class UserProfileComponent extends Vue{
	@Prop() user!: IGitUser;
}
</script>

<style scoped>
div {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-right: 10px;
	min-width: 60px;
}
p {
	font-size: 12px;
	font-weight: bold;
	color: #83827e;
}
img {
	border-radius: 50%;
	width: 50px;
}
</style>
