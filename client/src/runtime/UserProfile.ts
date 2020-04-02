import { CancellationToken } from "@zxteam/contract";
import { sleep } from "@zxteam/cancellation";
import { ArgumentError, InvalidOperationError } from "@zxteam/errors";

// See about lodash in a Webpack, TypeScript project
// https://stackoverflow.com/questions/49036745/not-able-to-tree-shake-lodash-in-a-webpack-typescript-project
import isString from "lodash/isString";

import { ExpiredUserProfileError } from "./Errors";
import { FirebaseApp } from "./FirebaseApp";

export namespace UserProfile {
	export function findInStorage(): UserProfile | null {
		const savedProfileData: string | null = window.localStorage.getItem(
			UserProfileDataModel.LOCAL_STORAGE_KEY
		);
		if (savedProfileData !== null) {
			// Already authorized
			const userProfileDataModel: UserProfileDataModel = UserProfileDataModel.parse(savedProfileData);

			if (Date.now() > userProfileDataModel.expirationDate.getTime()) {
				window.localStorage.removeItem(UserProfileDataModel.LOCAL_STORAGE_KEY);
			}

			return new UserProfileImpl(userProfileDataModel);
		}

		return null;
	}

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

			const firebaseApp: FirebaseApp = await FirebaseApp.getInstance();

			const { email, token } = await firebaseApp.authorizeViaGitHub();

			// GitLab token never expired. So use 15 days to re-login
			// https://stackoverflow.com/questions/26902600/whats-the-lifetime-of-github-oauth-api-access-token
			const expirationDate = new Date(
				Date.now() + 1296000000 // 1000 * 60 * 60 * 24 * 15 == now + 15 days
			);

			const userProfileDataModel: UserProfileDataModel =
				new UserProfileDataModel({ email, token, expirationDate });

			// Save token to local storage
			window.localStorage.setItem(
				UserProfileDataModel.LOCAL_STORAGE_KEY,
				JSON.stringify(userProfileDataModel.toJSON())
			);

			return new UserProfileImpl(userProfileDataModel);
		}
	}

	export function signOut(): void {
		window.localStorage.removeItem(UserProfileDataModel.LOCAL_STORAGE_KEY);
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
		public get token(): string { return this._model.token; }

		public async createSscComment(sscId: string, text: string): Promise<void> {
			throw new InvalidOperationError("Not implemented yet");
		}

		public async likeSsc(sscId: string): Promise<void> {
			throw new InvalidOperationError("Not implemented yet");
		}

		public async dislikeSsc(sscId: string): Promise<void> {
			throw new InvalidOperationError("Not implemented yet");
		}
	}
}
