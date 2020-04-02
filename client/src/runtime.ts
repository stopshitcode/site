import { CancellationTokenSource, ManualCancellationTokenSource } from "@zxteam/cancellation";
import { wrapErrorIfNeeded } from "@zxteam/errors";

// See about lodash in a Webpack, TypeScript project
// https://stackoverflow.com/questions/49036745/not-able-to-tree-shake-lodash-in-a-webpack-typescript-project
import filter from "lodash/filter";

import { UserProfile } from "./runtime/UserProfile";

let _gLoginButton: HTMLButtonElement;

console.log("Hello, World1");
console.log("Hello, World2");
console.log(filter("Hello, World", w => w !== "o").join());

window.addEventListener("load", function () {
	let uiLibraryFile: string;
	if (window.location.hash === "#svelte") {
		console.log("Loading Svelte UI library");
		uiLibraryFile = "ui-svelte.js";
		window.location.hash = "";
	} else {
		console.log("Loading Vue.JS UI library");
		uiLibraryFile = "ui-vue.js";
	}

	{ // Dynamically load UI implementation
		const uiScript = document.createElement("script");
		uiScript.onload = function () {
			//do stuff with the script
			console.log(`File ${uiScript.src} was loaded`);
			document.startUI();
		};
		uiScript.src = `./js/${uiLibraryFile}`;
		document.body.appendChild(uiScript);
	}



	{
		const doLoginButtonId: string = "btn_do_login";
		const loginButton: HTMLElement | null = document.getElementById(doLoginButtonId);
		if (loginButton !== null && loginButton instanceof HTMLButtonElement) {
			_gLoginButton = loginButton;
		} else {
			const errMsg: string = `Cannot found login button with id '${doLoginButtonId}' or wrong HTML element type (expected button)`;
			console.error(errMsg);
			alert(`ERROR: ${errMsg}`);
			return;
		}
	}

	_gLoginButton.onclick = onLoginButtonClick;

	document.userProfile = UserProfile.findInStorage();

	if (document.userProfile !== null) {
		_gLoginButton.disabled = true;
		_gLoginButton.innerText = `Authorized as ${document.userProfile.email}`;
	}
});


/**
 * Handler for click on Login Button
 * [!] Should be exception safe
 */
async function onLoginButtonClick() {
	const cts: CancellationTokenSource = new ManualCancellationTokenSource();

	const backupButtonText = _gLoginButton.innerText;
	_gLoginButton.innerText = "Cancel auth...";
	_gLoginButton.onclick = function () { cts.cancel(); }; // Setup cancel handler
	try {
		document.userProfile = UserProfile.authorize(cts.token); // Set Promise to _gCurrentUserProfile as marker: Authorizing...
		document.userProfile = await document.userProfile; // After authorization done, set UserProfile
		alert("You have beed successfully authorized as " + document.userProfile.email);
	} catch (e) {
		document.userProfile = null;
		console.error(e);
		alert("Failed to authorize. See console for details. Error class: " + (e).constructor.name);
	} finally {
		_gLoginButton.onclick = onLoginButtonClick; // Restore original
		_gLoginButton.innerText = backupButtonText;
	}
}
