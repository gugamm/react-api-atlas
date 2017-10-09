# Atlas hoc
In this section, we gonna talk about the atlas hoc. We will learn:
  - Basic usage of atlas hoc
  - Custom options and fetchData
  - Refetch
  - Updating request state (update cache)

# Basic usage
Atlas provides a hoc that can be used to bind request state into our components. We can customize the behavior of this hoc by providing options. Let's see a basic usage.

Note that ***atlas*** only requires an object with an url. There are more options you can pass to atlas. We gonna take a look into them later.

***On your container.js***
```js
// import atlas hoc and your component
import { atlas } from 'react-api-atlas';
import TargetComponent from './TargetComponent';

export default atlas({
    url: 'your_api_url',
})(TargetComponent);
```

***On your TargetComponent.js***
```js
import React, { Component } from 'react';

class TargetComponent extends Component {
    render() {
        const { loading, error, data } = this.props.request;
        return /*...*/;
    }
}

export default TargetComponent;
```

By default, atlas will start fetching data and bind request state to our TargetComponent. However, sometimes we want to bind a POST request and execute the request whenever the user click a button for example, or we may want to implement a custom logic around fetching. Atlas has support for both cases and more.

# Custom options and fetchData
The real interface of atlas is
```
atlas(atlasRequestDescription, config)(TargetComponent)
```
Where ***atlasRequestDescription*** is an object returned by using ***AtlasMap*** or an object containing ***url*** and/or ***atlasOptions***. 

***config*** are custom options we can provide to override options from the atlasDescription or to enhance them. Also, we can change the other props that affect the behavior of the hoc.

Let's see a full usage of atlas with all options.

```js
import { atlas } from 'react-api-atlas';
import api from '~/api'; // AtlasMap object
import TargetComponent from 'TargetComponent';

const getUsers = api.Users.getUsers();
const enhance = atlas(getUsers, {
    auto: false, // atlas will not fetch data automatically
    propName: 'getUsers', // atlas will pass request state in getUsers prop
    options: ({ count }) => ({ //atlasOptions can be a fn(props) or an object
        params: { count },
        fetchOptions: {
            headers: { 'Content-Type': 'application/json' },
        },
    }),
    props: ({ ownProps: { count }, fetchData, client, refetch }) => ({
        customFetch() {
            fetchData()
            .then(atlasResponse => atlasResponse.data)
            .then(users => console.log(users));
        }
    }),
});

export default enhance(TargetComponent);
```

Above we can see an advanced usage of atlas hoc. We can provide more props that are passed into our components, we can override atlasOptions with our options and we can implement a custom fetchData logic. If you noticed, ***props*** is a function that also receives the ***client***, which we can use to update a request state for example.

# Updating request state
To update a request state, we highly recommend that you use ***AtlasMap***, because it makes easier to define an ***id*** for a request.

Suppose we have the following AtlasMap:

```js
import { AtlasMap } from 'react-api-atlas';

const config = {
    host: 'someapihost',
    resources: {
        Users: {
            path: '/users',
            endPoints: {
                getUser: {
                    path: '/{id}',
                },
                getUsers: {
                    path: '/',
                    cache: true, // this is important
                    id: 'users', // this is also important
                },
            },
        },
    },
};

export default AtlasMap(config);
```

Note that we have defined an ***id*** and activated cache for the ***getUsers*** request. This is super important since we need that the getUsers request stay in memory. This way, we can control it's state.

It's important to know that the ***atlasClient*** has a request array in which we can use to access all requests in memory. Requests are stored using an ***id***. Since we defined the ***id*** of ***getUsers*** we can easily find the ***getUsers*** request in memory by using client.requests\['users'\].

Now let's see an example of how we could update the state of the ***users*** request in memory after fetching an ***user***

```js
import { atlas } from 'react-api-atlas';
import api from '~/api'; // Our AtlasMap
import TargetComponent from './TargetComponent';

const getUser = api.Users.getUser();
const enhance = atlas(getUser, {
    auto: false, // we are going to handle fetching
    props: ({ client, fetchData, ownProps: { userId }}) => ({
        customFetch() {
            fetchData({ params: { id: userId } })
            .then(r => r.data)
            .then(user => {
                const usersRequest = client.requests['users'];
                if (!usersRequest) {
                    return;
                }
                usersRequest.updateState(prevState => {
                    const updatedUsers = prevState.data.map(prevUser => {
                        if (prevUser.id !== user.id) {
                            return prevUser;
                        }
                        return user; // return the updated user
                    });
                    return {
                        ...prevState,
                        data: updatedUsers,
                    }; // return the updated state
                });
            });
        },
    }),
});

export default enhance(TargetComponent);
```

As you can see above, we can implement a logic to update users data in memory.

# Refetch
Sometimes, we may want to retry a request. To do that, we can use the ***refetch*** method. Note that this method can only be called after a request has been made by the enhanced component. ***Refetch should only be used to handle errors***, i.e, ***when request.error === true***.

```js
import React, { Component } from 'react';

class TargetComponent extends Component {
    render() {
        const { error, refetch } = this.props.request;
        
        if (error) {
            return <button onClick={refetch}>Refetch?</button>;
        }
        
        /*...*/
    }
}

export default TargetComponent;
```

# Multiple refetch in flight
If multiple components trigger a refetch, then because of ***batching***, all requests will receive the result of the last request. Refetch is handled a little bit different from a normal request in the sense of that it always trigger a new request, ***but*** only the response of the last request is returned. This helps keeping data and state consistent.

# Invalidating cache?
What if you want to force a refetch of data in cache? The atlas hoc does not have any option for that. However, you can use ***client.requests[id].refetch()*** somewhere in your code. 

Maybe there will be an easier way of doing that in the future, but for now, the only way is calling ***refetch*** on the request.

Also, if you want to implement a pooling, you could use the same strategy, but it's not recommended since refetching will cause request to update to loading all the time you are doing pooling. This is gonna be solved in future versions where we may have a separation of ReactRequest and StaticRequest. ReactRequest is a request that update it's state based on a request. StaticRequest is simple a interface to access the request directly.
