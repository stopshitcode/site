## SSC (Stop Shit Code) Site 

https://stopshitcode.org


The SSC site is open source, found a bug, an issue, or a typo in our docs? Please report using an issue or submit a pull request.

Thanks!


## Building

If you want to submit a PR or test a change to fix a link, etc it may be helpful for you to build and run locally.

This project is built using [Jekyll](https://jekyllrb.com/)

1. Build the site and make it available on a local server inside [Docker](https://www.docker.com/)
	```bash
	docker run --rm --volume="$PWD/docs:/srv/jekyll" --volume="$PWD/.vendor/bundle:/usr/local/bundle" --publish 4000:4000 --interactive --tty jekyll/builder:4.0.0 bundle exec jekyll serve --host 0.0.0.0
	```
1. Browse to http://localhost:4000
