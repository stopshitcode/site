<template>
	<div>
		<div class="comment">
			<UserProfile :user="comment.user"/>
			<p v-html="comment.body"></p>
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
}
</script>

<style scoped>
div.comment {
	display: flex;
}

div.comment p {
	flex-grow: 1;
	font-size: 12px;
	overflow-wrap: break-word;
    max-width: calc(100% - 80px);
	text-align: justify;
}

</style>
