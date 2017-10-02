# Quickstart
This section is intended to give you a quickstart of using react-atlas-api. Here we will see:
  - Basic setup to use atlas
  - Binding request to a component
  - Using the request from props to display data

# Before starting
We assume you have a good understanding of react-atlas-api basic concepts or that you just wanna see something working. To get an overview of basic concepts refer to [overview](./overview.md) doc.

We also assume you are using create-react-app and that you will modify your code to be able to run this example.

# Getting started
First you need to install the library. Use one of these commands:

***npm***
```sh
$ npm install --save react-api-atlas
```

***yarn***
```sh
$ yarn add react-api-atlas
```

# What we will build
We are going to build an app to list repositories of an user from github.

# Basic setup
Let's create our ***App*** component with a minimum required setup.

```js
import React, { Component } from 'react';
import { AtlasProvider, AtlasClient, createNetworkInterface } from 'react-api-atlas';
import UserRepos from './UserRepos'; // we will build this component later

// create an atlas client
const client = new AtlasClient({ 
    networkInterface: createNetworkInterface(),
});

class App extends Component {
    render() {
        // We have to provide our client using AtlasProvider
        // You may change to prop username to your github username if you wish
        return (
            <AtlasProvider client={client}>
                <UserRepos username="gugamm" />
            </AtlasProvider>
        );
    }
};
```
# The UserRepos component
Now let's create the UserRepos component and then we are done :)

```js
import React from 'react';
import { atlas } from 'react-api-atlas';

// Our "Dumb" component
const UserRepos = ({ request: { loading, error, data: repos }}) => {
    if (loading)
        return <div>Loading...</div>;
    if (error)
        return <div>{error}</div>;
    const repoItems = repos.map(repo => <li key={repo.id}>{repo.name}</li>);
    return <ul>{repoItems}</ul>;
};

// Now we use our atlas hoc to bind the request to the "Dumb" component
const bindRequest = atlas({ 
    url: 'https://api.github.com/users/{username}/repos',
}, { 
    options: ({ username }) => ({
        params: { username },
    }), 
});

export default bindRequest(UserRepos);
```

Now you should be able to run your application. Read the docs for more information about the api and tips. Good luck!