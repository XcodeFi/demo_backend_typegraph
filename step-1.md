## before start 

```bash
npm init -y
```

## step 1
```bash
npm i apollo-server-express express graphql reflect-metadata type-graphql mongoose class-validator
```

* ``Apollo-server-express`` - It handles the Apollo graphql and Express connetion. apollo server connects with express for request handling.
* ``express``- expressjs handles the requests in the server
* ``graphql`` - it is used to handle the graphql schema and resolvers.
* ``type-graphql`` - This library is used to manage all the types in graphql.
* ``mongoose`` - library used to connect with mongodb database
* ``class-validator`` - library used to validate input data schema
## step 2 install typescript 
```bash
npm i --save-dev @types/express @types/graphql @types/node nodemon ts-node ts-node-dev typescript
```

* ``TypeScript`` to compile our code to plain JavaScript
* ``ts-node`` to run our server in development environment
* ``nodemon`` to automatically restart the server whenever we make changes to the code

*** NOTE: The ``reflect-metadata`` package we imported at the top is a helper library that extends the functionality of TypeScript decorators. This package is required to use TypeORM and TypeGraphQL.


## step 3 install paginattion for mongoose
```bash
npm i mongoose-paginate-v2
npm i --save-dev @types/mongoose-paginate-v2
```

## step 4 install jwt
```bash
npm i jsonwebtoken
npm i --save-dev @types/jsonwebtoken
```