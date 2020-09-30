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

## g_user User Object

The g_user object can be used only in UI policies and Client scripts. Contrary to its naming, it is not truly a user object. g_user is actually just a handful of cached user properties that are accessible to client-side JavaScript. This eliminates the need for most GlideRecord queries from the client to get user information (which can incur a fairly significant performance hit if not used judiciously).

| g_user Property or Method | Return value |
| --- | --- |
| `g_user.userName` | User name of the current user e.g. xjxh307 |
| `g_user.firstName` | First name of the current user e.g. Jon |
| `g_user.lastName` | Last name of the current user e.g. Holderman |
| `g_user.userID` | sys_id of the current user e.g. 681ccaf9c0a8016400b98a06818d57c7 |
| `g_user.hasRole()` | True if the current user has the role specified, false otherwise. ALWAYS returns true if the user has the 'admin' role. Usage: g_user.hasRole('itil') |
| `g_user.hasRoleExactly()` | True if the current user has the exact role specified, false otherwise, regardless of 'admin' role. Usage: g_user.hasRoleExactly('itil') |
| `g_user.hasRoles()	` | True if the current user has at least one role specified, false otherwise. Usage: g_user.hasRoles('itil','admin') |


[1]: https://docs.servicenow.com/bundle/orlando-application-development/page/script/general-scripting/reference/r_ScriptingAlertInfoAndErrorMsgs.html	"Scripting alert, info, and error messages"
[2]: https://www.servicenowguru.com/scripting/user-object-cheat-sheet/ "User Object Cheat Sheet"
