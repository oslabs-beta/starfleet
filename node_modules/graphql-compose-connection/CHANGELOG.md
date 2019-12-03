## master

## 0.0.0-semantically-released (September 12, 2016)
This package publishing automated by [semantic-release](https://github.com/semantic-release/semantic-release).
[Changelog](https://github.com/nodkz/graphql-compose/releases) is generated automatically and can be found here: https://github.com/nodkz/graphql-compose/releases

## 1.0.8 (September 6, 2016)
- Update dependencies
- Flowtype 0.32
- Fix code style issues

## 1.0.7 (August 15, 2016)
- fix: babel build via the workaround https://phabricator.babeljs.io/T2877#78089 Huh, it's too tricky to use Map/Set in ES5.

## 1.0.6 (August 13, 2016)
- fix: babel build process

## 1.0.5 (August 10, 2016)
- Update packages, add `babel-plugin-transform-runtime` for build process. Fix [issue](https://github.com/nodkz/graphql-compose-connection/issues/2) for vanilla node.js users without babel (thanks @jacobbubu).

## 1.0.4 (August 9, 2016)
- Add `ofType` property to `Connection` and `Edge` types.
Connection type is some kind of wrapper under GraphQLNamedType.
This behavior needed for `graphql-compose` module in `projection` helper, otherwise, it incorrectly constructs projectionMapper for tricky fields.

## 1.0.3 (July 22, 2016)
- If `first` or `last` args not provided, then get first 20 records by default.

## 1.0.2 (July 20, 2016)
- fix: return non-empty PageInfo if records not found

## 1.0.1 (July 18, 2016)
* Add fallback to `sort` arg, due [unexpected behavior](https://github.com/graphql/graphql-js/issues/435#issuecomment-233297537) of defaultValue for enum field
* Move `graphql-compose` module to peerDependencies.

## 1.0.0 (July 15, 2016)
* Production ready version

## 0.0.1 (July 10, 2016)
* Initial commit
