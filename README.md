<div align="center">
<a href="https://github.com/Traversal-Labs/starfleet">
  <img width="300" height="300" src="https://i.imgur.com/VRfXvfh.jpg">
</a>
</div>

# Starfleet

[![Package on npm](https://img.shields.io/npm/v/postgraphile.svg?style=flat)](https://www.npmjs.com/)

_**With one command, enable your MongoDB project to be able to utilize the high-performance GraphQL API!**_
_**Interested in trying out GraphQL? Quickly convert all your mongoose schemas to easily viewable GraphQL pieces.**_

**Starfleet** is a command line tool that lets you easily harness the flexibility of MongoDB with the declarative power of GraphQL.

[**GraphQL**](https://graphql.org/) is a popular and rapidly growing data query and manipulation language for APIs, eliminating issues that come with RESTful API services, such as the over- and under-fetching data. GraphQL is language agnostic and it incorporates strong data types. It even has built in introspection - what more is there to love?

[**MongoDB**](https://www.mongodb.com/) is one of the most popular NoSQL database management systems out there. Its document-oriented structure lends itself to high horizontal scalability and the enforcement of strong data integrity. It is also open-sourced and has a great community!

GraphQL requires a lot of boilerplate code just to get started, whether or not you're starting from scratch or have an existing codebase. Starfleet gives you a powerful and convenient way to onboard GraphQL. You can access Starfleet via the CLI, with both the ability to create and test any project that utilizes MongoDB & Mongoose ODM with GraphQL. You can even use Starfleet to spin up your project in a **docker** container! Sound good? Let's get started!

## Prerequisites

You should have your file(s) containing the mongoose models you'd like converted in one folder (default: /models). Starfleet will generate a '/graphqlsrc' file directory containing all the boilerplate GraphQL pieces from the files in the provided folder.

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

The /graphqlsrc folder will be created in your current working directory:

```
-graphqlsrc
  -models
    -starfleet-SDL.graphql
  -resolvers
    -starfleet-resolvers.graphql
```
Additionally, a '/starfleet-server.js' file will be created in your current working directory. The SDL file and resolvers file (with default CRUD operations) are imported to starfleet-server.js file and used to initialize an [Apollo Server](https://www.apollographql.com/docs/apollo-server/). (If you don't know about Apollo Server, it is a very powerful library for GraphQL that helps you connect a GraphQL schema to an HTTP server in Node.js. It comes with powerful tools such as cacheing and performance monitoring. Visit Apollo's website for more information!)

## Deployment

Starfleet lets you test your GraphQL project in a docker container. Once you have docker installed on your local machine, just run:

```
starfleet deploy --docker
```

A 'Dockerfile' and 'docker-compose-starfleet.yml' will be created in your current working directory and then immediately used to start docker. To terminate the created
docker container, just run:

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
<a href="https://github.com/Traversal-Labs/starfleet">
  <img width="50" height="50" src="https://avatars0.githubusercontent.com/u/12972006">
</a>
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/) 
<a href="https://github.com/Traversal-Labs/starfleet">
  <img width="50" height="50" src="https://user-images.githubusercontent.com/841294/53402609-b97a2180-39ba-11e9-8100-812bab86357c.png">
</a>
* [Docker](https://www.docker.com/) 
<a href="https://github.com/Traversal-Labs/starfleet">
  <img width="50" height="50" src="(https://avatars0.githubusercontent.com/u/5429470">
</a>

## Contributors

* **Andrew Shin** - (https://github.com/andrewsnapz)
* **Jason Yu** - (https://github.com/json-yu)
* **Justin Jang** - (https://github.com/justin1j)
* **Mychal Estalilla** - (https://github.com/mychaI)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
