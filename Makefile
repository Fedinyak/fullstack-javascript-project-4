install:
	npm ci

start:
	npm start

build:
	npm run build

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

page-loader:
	node bin/page-loader

publish: 
	npm publish --dry-run