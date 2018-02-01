Quick and dirty:

* requirements: node 8.6.0, yarn 1.2.1

* install deps with `yarn install`

* copy the .env.example to .env.development.local and fill the correct values

* for production, values in .env.production take precedence; to override for local use .env.production.local

* run the app with `yarn run`

* build for prod with `yarn build`
