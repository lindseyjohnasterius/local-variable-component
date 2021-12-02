# local-variable-component

Creates an Input with a name that  saves its value to local storage.
Demo: https://lindseyjohnasterius.github.io/local-variable-component/demo.html

## Usage

Include the JS in local-variable.js and then you can use the local variable component like so: 

```HTML
  <local-variable id="hello-world"></local-variable>
 
  <local-variable source="hello-world"></local-variable>
  <local-variable source="hello-world"></local-variable>
```

You can use value attribute like so: 

```javascript
  document.querySelector('#hello-world').getAttribute('value')
```
