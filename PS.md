# To Do List React 

**This is a to do list project created by React that consumes ![ATDAPI](https://altcademy-to-do-list-api.herokuapp.com/)**



## Adding a new task

- `fetch` accepts a second argument that lets us configure request options. It needs to be supplied in the form of an object

```
fetch('url', {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // cors, *same-origin, etc.
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
  },

  body: JSON.stringify(data), // body data type must match "Content-Type" header
}).then(response => response.json())
```

1. `method`: defines which type of request we are making "GET","POST", "PUT", "DELETE". The default is "GET", that's why we don't need to define the option object for a simple "GET" request.

2. `mode`: defines whether the API we are sending a request to.

- "same-origin" is the default setting, it will only allow sending request to the same domain as the page. I.e., we can only send a request to www.foo.com if we are on a page of www.foo.com.

- "cors" stands for Cross Origin Resource Sharing, this mode allows us to send request to domains of different origins. A page on www.foo.com can send requests to www.bar.com with this setting.

3. `credentials`: defines whether we are going to send the browser cookies to the API server. The browser cookie may contain sensitive information such as login status, session id, etc. It is most conservative to only send cookie data to the origin domain.

- "include" will send the cookie data for same origin and cross origin requests. 

- "same-origin" will only send cookie data when the request is same origin

- "omit" will prevent cookie being sent at all.

4. `headers`:   define what type of headers we want to set for the request, the most common header we will set for now is "Content-Type".

5. `body` : where we define the data to be sent to the API, we must remember to use JSON.stringify to transform the data into JSON.

-> Apply the above information to our "create a new task" section, we have:

1. "POST" request for the method

2. "cors" for cross origin in the mode

3. We can ignore credentials since we don't need to send cookie data to the API server

4. We need to set "Content-Type": "application/json", for headers, since we are sending JSON data.