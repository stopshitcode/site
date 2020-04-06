<template>
	<div>
		<div class="comment">
			<UserProfile :user="comment.user"/>
			<p>{{comment.body}}</p>
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
	@Prop() comment!: any;
}
</script>

<style scoped>
div.comment {
	display: flex;
}

p {
	flex-grow: 1;
	font-size: 12px;
	overflow-wrap: break-word;
    max-width: calc(100% - 70px);
	text-align: justify;
}
</style>
