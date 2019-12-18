# Starfleet

[![Package on npm](https://img.shields.io/npm/v/postgraphile.svg?style=flat)](https://www.npmjs.com/)

_**With one command, enable your MongoDB project to be able to utilize the high-performance GraphQL API!**_
_**Interested in trying out GraphQL? Quickly convert all your moongoose schemas to easily editable GraphQL pieces.**_
**Starfleet** is a command line tool that lets you easily harness the flexibility of MongoDB with the declarative power of GraphQL.

**GraphQL** is a rapidly growing data query and manipulation language for APIs, eliminating any issues of over- and under-fetching that comes with RESTful
API services. It's language agnostic, incorporates strong data types, and has built in instrospection - what more is there to love?

**MongoDB** is one ofthe most popular NoSQL open source database management systems out there. Its document-oriented structure lends itself to high horizontal 
scalability and the enforcement of strong data integrity. 

GraphQL requires a lot of boilerplate code just to get started. You can use Starfleet via the CLI, and it comes with several commands that let you both create 
and test any project that utilizes MongoDB with mongoose ODM. You can even spin up your project in a **docker** container. Let's get started!

## Prerequisites

File(s) of your mongoose models that you'd like converted, preferably in one folder. Starfleet will generate a graphqlsrc file directory containing all the 
boilerplate GraphQL pieces needed for you to test it out.


## CLI

To get started, install Starfleet globally or locally:

```
npm install -g starfleet
```

Then, navigate into your project directory and run:

```
starfleet init
```

The graphqlsrc folder will be created in your current working directory:

```
-graphqlsrc
  -data
  -models
    -starfleetSDL.graphql
  -resolvers
    -starfleet-resolvers.graphql
```
Additionally, a 'starfleet-server.js' file will be created in your current working directory. The SDL file and resolvers file are imported and 

## Deployment

Starfleet lets you test your GraphQL project in a docker container. Once you have docker installed on your local machine, just run:

```
starfleet deploy --docker
```

A 'Dockerfile' and 'docker-compose-starfleet.yml' will be created in your current working directory and then used right after to start docker. To terminate the created
docker container, just run:

```
starfleet land --docker
```

All possible commands and flags and additional information can be viewed in the CLI by running:

```
starfleet -help
```

## Built With

* [GraphQL](https://graphql.org/)
* [Apollo Federation](https://www.apollographql.com/docs/apollo-server/)
* [Docker](https://www.docker.com/)

## Contributors

* **Andrew Shin** - (https://github.com/andrewsnapz)
* **Jason Yu** - (https://github.com/json-yu)
* **Justin Jang** - (https://github.com/justin1j)
* **Mychal Estillo** - (https://github.com/mychaI)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
