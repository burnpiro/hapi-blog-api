# hapi-blog-api

NodeJS blog API Boilerplate based on HapiJS and MongoDB

## How to install?

#### Requirements
npm

bower

gulp (useful)

#### And follow instructions

First you need to clone repo

    git clone https://github.com/burnpiro/hapi-blog-api.git

inside ./hapi-blog-api folder run:

install npm packages

    npm install

if you want do enable autorebuild please run

    gulp develop
  
Now if you change any *.js file inside your app server will restart automatically

## How about structure

All components are in "components" folder. Files names are based on John Papa's (Angular :)) style guide. Main file is server.js

#### Routes
Each component has his own *.routes.js file which contains all routes from this component. All routes are exported to routes.js file from main folder and combined into one array. This array is passed to "route" method in server.js.

#### Config
DB and server config is described inside config.js file. It is imported to server.js

#### Database
As you could figure it out database connection script is in database.js file :)

#### Gulp tasks
If you decide to use Gulp there is gulpfile.js which contains all gulp tasks. Right now only one task is useful (develop).

