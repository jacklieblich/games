To run locally:
Must have Postgres installed.
$ git clone https://github.com/jacklieblich/games.git
$ bundle && cd client && npm i && cd ..
$ rake db:create db:migrate
$ rake start
App will be served at http://localhost:3000
