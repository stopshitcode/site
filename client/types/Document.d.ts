declare module 'Our UI' {
	global {
		interface Document {
			startUI(): void;
			userProfile: UserProfile | Promise<UserProfile> | null;
			gitService: GitService | null;
		}
	}
}
