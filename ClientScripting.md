## Scripting alert, info, and error messages ##
| Script                                                       | Result                                                       |
| ------------------------------------------------------------ | :----------------------------------------------------------- |
| `alert("Hello World"); `                                     | Will pop up a window with "Hello World" and an 'OK' button.  |
| `confirm("Hello World");`                                    | Will pop up a window with "Hello World?" and a 'Ok' and 'Cancel' buttons. |
| `g_form.showFieldMsg("field_name", "Hello World", "error");` | Puts "Hello World" in an error message below the specified field. |
| `g_form.hideFieldMsg("field_name");`                         | Hides an error message that is visible under the specified field. |
