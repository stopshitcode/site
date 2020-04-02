import Vue from "vue";

import PostCommentComponent from "./ui-vue/PostCommentComponent.vue";

let _gVue: Vue;

window.document.startUI = function () {
	const uiTarget: HTMLElement | null = document.getElementById("ui-target");
	if (uiTarget === null) {
		alert("ERROR: Page does not provide 'ui-target' element.");
	} else {
		_gVue = new Vue({
			el: uiTarget,
			template: `<div>
				<post-comment-component />
			</div>`,
			data: { name: "World" },
			components: {
				PostCommentComponent
			}
		});
	}
};

alert("UI Vue.JS was loaded");
