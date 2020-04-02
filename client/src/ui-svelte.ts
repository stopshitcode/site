import PostCommentComponent from "./ui-svelte/PostCommentComponent.svelte";

let _gComment;

window.document.startUI = function () {
	const uiTarget: HTMLElement | null = document.getElementById("ui-target");
	if (uiTarget === null) {
		alert("ERROR: Page does not provide 'ui-target' element.");
	} else {
		_gComment = new PostCommentComponent({ target: uiTarget });
	}
};


alert("UI Svelte was loaded");
