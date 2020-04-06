export class GitService implements GitService {
	private readonly token: string;
	private readonly repoName: string;
	private readonly repoOwner: string;

	constructor(token: string) {
		this.token = token;
		this.repoName = "Onix-Front-End";
		this.repoOwner = "toliankir";
	}

    private async makeRequest(method: string, apiUrl: string, body: any = {}){
        const response = await fetch(apiUrl, {
            method,
            headers: {
               'Authorization': `token ${this.token}`,
            },
            body: (method === 'GET' || method === 'HEAD') ? null : JSON.stringify ({ body }),
        });
        return await response.json();;
    }


	public async getIssues(): Promise<[]> {
		const url = `https://api.github.com/repos/${this.repoOwner}/${this.repoName}/issues`;
        return await this.makeRequest('GET', url);
	}

	public async getIssueComments(issue: any): Promise<[]> {
        const url = issue.comments_url;
        const issueComments = await this.makeRequest('GET', url, {});
        return issueComments;
	}
	
	public async addComment(issue: any, comment: string): Promise<void> {
        const url = issue.comments_url;
        await this.makeRequest('POST', url, comment); 
    }
}
