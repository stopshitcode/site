import Ensure from "@zxteam/ensure";

export class GitService implements IGitService {
	private readonly token: string;
	private readonly repoName: string;
	private readonly repoOwner: string;

	constructor(token: string) {
		this.token = token;
		this.repoName = "Onix-Front-End";
		this.repoOwner = "toliankir";
	}

    private async makeRequest(method: string, apiUrl: string, status?: number, body: any = {}): Promise<any> {
        const response = await fetch(apiUrl, {
            method,
            headers: {
				'Authorization': `token ${this.token}`,
            },
            body: (method === 'GET' || method === 'HEAD') ? null : JSON.stringify ({ body }),
		});
		if (status && status !== response.status) {
			throw Error(`Wrong response status code. Received ${response.status}, waiting for ${response}`);
		}
        return await response.json();;
    }

	private validateUser(user: IGitUser): void {
		Ensure().object(user);
		Ensure().string(user.login);
		Ensure().number(user.id);
		Ensure().string(user.avatar_url);
	}

	public async getIssues(): Promise<IGitIssue[]> {
		const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/issues`;
		const response =  await this.makeRequest('GET', url, 200);
		
		return response.map((responseIssue: any): IGitIssue => {
			Ensure().number(responseIssue.id);
			Ensure().number(responseIssue.number);
			Ensure().string(responseIssue.comments_url);
			Ensure().string(responseIssue.title);
			Ensure().string(responseIssue.body);
			this.validateUser(responseIssue.user);
			
			return {
				id: responseIssue.id,
				number: responseIssue.number,
				comments_url: responseIssue.comments_url,
				title: responseIssue.title,
				body: this.convertGitContentToHtml(responseIssue.body),
				user: {
					login: responseIssue.user.login,
					id: responseIssue.user.id,
					avatar_url: responseIssue.user.avatar_url,
				},
			}
		});
	}

	public async getIssueComments(issue: IGitIssue): Promise<IGitComment[]> {
		const comments = await this.makeRequest('GET', issue.comments_url, 200);
		return comments.map((comment: any): IGitComment => {
			Ensure().number(comment.id);
			Ensure().string(comment.body);
			this.validateUser(comment.user);
			
			return {
				id: comment.id,
				body: comment.body,
				user: {
					id: comment.user.id,
					login: comment.user.login,
					avatar_url: comment.user.avatar_url,
				},
			}
		});
	}
	
	public addComment(issue: IGitIssue, comment: string): Promise<void> {
        return this.makeRequest('POST', issue.comments_url, 201, comment); 
	}
	
	public async getCommentReactions(commentId: number): Promise<any> {
		const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/pulls/comments/${commentId}/reactions`;
        const commentReactions = await this.makeRequest('GET', url);
        return commentReactions;
	}

	private convertGitContentToHtml(content: string):string {
		let result: string = content.replace(/\!\[image\]\((.*?)\)/g, '<img  src="$1">');
		result = result.replace(/\[([^x]+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
		return result;
	}
}
