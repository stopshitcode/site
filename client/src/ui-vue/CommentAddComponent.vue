<template>
	<div>
		<form>
			<textarea v-model="comment"></textarea>
			<div class="btn-bar">
				<button type="Submit" @click.prevent="sendComment">Send</button>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop} from "vue-property-decorator";

@Component({})
export default class CommentAddComponenet extends Vue{
	@Prop() issue!: any;

	comment: string = "";

	async sendComment(ev: any) {
		if (!window.document.gitService) {
			return;
		}
		await window.document.gitService.addComment(this.issue, this.comment);
		this.$parent.$emit("refreshComments");
	}
}
</script>

<style scoped>
div {
	max-width: 90%;
	margin: auto;
}
div.btn-bar {
	margin: unset;
}
form {
	display: flex;
	flex-direction: column;
	margin-top: 10px;
}
</style>
