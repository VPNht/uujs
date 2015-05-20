##UU.js

A jQuery plugin to get the status of a VPN.ht SmartDNS status.

####Getting started

######1: Create the HTML element(s)

Create the placeholder elements on the page which you want to use to show the status feedback (ie account status)

```html
<div id="account-status"></div>
```

######2: Initiate the plugin

Include the jQuery (version 1.7+) and the UU.js plugins on your page

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>
<script src="/path/to/js-assets/jquery.uu.js"></script>
```

And initialize the plugin:

```javascript
var uuJS = new $.UUJS();
```

######3: Subscribe the new elements

You can either subscribe to a single event:

```javascript
var handler = uuJS.subscribe('onSuccess', function(data) {
  $('#account-status').html(data.is_known);
});
```

or subscribe an entire object with all the events:

```javascript
var obj = {

  onStart: function () {
    // Do something here when the check service starts
  },

  onSuccess: function (data) {
    // Do something here when the response is successful
  },

  onFail: function (xhr, status, error) {  
    // Show errors here if the response fails
  },

  anotherMethod: function(v) {
    // You can have more attributes or functions, the plugin will ignore them
  }

  // Subscribe the object
  handler = uuJS.subscribe(obj);

};
```

###### 4: Trigger the account status call

Finally call the get status on the plugin and you should be able to see the result in the placeholder

```javascript
uuJS.status();
```

You will get a similar response to the following one from the server:

```json
{"ip":"111.23.23.111","is_known":false,"our_dns":true,"status":"active"}
```

You may also unsubscribe an element at anytime by calling the following method:

```javascript
uuJS.unsubscribe(handler);
```

---

####$().UUJS(options)

**Options**

 Name |	Type | Default | Description
------|------|---------|------------
timeout | Number | 3000 | Time in milliseconds before retrying to call the end point again in case of time out
retry | Number | 3 | Number of times plugin should retry to call the end point in case of time out

**Methods**

Method | Parameters | Description
-------|------------|------------
subscribe | **event** string &#124; object [,**callback** function] | Add the function or an object to the list of subscribers to a particular event
unsubscribe | **handler** object | Unsubscribe the subscriber from a particular event
