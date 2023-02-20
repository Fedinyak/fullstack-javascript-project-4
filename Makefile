install:
	npm ci

start:
	npm start

build:
	npm run build

lint:
	npx eslint .

page-loader:
	node bin/page-loader

publish: 
	npm publish --dry-run