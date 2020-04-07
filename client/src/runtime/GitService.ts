export class GitService implements IGitService {
	private readonly token: string;
	private readonly repoName: string;
	private readonly repoOwner: string;

	constructor(token: string) {
		this.token = token;
		this.repoName = "Onix-Front-End";
		this.repoOwner = "toliankir";
	}

    private async makeRequest(method: string, apiUrl: string, body: any = {}): Promise<any> {
        const response = await fetch(apiUrl, {
            method,
            headers: {
				'Authorization': `token ${this.token}`,
            },
            body: (method === 'GET' || method === 'HEAD') ? null : JSON.stringify ({ body }),
        });
        return await response.json();;
    }


	public async getIssues(): Promise<IGitIssue[]> {
		const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/issues`;
		const response =  await this.makeRequest('GET', url);

		return response.map((repsonseIssue: any): IGitIssue => ({
			id: repsonseIssue.id,
			number: repsonseIssue.number,
			comments_url: repsonseIssue.comments_url,
			title: repsonseIssue.title,
			body: this.convertGitContentToHtml(repsonseIssue.body),
			user: {
				login: repsonseIssue.user.login,
				id: repsonseIssue.user.id,
				avatar_url: repsonseIssue.user.avatar_url,
			}}));
	}

	public async getIssueComments(issue: IGitIssue): Promise<IGitComment[]> {
		const comments = await this.makeRequest('GET', issue.comments_url, {});
		return comments.map((comment: any): IGitComment => ({
			id: comment.id,
			body: comment.body,
			user: {
				id: comment.user.id,
				login: comment.user.loigin,
				avatar_url: comment.user.avatar_url,
			}
		}));
	}
	
	public addComment(issue: IGitIssue, comment: string): Promise<void> {
        return this.makeRequest('POST', issue.comments_url, comment); 
	}
	
	public async getCommentReactions(commentId: number): Promise<any> {
		const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/pulls/comments/${commentId}/reactions`;
        const commentReactions = await this.makeRequest('GET', url, {});
        return commentReactions;
	}

	private convertGitContentToHtml(content: string):string {
		let result: string = content.replace(/\!\[image\]\((.*?)\)/g, '<img src="$1">');
		result = result.replace(/\[([^x]+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
		return result;
	}
}
