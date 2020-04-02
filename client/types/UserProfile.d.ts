interface UserProfile {
	readonly email: string;
	readonly token: string;

	createSscComment(sscId: string, text: string): Promise<void>;
	likeSsc(sscId: string): Promise<void>;
	dislikeSsc(sscId: string): Promise<void>;
}
