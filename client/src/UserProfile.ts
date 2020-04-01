import { CancellationToken } from "@zxteam/contract";
import { sleep } from "@zxteam/cancellation";
import { ArgumentError, InnerError, wrapErrorIfNeeded } from "@zxteam/errors";

// See about lodash in a Webpack, TypeScript project
// https://stackoverflow.com/questions/49036745/not-able-to-tree-shake-lodash-in-a-webpack-typescript-project
import isString from "lodash/isString";

import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";


export interface UserProfile {
	readonly email: string;
	// TODO something
	//likeSCC()
	//dislikeSCC()
}

export namespace UserProfile {
	export async function authorize(cancellationToken: CancellationToken): Promise<UserProfile> {
		cancellationToken.throwIfCancellationRequested();

		await sleep(cancellationToken, 3000); // Fake sleep to test cancellation

		const savedProfileData: string | null = window.localStorage.getItem(
			UserProfileDataModel.LOCAL_STORAGE_KEY
		);
		if (savedProfileData !== null) {
			// Already authorized
			const userProfileDataModel: UserProfileDataModel = UserProfileDataModel.parse(savedProfileData);

			if (Date.now() > userProfileDataModel.expirationDate.getTime()) {
				throw new ExpiredUserProfileError();
			}

			return new UserProfileImpl(userProfileDataModel);
		} else {
			const userProfileDataModel: UserProfileDataModel = await authWithFirebase();

			// Save token to local storage
			window.localStorage.setItem(
				UserProfileDataModel.LOCAL_STORAGE_KEY,
				JSON.stringify(userProfileDataModel.toJSON())
			);

			return new UserProfileImpl(userProfileDataModel);
		}
	}


	class UserProfileDataModel {
		public readonly token: string;
		public readonly email: string;
		public readonly expirationDate: Date;

		public static parse(data: string): UserProfileDataModel {
			let probablyData;
			try {
				probablyData = JSON.parse(data);
			} catch (e) {
				throw new ArgumentError("data", "Unparsable User Profile data model", e);
			}

			const email = probablyData.email;
			const token = probablyData.token;
			const expirationDate: Date = new Date(probablyData.expirationDateIso);

			if (!isString(token)) {
				throw new ArgumentError(
					"data",
					`Wrong value '${probablyData.email}' for 'email' parameter. Expected string.`
				);
			}

			if (!isString(token)) {
				throw new ArgumentError(
					"data",
					`Wrong value '${probablyData.token}' for 'token' parameter. Expected string.`
				);
			}

			if (isNaN(expirationDate.getTime())) {
				// https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
				throw new ArgumentError(
					"data",
					`Wrong value '${probablyData.expirationDateIso}' for 'expirationIsoDate' parameter. Expected string with ISO 8601 date.`
				);
			}

			return new UserProfileDataModel({ email, token, expirationDate });
		}

		public constructor(opts: {
			readonly email: string;
			readonly token: string;
			readonly expirationDate: Date
		}) {
			if (isNaN(opts.expirationDate.getTime())) {
				// https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
				throw new ArgumentError(
					"expirationDate",
					`Wrong value '${opts.expirationDate}' for 'expirationDate' parameter. Expected valid Date object.`
				);
			}

			this.token = opts.token;
			this.email = opts.email;
			this.expirationDate = opts.expirationDate;
		}

		public toJSON(): any {
			return Object.freeze({
				email: this.email,
				token: this.token,
				expirationDateIso: this.expirationDate.toISOString()
			});
		}
	}
	namespace UserProfileDataModel {
		export const LOCAL_STORAGE_KEY: string = "profile";
	}


	class UserProfileImpl implements UserProfile {
		private readonly _model: UserProfileDataModel;

		public constructor(model: UserProfileDataModel) {
			this._model = model;
		}

		public get email(): string { return this._model.email; }
	}

	export class AuthFailedError extends InnerError { }
	export class BrokenUserProfileDataModelError extends ArgumentError { }
	export class ExpiredUserProfileError extends Error { }

	async function authWithFirebase(): Promise<UserProfileDataModel> {

		const firebaseConfig = {
			apiKey: "AIzaSyD0VVySWwGLYNONBnQOnbIc1ItemvAAlhY",
			authDomain: "stopshitcode-backend.firebaseapp.com",
			databaseURL: "https://stopshitcode-backend.firebaseio.com",
			projectId: "stopshitcode-backend",
			storageBucket: "stopshitcode-backend.appspot.com",
			messagingSenderId: "373799334125",
			appId: "1:373799334125:web:ee72cb304043fd287e1ce4",
			measurementId: "G-29QRP7NL0F"
		};
		// Initialize Firebase
		firebase.initializeApp(firebaseConfig);
		firebase.analytics();

		const provider = new firebase.auth.GithubAuthProvider();

		try {
			const result: firebase.auth.UserCredential = await firebase.auth().signInWithPopup(provider);

			const credential: firebase.auth.AuthCredential | null = result.credential;
			const user: firebase.User | null = result.user;

			if (credential === null) {
				throw new AuthFailedError("No credential");
			}
			if (user === null) {
				throw new AuthFailedError("No user");
			}
			if (!(credential instanceof firebase.auth.OAuthCredential)) {
				throw new AuthFailedError("Unexpected credential class");
			}
			if (credential.accessToken === undefined) {
				throw new AuthFailedError("accessToken was not provided");
			}

			// This gives you a GitHub Access Token. You can use it to access the GitHub API.
			const token: string = credential.accessToken;
			const email: string | null = user.email;
			if (email === null) {
				throw new AuthFailedError("No email");
			}

			// GitLab token never expired. So use 15 days to re-login
			// https://stackoverflow.com/questions/26902600/whats-the-lifetime-of-github-oauth-api-access-token
			const expirationDate = new Date(
				Date.now() + 1296000000 // 1000 * 60 * 60 * 24 * 15 == now + 15 days
			);

			return new UserProfileDataModel({ email, token, expirationDate });
		} catch (error) {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			const email = error.email;
			const credential = error.credential;
			throw new AuthFailedError(errorMessage, wrapErrorIfNeeded(error));
		}
	}
}
