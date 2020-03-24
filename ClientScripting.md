## Scripting Alert, Info, and Error Messages

Will pop up a window with "Hello World" and an 'OK' button.

```javascript
alert("Hello World");
```

Will pop up a window with "Hello World?" and a 'Ok' and 'Cancel' buttons.

```javascript
confirm("Hello World");
```

Puts "Hello World" in an error message below the specified field.

```javascript
g_form.showFieldMsg("field_name", "Hello World", "error");
```

Hides an error message that is visible under the specified field.

```javascript
g_form.hideFieldMsg("field_name");
```

[1]: https://docs.servicenow.com/bundle/orlando-application-development/page/script/general-scripting/reference/r_ScriptingAlertInfoAndErrorMsgs.html	"Scripting alert, info, and error messages"
