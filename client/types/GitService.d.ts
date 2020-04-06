interface GitService {
	getIssues(): Promise<[]>;
	getIssueComments(issue: any): Promise<[]>;
	addComment(issue: any, comment: string): Promise<void>;
}
