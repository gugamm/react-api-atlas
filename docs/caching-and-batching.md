# Caching and Batching
In this section, we gonna talk about how atlas handles caching and batching. Here we will learn:
  - What is caching and batching
  - Why batching
  - Why caching
  - Defaults
  - Enabling cache (careful)

# What is caching and batching (for atlas)
Let's clarify what is caching and batching for ***atlas***. Note that the definition of caching and batching may change depending on the context.

***caching***, for atlas, is the simple act of storing a ***request object*** in memory. This way, whenever we bind a request with the ***same id***, we would be in fact, binding a ***shared*** request. This way, whenever on component updates this request, the other component would also get affected. Also, if the request has already fetched data, it will not fetch the data again since it's already in memory. This provides a better UX for the user. To see more about ids, check the ***updating request state*** section.

***batching***, for atlas, is the act of merging requests into one. This might seems confusing(in fact it is), but it's not something that will affect you directly.

For understanding ***batching***, let's look at an example:

```js
requestA.fetch().then(response => console.log(response)); 
requestA.fetch().then(response => console.log(response));
requestA.fetch().then(response => console.log(response));
requestA.fetch().then(response => console.log(response));
```

How many requests are going to be executed? Well, the usual answer would be 4, but atlas uses batching, so it will merge all requests into one and all requests will get the same response. This helps keeping data and state consistent. In the end, only 1 request will be made.

# Why batching?
Well, that's a good question. Why batching? Why not simple fetching two times?

The thing is, if we are going to use cache and therefore, share a request object across multiple components, we need to keep data and the request state consistent. Batching avoid the case of muliple components being rendered at the same time with the same request and making multiple requests, which would cause multiple state changes and maybe each request could lead to different responses.

This is good for the server and for the client. The server will receive less requests and the client will have data and state consistency. Yay!

# Why caching?
Now what about caching?

Well caching is actually easier to explain. Caching not only provides a better UX for fast response but also helps keeping data shared across multiple components.

Suppose you have two components ***A*** and ***B***. Both sharing the same request object. Now suppose user clicks on a button on component ***A*** to refresh the data. What would happen?

Well, in a normal case, the data from component ***A*** would get updated, but component ***B*** would not be in sync with data that component ***A*** have. However using caching, whenever we refresh the data somewere, the state and the new data will be shared across all components using that request object. Which means, that after a refresh from component ***A***, component ***B*** would also receive the new data.

# Hard question
What happens if component ***A*** tells the request to refresh and after that component ***B*** does the same thing? Since component ***B*** made the request after, the response from component ***B*** should be the most updated. How atlas handle this case?

In atlas there can be ***only one request in flight***. So if component ***A*** tells atlas to refresh, it will start a request. When component ***B*** also tells atlas to refresh(and the request is still in flight), it will start a new request and change this new request in place of the older one. In other words, component ***A*** and ***B*** will get the same response from the last request!!!

# Defaults
By default, ***batching is enabled*** and cannot be disabled. ***Caching is disabled***, but can be enabled.

We don't recommend enabling caching for your entire ***AtlasMap***. Requests that use the method ***POST*** or similar usually should not use caching, since making a request that has a cached response would not trigger the post. ***Which is not what you want!***.

So, ***rule of the thumb***, only use caching for ***GET*** methods.

# Enabling cache
To enable cache using ***AtlasMap***, just use the ***cache*** option like the example below:

```js
import { AtlasMap } from 'react-api-atlas';

const config = {
    host: 'yourhost',
    resources: {
        Users: {
            path: '/users',
            endPoints: {
                getUsers: { // USE CACHE ONLY ON "GET" METHODS. GOOD :D
                    path: '/',
                    cache: true, //cache enabled
                },
            },
        },
    },
};
```