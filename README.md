<div align="center">
<a href="https://github.com/Traversal-Labs/starfleet">
  <img width="300" height="300" src="https://i.ibb.co/VMZPT5B/starfleet.jpg">
</a>
</div>

# Starfleet

[![Package on npm](https://img.shields.io/npm/v/postgraphile.svg?style=flat)](https://www.npmjs.com/)

_**With one command, enable your MongoDB project to utilize the high-performance GraphQL API!**_
_**Interested in trying out GraphQL? Quickly convert all your mongoose schemas to viewable and editable GraphQL pieces.**_

**Starfleet** is a command line tool that lets you easily harness the flexibility of MongoDB with the declarative power of GraphQL.

[**GraphQL**](https://graphql.org/) is a popular and rapidly growing data query and manipulation language for APIs, eliminating issues that often come with RESTful API services such as over- and under-fetching data. GraphQL is language agnostic and incorporates strong data types. It even has built in introspection - what more is there to love?

[**MongoDB**](https://www.mongodb.com/) is one of the most popular NoSQL database management systems out there. Its document-oriented structure lends itself to high horizontal scalability and the enforcement of strong data integrity. It is also open-sourced and has a great community!

GraphQL requires a lot of boilerplate code just to get started, whether you're starting from scratch or have an existing codebase. Starfleet gives you a powerful and convenient way to onboard GraphQL. You can access Starfleet via the CLI, with both the ability to create and test any project that utilizes MongoDB & Mongoose ODM with GraphQL. You can even use Starfleet to spin up your project in a **docker** container! Sound good? Let's get started!

## Prerequisites

You should have your file(s) containing the mongoose models you'd like converted in one folder (default: /models). Starfleet will generate a '/graphqlsrc' file directory containing all the boilerplate GraphQL pieces from the files in the provided folder.

If you want to deploy your project using docker, you must set up docker beforehand (https://docs.docker.com/get-started/). 


## CLI

To get started, install Starfleet globally or locally:

```
npm install -g starfleet-command
```

Then, navigate into your project directory and run:

```
starfleet init
```

The /graphqlsrc folder will be created in your current working directory:

```
-graphqlsrc
  -models
    -starfleet-SDL.graphql
  -resolvers
    -starfleet-resolvers.graphql
```
Additionally, a '/starfleet-server.js' file will be created in your current working directory. The SDL file and resolvers file (with default CRUD operations) are automatically imported to starfleet-server.js file and used to initialize an [Apollo Server](https://www.apollographql.com/docs/apollo-server/). (If you don't already know about Apollo Server, it is a very powerful library for GraphQL that helps you connect a GraphQL schema to an HTTP server in Node.js. It comes with powerful tools such as caching and performance monitoring. Visit Apollo's website for more information!)

If you want to try out your converted mongoose schemas with GraphQL, install Apollo Server by running

```
npm install apollo-server graphql
```

modify your package.json file, and then run npm start to test it out in a GraphQL playground!

## Deployment

Starfleet lets you test your GraphQL project in a docker container. Once you have docker installed and running on your local machine, just run:

```
starfleet deploy --docker
```

A 'Dockerfile' and 'docker-compose-starfleet.yml' will be created in your current working directory and then immediately used to deploy your application to docker at the same port specified in the starfleet-server.js file. To terminate the created docker container, just run:

```
starfleet land --docker
```

## Additional

All possible commands and flags and additional information can be viewed in the CLI by running:

```
starfleet --help
```

If at any time you'd like to delete the generated files, enter:

```
starfleet cleanup
```

We are actively welcoming pull requests or any feedback/requests.

## Built With

* [GraphQL](https://graphql.org/) 
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/) 
* [Docker](https://www.docker.com/) 


## Contributors

* **Andrew Shin** - (https://github.com/andrewsnapz)
* **Jason Yu** - (https://github.com/json-yu)
* **Justin Jang** - (https://github.com/justin1j)
* **Mychal Estalilla** - (https://github.com/mychaI)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
