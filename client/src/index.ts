import { CancellationTokenSource, ManualCancellationTokenSource } from "@zxteam/cancellation";
import { wrapErrorIfNeeded } from "@zxteam/errors";

// See about lodash in a Webpack, TypeScript project
// https://stackoverflow.com/questions/49036745/not-able-to-tree-shake-lodash-in-a-webpack-typescript-project
import filter from "lodash/filter";

import { UserProfile } from "./UserProfile";

let _gCurrentUserProfile: UserProfile | Promise<UserProfile> | null = null;
let _gLoginButton: HTMLButtonElement;

console.log("Hello, World1");
console.log("Hello, World2");
console.log(filter("Hello, World", w => w !== "o").join());

window.onload = () => {
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

	_gCurrentUserProfile = UserProfile.findInStorage();

	if (_gCurrentUserProfile !== null) {
		_gLoginButton.disabled = true;
		_gLoginButton.innerText = `Authorized as ${_gCurrentUserProfile.email}`;
	}
};


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
		_gCurrentUserProfile = UserProfile.authorize(cts.token); // Set Promise to _gCurrentUserProfile as marker: Authorizing...
		_gCurrentUserProfile = await _gCurrentUserProfile; // After authorization done, set UserProfile
		alert("You have beed successfully authorized as " + _gCurrentUserProfile.email);
	} catch (e) {
		_gCurrentUserProfile = null;
		console.error(e);
		alert("Failed to authorize. See console for details. Error class: " + (e).constructor.name);
	} finally {
		_gLoginButton.onclick = onLoginButtonClick; // Restore original
		_gLoginButton.innerText = backupButtonText;
	}
}
