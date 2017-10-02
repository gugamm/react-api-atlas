# Overview
This section is intended to give you an overview of react-atlas-api. Here we will teach you fundamental concepts. Some of these concepts are:
  - What is a request for atlas
  - Request description vs request
  - Binding request to components
  - Creating an AtlasMap
  

# Before starting
We assume you have good understanding of react and concepts around it, like High Order Components(HOCs). If you don't know what is a HOC, please refer to [react documentation](https://reactjs.org/docs/higher-order-components.html).

This overview is only to teach you some important concepts, if you wanna write some code to see things working, see the [quickstart](./quickstart.md) section. 

# Requests
Before digging into code, we first need to understand what is a ***request*** for atlas. Usually a request represent an act of asking for something. If using libraries like fetch, axios or even XMLHttpRequest, a request is simple an act of using one of these methods to fetch some data from a server.

Well, for atlas, a request is more than an act. A request in atlas is more like a source of data, or simple an object. It has a state and a method to acctualy execute and fetch the data. The cool thing is, we can subscribe to it's state, and whenever it changes, the request object calls our callback with the new state.

Besides a state, atlas also handles ***caching*** and ***batching***. These are a little bit more complex topics, so we gonna talk about them later. For now, just keep in mind that a ***request is an object with a state, a method to fetch the data and a method to subscribe to a state change***.

# Request vs Request description
Another important concept is a ***request description***. A ***request description*** is simple an object describing what need to be fetched. It contains the ***url*** and ***options*** like headers, body and path or query parameters. A ***request*** is an object built using this description to fetch data and to provide a state in which we can subscribe to.

# Using atlas HOC
Now let's take a look how we can bind a ***request*** to a component ***TodoList***. For this example, we will suppose we have an api with this end point: http://api.example.com/todos.

First we import atlas from react-api-atlas and then we bind a request by describing what we want to fetch using a ***request description***.

```js
import { atlas } from 'react-api-atlas';
import TodoList from './TodoList';

const bindRequest = atlas({ url: 'http://api.example.com/todos' });

export default bindRequest(TodoList);
```

With this simple code, we can bind requests to our components. Atlas will handle fetching, caching, batching and keep data consistency for you. You can provide your own options or even a custom method for fetching. Read the docs about advanced use of atlas hoc.

# Atlas map
It is ***ok*** to create requests descriptions like we did above. However, atlas provide an organized way of doing that by the use of ***AtlasMap***. With this feature, we can create an object that will provide functions to create request descriptions for us. Below is a very tiny example.

```js
import { AtlasMap } from 'react-api-atlas';

const Todos = {
    path: '/todos',
    endPoints: {
        getTodos: {
            path: '/',
        },
    },
};

const apiConfig = {
    host: 'http://api.example.com',
    resources: { Todos },
};

const api = AtlasMap(apiConfig);

// api.Todos.getTodos() => { url: 'http://api.example.com/todos', atlasOptions: ... };
```

This is a recommended but not required method of creating request descriptions for the atlas hoc.

# Next steps

***Congratulations!*** You now have a good overview of react-api-atlas library. You may now dig into more advanced topics like ***caching and batching***, ***updating request state***, ***creating an atlas map*** and ***advanced use of atlas hoc***. Good luck!
