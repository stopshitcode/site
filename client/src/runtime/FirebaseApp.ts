import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/auth";

import { AuthFailedError } from "./Errors";
import { wrapErrorIfNeeded } from "@zxteam/errors";

/**
 * Singleton
 */
export class FirebaseApp {
	private static _instance: FirebaseApp | Promise<FirebaseApp> | null = null;
	private readonly _app: firebase.app.App;
	private readonly _analytics: firebase.analytics.Analytics;

	public static getInstance(): Promise<FirebaseApp> {
		if (FirebaseApp._instance === null) {
			FirebaseApp._instance = (async function () {
				const instance = new FirebaseApp();

				return instance;
			})();

			return FirebaseApp._instance;
		}

		return Promise.resolve(FirebaseApp._instance);
	}

	public async authorizeViaGitHub(): Promise<{
		readonly token: string;
		readonly email: string;
	}> {
		const provider = new firebase.auth.GithubAuthProvider();
		provider.addScope('repo');
		
		try {
			const result: firebase.auth.UserCredential = await firebase.auth().signInWithPopup(provider);
			const firebaseAuth = firebase.auth;
			console.log(firebaseAuth);

			const credential: firebase.auth.AuthCredential | firebase.auth.OAuthCredential | null = result.credential;
			const user: firebase.User | null = result.user;

			if (credential === null) {
				throw new AuthFailedError("No credential");
			}
			if (user === null) {
				throw new AuthFailedError("No user");
			}
			if (!("accessToken" in credential)) {
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

			return Object.freeze({ email, token });
		} catch (error) {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			const email = error.email;
			const credential = error.credential;
			throw new AuthFailedError(errorMessage, wrapErrorIfNeeded(error));
		}
	}

	private constructor() {
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
		this._app = firebase.initializeApp(firebaseConfig);
		this._analytics = firebase.analytics();
	}
}
