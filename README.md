# React api atlas

React api mapper is a library that integrates api-atlas with react. It makes easy to fetch data and bind the request state to your components. It also handle cache for you.

# Installing

with npm

```sh
$ npm install --save react-api-atlas
```

with yarn

```sh
$ yarn add react-api-atlas
```


# Quick start

This library contains one hoc(High order component), so you can bind the request state to your components and one provider, so you can provide the atlas client required by the hoc.

Lets see a very simple example to show a list of repos from github
```js
import React from 'react';
import { AtlasMap, AtlasClient, createNetworkInterface, AtlasProvider, atlas } from 'react-api-atlas';

// Your api configuration
const apiConfig = {
  host: 'https://api.github.com',
  resources: {
    Users: {
      path: '/users',
      endPoints: {
        getRepos: {
          path: '/{username}/repos', 
          options: {
            params: {
              username: 'gugamm',
            },
          },
        },
      },
    },
  },
};

//Atlas client
const client = AtlasClient({ networkInterface: createNetworkInterface() });
//Api method to build request definitions
const api = AtlasMap(apiConfig);

const App = () => (
    <AtlasProvider client={client}>
        <EnhancedReposList />
    </AtlasProvider>
);

const ReposList = ({ request: { loading, error, data: repos } }) => {
    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error</div>
    }
    const reposItems = repos.map(repo => <li key={repo.id}>{repo.name}</li>);
    return (
        <ul>{reposItems</ul>
    );
}

//Connect the request state with your component using the atlas hoc
const EnhancedReposList = atlas(api.Users.getRepos())(ReposList);

// ReactDOM.render(<App />, document.getElementById('root'));
```

### Documentation

Coming soon!!

License
----

MIT

