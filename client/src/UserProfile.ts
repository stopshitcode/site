import { CancellationToken } from "@zxteam/contract";
import { InvalidOperationError, ArgumentError } from "@zxteam/errors";

// See about lodash in a Webpack, TypeScript project
// https://stackoverflow.com/questions/49036745/not-able-to-tree-shake-lodash-in-a-webpack-typescript-project
import isString from "lodash/isString";
import { stringify } from "querystring";


export interface UserProfile {
	// TODO something
	//likeSCC()
	//dislikeSCC()
}

export namespace UserProfile {
	export async function authorize(cancellationToken: CancellationToken): Promise<UserProfile> {
		//
		cancellationToken.throwIfCancellationRequested();

		const savedProfileData: string | null = window.localStorage.getItem(USER_PROFILE_DATA_KEY);
		if (savedProfileData !== null) {
			// Already authorized
			const userProfileDataModel: UserProfileDataModel = UserProfileDataModel.parse(savedProfileData);

			if (Date.now() > userProfileDataModel.expirationDate.getTime()) {
				throw new ExpiredUserProfileError();
			}

			return new UserProfileImpl(userProfileDataModel.token);
		}


		// No savedProfileData, so make new authorization

		throw new InvalidOperationError("Not implemented yet");
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
		private readonly _gitlabToken: string;

		public constructor(gitlabToken: string) {
			this._gitlabToken = gitlabToken;
		}
	}

	class BrokenUserProfileDataModelError extends ArgumentError { }
	class ExpiredUserProfileError extends Error { }
}
