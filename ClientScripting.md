## Scripting alert, info, and error messages ##
| Script                                                       | Result                                                       |
| ------------------------------------------------------------ | :----------------------------------------------------------- |
| ```javascriptalert("Hello World"); ```                                     | Will pop up a window with "Hello World" and an 'OK' button.  |
| ```javascriptconfirm("Hello World");```                                    | Will pop up a window with "Hello World?" and a 'Ok' and 'Cancel' buttons. |
| ```javascriptg_form.showFieldMsg("field_name", "Hello World", "error");``` | Puts "Hello World" in an error message below the specified field. |
| ```javascriptg_form.hideFieldMsg("field_name");```                         | Hides an error message that is visible under the specified field. |
