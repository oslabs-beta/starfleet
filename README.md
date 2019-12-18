# Starfleet

[![Package on npm](https://img.shields.io/npm/v/postgraphile.svg?style=flat)](https://www.npmjs.com/)

_**With one command, enable your MongoDB project to be able to utilize the high-performance GraphQL API!**_
_**Interested in trying out GraphQL? Quickly convert all your moongoose schemas to easil viewable GraphQL pieces.**_

**Starfleet** is a command line tool that lets you easily harness the flexibility of MongoDB with the declarative power of GraphQL.

[**GraphQL**](https://graphql.org/) is a rapidly growing data query and manipulation language for APIs, eliminating issues that come with RESTful API services such as over- and under-fetching data. GraphQL is language agnostic, it incorporates strong data types, and it has built in instrospection - what more is there to love?

[**MongoDB**](https://www.mongodb.com/) is one of the most popular NoSQL database management systems out there. Its document-oriented structure lends itself to high horizontal scalability and the enforcement of strong data integrity. It is also open-sourced and has a great community!

GraphQL requires a lot of boilerplate code just to get started, whether or not you're starting from scratch or have an existing codebase. Starfleet gives you a powerful and convenient alternative for onboarding GraphQL. You can use Starfleet via the CLI, with the ability to both create and test any project that utilizes MongoDB with mongoose ODM. You can even use it to spin up your project in a **docker** container! Let's get started!

## Prerequisites

File(s) of the mongoose models that you'd like converted, preferably in one folder. Starfleet will generate a graphqlsrc file directory containing all the boilerplate GraphQL pieces from these files.

If you want to deploy your project using docker, you must set up docker beforehand (https://docs.docker.com/get-started/). 


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
Additionally, a 'starfleet-server.js' file will be created in your current working directory. The SDL file and resolvers file (with default CRUD operations) are imported and added to the starfleet-server.js file, which is set up with the [Apollo server](https://www.apollographql.com/docs/apollo-server/) library.

## Deployment

Starfleet lets you test your GraphQL project in a docker container. Once you have docker installed on your local machine, just run:

```
starfleet deploy --docker
```

A 'Dockerfile' and 'docker-compose-starfleet.yml' will be created in your current working directory and then used immediately to start docker. To terminate the created
docker container, just run:

```
starfleet land --docker
```

## Additional

All possible commands and flags and additional information can be viewed in the CLI by running:

```
starfleet -help
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
