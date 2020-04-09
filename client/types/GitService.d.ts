interface IGitUser {
	id: number;
	login: string;
	avatar_url: string;
}

interface IGitIssue {
	id: number;
	number: number;
	comments_url: string;
	title: string;
	body: string;
	user: IGitUser;
	comments: number;
}

interface IGitComment {
	id: number;
	body: string;
	user: IGitUser;
	url: string;
}

interface IGitService {
	getIssues(): Promise<IGitIssue[]>;
	getIssueComments(issue: IGitIssue): Promise<IGitComment[]>;
	getCommentReactions(commentId: number): Promise<any>;
	addComment(issue: IGitIssue, comment: string): Promise<void>;
	removeComment(comment: IGitComment): Promise<void>;
}
