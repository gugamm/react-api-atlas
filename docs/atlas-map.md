# AtlasMap
In this section, we gonna talk about the ***AtlasMap***. A feature that let us create an object with methods to create ***request descriptions***. In this section we will see:
  - How create a simple AtlasMap
  - Using the AtlasMap
  - Organizing code
  - atlasOptions vs fetchOptions
  - All supported atlas options

# How create a simple AtlasMap
To create an ***AtlasMap*** we need a configuration which defines the endpoints of our api. Let's see an example of configuration and how we create the AtlasMap from it.

```js
// import the AtlasMap
import { AtlasMap } from 'react-api-atlas';

// create your config
const config = {
    host: 'http://your-api-host.com', // this is required
    resources: { // You can separate your endpoints by resources
        Users: { // Resource
            endPoints: { // EndPoints
                getUsers: { // getUsers endPoint
                    path: '/users',
                },
            },
        },
    },
};

// create the map
const apiMap = AtlasMap(config);
```
# Using the AtlasMap
After creating an AtlasMap, we can now use it. Remember that the AtlasMap creates an ***object*** with methods to generate ***request descriptions***. We can use these descriptions when binding requests to our components using the ***atlas hoc***.

```js
// Suppose we have UserList, atlas and apiMap defined

const bindRequest = atlas(apiMap.Users.getUsers());

export default bindRequest(UserList);
```
Here you can see that we've used the apiMap we've created above. We can call methods using ***apiMap.[resource].\[endpoint]()***

# Organizing code

Putting all resources in one file may lead to a huge file. The recommended way of handling this is separating each resource in it's own file and then merging them into the root configuration like:

```js
import { AtlasMap } from 'react-api-atlas';
import Users from './Users';
import Cats from './Cats';
import Dogs from './Dogs';

const config = {
    host: 'http://your-api-host.com',
    resources: { Users, Cats, Dogs },
};

export default AtlasMap(config);
```

# atlasOptions vs fetchOptions
Now let's use ***AtlasMap*** to set configuration to our endpoints, but before doing that, let's clarify what are ***atlasOptions*** and ***fetchOptions***.

***atlasOptions*** are options passed to the atlas client. They are not passed to the network interface.

***fetchOptions*** are options passed to the network interface "fetcher" method. For example, if you are using the default implementation which uses "fetch" under the hood, then you may pass all options supported by [fetch](https://github.com/github/fetch).

# Advanced configuration
Now let's look at an example using ***atlasOptions*** and ***fetchOptions***.

```js
const config = {
    host: 'yourhost',
    cache: true, // atlasOption
    resources: {
        Users: {
            path: '/users', // atlasOption
            getUser: {
                path: '/{username}', // atlasOption
                params: { // default params - atlasOption
                    username: 'gugamm',
                },
                fetchOptions: { // fetch options
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'GET',
                    body: null,
                },
            },
        },
    },
}
```

# Global, resource or local option
When creating a ***request description***, atlas merge all options into a single object. So if we add "params" to the root configuration, it will affect all endPoints. If we set fetchOptions headers to root, it will also affect all endPoints. A common use is:

```js
const config = {
    host: 'yourhost',
    fetchOptions: { // all requests have these headers
        headers: {
            'Content-Type': 'application/json',
        },
    },
    resources: { 
        SomeResource: { // but this resource uses other headers
            path: '/some',
            fetchOptions: {
                headers: {
                    'Content-Type': 'application/xml',
                },
            },
            endPoints: { /* your endPoints... */ },
        }
    },
};
```

# All supported ATLAS options
In case you are wondering, here a list of all supported atlas options.

| Name | default | Description |
| ------ | ------ | ------ |
| params | {} | defines default parameters to be used to fullfill the url |
| cache | false | a boolean indicating if atlas should use cache or no |
| id | null | an id for the endPoint request (very usefull) |
