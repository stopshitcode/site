<template>
	<div>
		<form>
			<textarea v-model="comment"></textarea>
			<button type="Submit" @click.prevent="sendComment">Send</button>
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
		this.$emit("refreshComments");
	}
}
</script>

<style scoped>

</style>
