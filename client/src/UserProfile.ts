import { CancellationToken } from "@zxteam/contract";
import { InvalidOperationError, ArgumentError } from "@zxteam/errors";

// See about lodash in a Webpack, TypeScript project
// https://stackoverflow.com/questions/49036745/not-able-to-tree-shake-lodash-in-a-webpack-typescript-project
import isString from "lodash/isString";
import { stringify } from "querystring";

const firebase = require("firebase");

export interface UserProfile {
	// TODO something
	//likeSCC()
	//dislikeSCC()
}

export namespace UserProfile {
	export async function authorize(cancellationToken: CancellationToken): Promise<UserProfile> {
		// how send cancellation token with browser button?
		// cancellationToken.throwIfCancellationRequested();

		const savedProfileData: string | null = window.localStorage.getItem(USER_PROFILE_DATA_KEY);
		if (savedProfileData !== null) {
			// Already authorized
			const userProfileDataModel: UserProfileDataModel = UserProfileDataModel.parse(savedProfileData);

			if (Date.now() > userProfileDataModel.expirationDate.getTime()) {
				throw new ExpiredUserProfileError();
			}

			return new UserProfileImpl(userProfileDataModel.token);
		}

		const credentials = await authWithFirebase();

		// Save token to local storage
		window.localStorage.setItem(USER_PROFILE_DATA_KEY, JSON.stringify(credentials));

		return new UserProfileImpl(credentials.token);
	}


	const USER_PROFILE_DATA_KEY: string = "profile";

	class UserProfileDataModel {
		public readonly token: string;
		public readonly expirationDate: Date;

		public static parse(data: string): UserProfileDataModel {
			let probablyData;
			try {
				probablyData = JSON.parse(data);
			} catch (e) {
				throw new ArgumentError("data", "Unparsable User Profile data model", e);
			}

			const token = probablyData.token;
			const expirationDate: Date = new Date(probablyData.expirationDateIso);

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

			return new UserProfileDataModel(token, expirationDate);
		}

		public toString(): string {
			return JSON.stringify({
				token: this.token,
				expirationDateIso: this.expirationDate.toISOString()
			});
		}

		private constructor(token: string, expirationDate: Date) {
			this.token = token;
			this.expirationDate = expirationDate;
		}
	}


	class UserProfileImpl implements UserProfile {
		private readonly _gitLabToken: string;

		public constructor(gitLabToken: string) {
			this._gitLabToken = gitLabToken;
		}
	}

	class BrokenUserProfileDataModelError extends ArgumentError { }
	class ExpiredUserProfileError extends Error { }

	export async function authWithFirebase(): Promise<{ token: string, expirationDateIso: Date }> {

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

		return new Promise((resolve, reject) => {

			firebase.auth().signInWithPopup(provider).then((result: any) => {
				// This gives you a GitHub Access Token. You can use it to access the GitHub API.
				const token: string = result.credential.accessToken;
				const creationTime = result.user.metadata.creationTime;

				// https://stackoverflow.com/questions/26902600/whats-the-lifetime-of-github-oauth-api-access-token
				const expirationDateIso = new Date("2024-10-10");
				return resolve({ token, expirationDateIso });

			}).catch((error: any) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.email;
				const credential = error.credential;
				return reject(error);
			});
		});
	}
}
