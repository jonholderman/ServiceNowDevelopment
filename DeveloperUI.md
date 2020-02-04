# ServiceNow UI Developer Cheat Sheet

-----------------------------------------------------------------------------------------

### Utility URLs

URL | Purpose
--- | -------
/stats.do |				Quick stats
/cache.do |				Clear your instance cache
/cancel_my_transaction |		Cancel your currently running transaction 
/cache_inspect.do |			Inspect the content of various system caches
/$restapi.do |				Rest API explorer

-----------------------------------------------------------------------------------------

### Common directories

Path | Description
---- | -----------
/ui.html |			Static files accessible from /
/ui.jtemplates |		Jelly templates
/ui.jforms |			Jelly forms accessible from /
/ui.jtemplates/doctype |		Doctype Jelly template overrides
/ui.jforms/doctype |		Doctype Jelly form overrides

-----------------------------------------------------------------------------------------

### URL resolution

1. Virtual host provider
1. Static content
1. Processor
	1. Processor table
		1. Parameter - incident.do?**PARAMETER**
		1. Path	- **PATH**.do
		1. Extension - incident.**EXTENSION**
	1. Or a com.glide.processors extension point declared in plugin.xml
1. UI Page?
1. Jelly Form?
1. Table?
1. Table with list suffix?
1. Search suffix?
1. Update suffix?
1. :frowning_face: not_found.xml

-----------------------------------------------------------------------------------------

### Direct UI page (no page template)

- Jelly forms with $ prefix
	- $my_form.xml => /$my_form.do
- ?sysparm_direct=true
	- $my_ui_page.do?sysparm_direct=true
- UI Pages marked direct

-----------------------------------------------------------------------------------------

### Accessing URL Parameters

- RP.getParameterValue(String param)
- ${sysparm_*} (Parameter must start with sysparm_)

-----------------------------------------------------------------------------------------

### Front end scripting

Selector | Usage
--- | ---
$(id) | prototypeJS getElementById()
$$(cssRule) | prototypeJS css selector
$j(selector) | jQuery


#### Common client scripting APIs

API | Description
--- | ---
GlideAjax | Access a service side script include
GlideURL | Create and parse urls
GlideModalForm | Display a form in a modal
g_form | GlideForm shortcut for interacting with a form
g_user | GlideUser shortcut to the current user

-----------------------------------------------------------------------------------------

### Jelly scripting

Syntax | Phase
--- | ---
${ ... } | Phase 1
$[ ... ] | Phase 2


#### JEXL vs JavaScript

JEXL expressions are not JavaScript and Jelly variables are not Rhino variables. You cannot mix them.

JEXL lets you access Rhino scriptable methods and fields like **gs.log()** and **gr.next()**.

#### JEXL methods

Method | Usage | Description
--- | --- | ---
size() | ${ **size**(_jvar_) } | for String, counts length<br/>for Map, counts keys<br/>for List, counts elements
empty() | ${ **empty**(_jvar_) } | True if:<br/>- null, empty string<br/>- a zero length collection<br/>- a map with no keys<br/>- an empty array
.startsWith() | ${ _jvar_.**startsWith**("hello") } | returns bool
.endsWith() | ${ _jvar_.**endsWith**("world") } | returns bool

#### Jexl helpers

	${AND} => &&
	${LT} => <
	${GT} => >
	$[SP] => &nbsp;

-----------------------------------------------------------------------------------------

### Jelly Escaping

JEXL output is automatically escaped. Use these prefixes to manually control how output is escaped. Refer to GlideExpressionWrapper for more detail.

```
	${HTML,JS:gr.getDisplayValue('short_description')}
```

Prefix | When to use
--- | ---
HTML | HTML escaping
JS | JavaScript escaping
JS_STRING | Escape a string containing JavaScript
NS | Escapes script tags for XSS prevention
JS_XML | Escaping for XML used as a javascript string
URL | For URLs
NLBR | Newline to &lt;br/&gt;
WBR | Insert &lt;shy; in long sequences the browser would not break
LINK | Convert patterns looking like hyperlinks to actual ones &lt;a&gt;
HTMLSAN | Sanitizes suspicious HTML with JellyXMLSanitizer
NG | sanitizes against angular expressions
NOESC | Disables escaping for the specified string
SAFE | No JavaScript interpolation protection



	HTML
		& => &amp;
	  	< => &lt;
	  	> => &gt;
	
	JS
		' => \'
	  	" => \"
	  	CR => blank
	  	NL => \n  (the string "\n" so that javascript interprets it as a NL)
	  	<script...> => &lt;script...&gt;
	  	</script> => &lt;/script...&gt;
	  if phase 1:
	  	&  =>  &amp;
	  	<  =>  \\u003C

	JS_STRING
		Same as JS escaping except that less than (<) is not escaped.

	NS
		Note: this is only done if glide.ui.escape_text is false.
		<script...> => &lt;script...&gt;
		</script> => &lt;/script...&gt;

	JS_XML
		' => \'
	  	CR => blank
	  	NL => \n  (the string "\n" so that javascript interprets it as a NL)
	  	<script...> => &lt;script...&gt;
	  	</script> => &lt;/script...&gt;
	  	< => \\u003C
	  	> => \\u003E
	  
	  	if phase 1:
	  	& => &amp;

	URL
		http://localhost:8080/nav_to.do?uri=sys_ui_page.do?sys_id=zzz => http%3A%2F%2Flocalhost%3A8080%2Fnav_to.do%3Furi%3Dsys_ui_page.do%3Fsys_id%3Dzzz

	NLBR
		"This\n<strong>is</strong>\na\ntest" => This<br></br>&lt;strong&gt;is&lt;/strong&gt;<br></br>a<br></br>test

	WBR
		Word break, insert &lt;shy; in long sequences the browser would not break

	LINK
		Convert patterns looking like hyperlinks to actual ones <a>

	HTMLSAN
		Sanitizes suspicious HTML with JellyXMLSanitizer.

	NG
		Sanitizes against angular expressions
 		{{ => {​\\u200b{

	NOESC
		No escaping

	SAFE
		No JavaScript interpolation protection


**Manually Sanitize output**
```
SNC.GlideHTMLSanitizer.sanitizeWithConfig("HTMLSanitizerConfig","Your text here")
```

-----------------------------------------------------------------------------------------

### Jelly Tags

Tag | Description
--- | ---
```<j:if test="">...</j:if>``` | Execute block if **test** is:<br/>- a Boolean and true OR<br/>- a String and = "true", "yes", "on", or "1"
```<j:while test="">...</j:while>``` | Repeat block until **test** is false
```<j:set var="" value="" defaultValue="" />``` | Set **var** to **value** or **defaultValue** if **value** is empty
```<g:set_if var="" test="" true="" false="" />``` | Set **var** to expression in **true** or **false** depending on result of **test**
```<j:choose><j:when test=""/><j:otherwise/></j:choose>``` | Combination of a switch statement and if/else if statement, uses the first **when** block where **test** is true, **otherwise** defines the default case
```<g:inline template="" />``` | Insert a jTemplate or UI Macro at this position with access to surrounding Jelly context
```<g:insert template="" />``` | Similar to g:inline but can't access Jelly variables from the surrounding context
```<g:evaluate var="" jelly="" copyToPhase2="">...</g:evaluate>``` | Evaluate code block in Rhino and assign result to **var**<br/>**jelly** = true to access jelly variables inside script<br/>**copyToPhase2** = true to make **var** available in phase 2 context
```<g:evaluate var="" expression=""/>``` | Same as above except self closing usage. Evaluate **expression** in Rhino and assign result to **var**
```<g:no_escape>...</g:no_escape>``` | Disables automatic output escaping of all contained ${} expressions
```<g:breakpoint var="" />``` | Dumps all of the current jelly variables to the debug ouput<br/>Or a single variable if specified with **var** 

If Tag:

	<j:if test="${jvar_ref}">...do something</j:if>

While tag:

	<j:while test="${jexl_expression}"></j:while>

Set tag:

	<j:set var="jvar_your_variable" value="${jexl_expression}" defaultValue="anything" />

Set_if tag:

	<g:set_if var="jvar_your_var" test="${jexl_expression}" true="anything" false="anything" />

Choose tag:

	<j:choose>
		<j:when test="${jexl_expression}">Anything</j:when>
		<j:when test="${!jexl_expression}">Anything</j:when>
		<j:when test="${jvar == 'hello'}">World</j:when>
		<j:otherwise>The default case</j:otherwise>
	</j:choose>

Insert tag:

	<g:insert template="some_template.xml" />

Inline tag

	<g:inline template="some_template.xml" />

Evaluate tag:

	<g:evaluate var="jvar_result">
		Math.random();
	</g:evaluate>

jvar_result will contain the result of the evaluate tag. var = The last line of code in the evaluate block.

	<g:evaluate var="jvar_result" expression="Math.random() * 100;" />

A single line usage of evaluate. Evaluates the contents of expression.

	<g:evaluate var="jvar_result" expression="new Date()" object="true" />

To treat the returned evaluation as an object, set object="true". Use when returning anything other than string or int.

	<g:evaluate var="jvar_msg" expression="'the cup is ' + jelly.sysparm_cup;" jelly="true" />

To use Jelly variables inside your Rhino script, set jelly="true". Any jelly variable will be accessible on the jelly object inside the code block.

	<g:evaluate var="jvar_result" expression="new Date().getMinutes()" copyToPhase2="true" />

To use the result of the expression in phase 2 like this $[jvar_result], set copyToPhase2="true".

-----------------------------------------------------------------------------------------


### Common System Properties

Property name | Description
--- | ---
glide.ui.template.trace | true 	=	Display jelly template tracing output in log<br/>full 	=	Include full template path in tracing output<br/>false	=	Disable template tracing
glide.ui.js_includes | true 	=	Bundle JS includes into a few large files<br/>false	=	Load JS files separately (useful for debugging)
glide.ui.session_timeout | Session timeout in minutes
glide.ui.i18n_test | true 	=	Adds a prefix to each translated message and field<br/>false 	=	Off
glide.sys.date_format | Customize the system default date format
glide.sys.time_format | Customize the system default time format

#### Session Properties vs Database Properties

To change a property for just the current user session use:

   GlideProperties.set('key', 'value');
   
To change a system property for everyone, and modify the sys_property table use:

   gs.setProperty('key', 'value'); // You must have maint role to do this

-----------------------------------------------------------------------------------------

### Common Glide Server globals

Variable | Description
--- | ---
action	|		Action handler (only available if running in a UI action)
current |		Current record as GlideRecord
previous |		The current record prior to any updates being applied
g_scratchpad |		This object is serialized and passed to the client at the end of the transaction
gs | 			GlideSystem
RP |			RenderProperties
ref | The table name of the current record

-----------------------------------------------------------------------------------------

### Common Glide Server Scripting APIs

- JSUtil
- GlideRecord
- GlideUser (gs.getUser())
- GlideSession (gs.getSession())
- GlideProperties

-----------------------------------------------------------------------------------------

### GlideSystem (gs) server scripting APIs

API | Description
--- | ---
.addInfoMessage(String) | Display an info message on the client.
.addErrorMessage(String) | Display an error message on the client.
.getMessage(String|Array) | Get a translated message for a key or key[]
.getProperty(String key, Object default) | Get a system property value or use default if not found.
.nil(Object) | Returns true if the object is null, undefined or an empty string.
.base64Encode(String) | Returns a base64 encoded string.
.base64Decode(String) | Returns an ASCII string from a base64 encoded string.
.info(String message, Object, Object, Object...) | Writes a message to the system log
.print(String) | Prints a message to the debug console
.getSession() | Returns the current glide session.
.getUser() | Returns the GlideUser of the current user.
.getUserName() | Returns the name of the current user.
.urlEncode(String) | Returns a UTF-8 encoded string.
.urlDecode(String) | Returns an ASCII string from a UTF-8 encoded string.

-----------------------------------------------------------------------------------------
