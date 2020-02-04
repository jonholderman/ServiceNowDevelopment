# GlideRecord & GlideAggregate Cheat Sheet 

## GlideRecord(String tableName) 

```javascript
var gr = new GlideRecord('incident'); // use the incident table
gr.query(); // fetch data from the database
while (gr.next()) { // advance
    gs.info(gr.short_description);
}
```

### Dot walking 101 

GlideRecord provides access to fields via "Dot-walking", so when you query an incident you can access any field like this:

**gr.short_description** instead of **gr.getValue('short_description')**

But it's best practice to save dot-walking for reference fields, like for getting a Caller's Company name: **gr.caller_id.company.name**

or the Country of a Location of an Asset associated to an incident: **gr.cmdb_ci.location.country**

Here is a table of dot-walking best practices:

Avoid | Prefer
--- | ---
gr.sys_id | gr.getUniqueValue()
gr.short_description | gr.getDisplayValue('short_description')
gr.caller_id.name | gr.getDisplayValue('caller_id')
gr.caller_id.manager.name | gr.caller_id.manager.getDisplayValue()

### getValue vs getDisplayValue 

For the following field types, **value** and **display value** are different.

- Choice
- Date & Time
- Glide List
- Journal
- Password
- Price & Currency2
- Reference
- Translated fields

```javascript
var gr = new GlideRecord('incident');
gr.get('sys_id','ef43c6d40a0a0b5700c77f9bf387afe3');
gs.info(gr.caller_id); // 5b7c200d0a640069006b3845b5d0fa7c
gs.info(gr.caller_id.getDisplayValue()); // Jerrod Bennett
```

**Important** Use .getDisplayValue() whenever showing a value in the UI, just in case a translation exists for that field value!

### Methods 

Method | Description
--- | ---
addActiveQuery() | Adds a filter to return active records. Returns GlideQueryCondition.
addEncodedQuery(String query) | Adds an encoded query to other queries that may have been set.
addNotNullQuery(String fieldName) | Adds a filter where fieldName values are not null. Returns GlideQueryCondition.
addNullQuery(String fieldName) | Adds a filter where fieldName values are null. Returns GlideQueryCondition.
addQuery(String fieldName, Object value) | Adds a filter where fieldName is equal to value. Returns GlideQueryCondition.
addQuery(String fieldName, String operator, Object value) | Adds a filter. **See Operators** Returns GlideQueryCondition.
**GlideQueryCondition** | Further refine a query condition
addCondition(String fieldName, [optional String oper,] Object value) | Adds an AND condition to the current condition.
addOrCondition(String fieldName, [optional String oper,] Object value) | Adds an OR condition to the current condition.
**Has Access?** | &nbsp;
canCreate() | Can the user create a record in this table?
canDelete() | Can the user delete from this table?
canRead() | Can the user read from this table?
canWrite() | Can the user write to this table?
**Delete** | &nbsp;
deleteMultiple() | Deletes multiple records that satisfy the query condition.
deleteRecord() | Deletes the current record.
**Get** | &nbsp;
getAttribute(String fieldName) | Returns the dictionary attributes for fieldName.
getDisplayValue() | Returns the display value for the current record.
getDisplayValue(String fieldName) | Returns the display value for fieldName.
getElement(String fieldName) | Returns the GlideElement for fieldName.
getEncodedQuery() | Returns the current query condition as an encoded query string.
getRecordClassName() | Returns the class name for the current record.
getRowCount() | Returns the number of rows in the query result.
getTableName() | Returns the name of the table used to instantiate GlideRecord.
getUniqueValue() | Returns the primary key of the record, which is usually the sys_id.
getValue(String fieldName) | Returns the value for fieldName.
**Record Operations** | &nbsp;
get(String value) | Fetch a record by primary key value, typically sys_id.
get(Object fieldName, Object value) | Fetch a record where fieldName equals value.
getLastErrorMessage() | Retrieves the last error message.
hasNext() | Returns true if there are any more records in the GlideRecord object.
initialize() | Creates a GlideRecord without any default values set.
isNewRecord() | Returns true if the current record has not yet been inserted into the database.
insert() | Inserts a new record.
newRecord() | Creates a new record and sets the default values for the fields.
next() | Moves to the next record in the GlideRecord object.
query() | Perform the query.
setLimit(int max) | Set the maximum number of records to fetch for the query.
setValue(String fieldName, Object value) | Sets the value of fieldName.
setWorkflow(Boolean b) | Enables or disables the running of business rules, script engines, and audit.
update(String reason) | Save the GlideRecord changes to the database. Reason is saved to the audit record.
updateMultiple() | Applies setValue() to every record in the table that match the current query.
**Is valid?** | &nbsp;
isActionAborted() | Checks to see if the current database action is to be aborted.
isValid() | Returns true if current table exists.
isValidField(String fieldName) | Returns true if fieldName exists in the database.
isValidRecord() | Returns true if current record exists in the database.
**Order by** | &nbsp;
orderBy(String fieldName) | Order by fieldName ascending.
orderByDesc(String fieldName) | Order by fieldName descending.

### addQuery operators, must be upper case 

Operator | Type | Desc
---|---|---
= | Number | Equals *num_val*
!= | Number | Not Equals *num_val*
&gt; | Number | Greater than *num_val*
&gt;= | Number | Greater than or equal to *num_val*
&lt; | Number | Less than *num_val*
&lt;= | Number | Less than or equal to *num_val*
= | String | Equals *val*
!= | String | Not Equals *val*
IN | String | In Set of *val* e.g. gr.addQuery('number','IN','INC00001,INC00002')
NOT IN | String | Not in Set of *val*
STARTSWITH | String | Starts with *val*
ENDSWITH | String | Ends with *val*
CONTAINS | String | Contains *val*
DOES NOT CONTAIN | String | Does not contain *val*
INSTANCEOF | String | Record class is *val* or a subclass of *val*

### Examples

#### addActiveQuery
```javascript
var gr = new GlideRecord('incident');
gr.addActiveQuery();
gr.query(); // Get incidents where active=true
while(gr.next()) {
  // do something....
}
```

#### addEncodedQuery 
```javascript
var gr = new GlideRecord('incident');
gr.addEncodedQuery("priority=1^ORpriority=2");
gr.query(); // Get incidents where priority = 1 or 2
while(gr.next()) {
  // do something....
}
```

#### addQuery 
```javascript
var rec = new GlideRecord('incident');
rec.addQuery('active',true);
rec.addQuery('sys_created_on', ">", "2010-01-19 04:05:00");
rec.query(); // Get incidents where active = true and created after 2010-01-19 04:05:00
while (rec.next()) { 
  rec.active = false;
  gs.info('Active incident ' + rec.number + ' closed');
  rec.update();
}
```

#### addQuery & addOrCondition 
```javascript
var gr = new GlideRecord('incident');
var qc = gr.addNullQuery('assigned_to');
qc.addOrCondition('assigned_to', 'javascript:gs.getUserID()');
gr.query(); // Get all incidents where unassigned OR assigned to me
```


#### deleteMultiple
```javascript
var gr = new GlideRecord('incident');
gr.addQuery('active','false'); // delete all inactive incidents
gr.deleteMultiple();
```

#### deleteRecord 
```javascript
var gr = new GlideRecord('incident');
if (gr.get('99ebb4156fa831005be8883e6b3ee4b9')){
    gr.deleteRecord();
}
```

#### canCreate, canDelete, canRead
```javascript
var gr = new GlideRecord('incident');
gs.info(gr.canCreate());
gs.info(gr.canDelete());
gs.info(gr.canRead());
```

#### getDisplayValue 
```javascript
var gr = new GlideRecord('incident');
gr.get('sys_id','ef43c6d40a0a0b5700c77f9bf387afe3');
gs.info(gr.getDisplayValue()); // INC0000050
```

**For field** 
```javascript
var gr = new GlideRecord('incident');
gr.get('sys_id','ef43c6d40a0a0b5700c77f9bf387afe3');
gs.info(gr.getDisplayValue("caller_id")); // Jerrod Bennett
```

#### getEncodedQuery 
```javascript
var gr = new GlideRecord('incident'); 
gr.addQuery('active', true);
gr.addQuery('priority', 1); 
gr.query(); 
var encodedQuery = gr.getEncodedQuery(); 
gs.info(encodedQuery); // active=true^priority=1
```

#### getLastErrorMessage
```javascript
var gr = new GlideRecord('incident');
gr.insert(); // insert without data in mandatory field
gs.info(gr.getLastErrorMessage()); // Data Policy Exception: Short description is mandatory
```

#### getRecordClassName 
```javascript
var gr = new GlideRecord("task"); 
gr.get("ef43c6d40a0a0b5700c77f9bf387afe3");
gs.info(gr.getRecordClassName()); // incident
```

#### getRowCount 
```javascript
var gr = new GlideRecord('incident');
gr.query();
gs.info("Records in incident table: " + gr.getRowCount());
```

#### insert 
```javascript
var gr = new GlideRecord('incident');
gr.newRecord(); 
gr.name = 'New Incident'; 
gr.description = 'Incident description'; 
gr.insert(); // Returns new record sys_id
```

#### next
```javascript
var gr = new GlideRecord('incident');
gr.query();
while (gr.next()) { 
  gs.info([gr.number, gr.short_description, gr.caller_id.getDisplayValue()]);
}
```

#### setWorkflow 
```javascript
var gr = new GlideRecord('incident');
gr.initialize();
gr.setWorkflow(false); // when false, runs almost immediately. When true, takes about 3 seconds.
for (var i=1;i<100;i++){
    gr.short_description = 'Sample incident ' + i; 
    gr.description = 'Auto generated';
    gr.insert();
}
```

#### update 
```javascript
var gr = new GlideRecord('incident');
gr.get('99ebb4156fa831005be8883e6b3ee4b9');
gr.short_description='Update the short description';
gr.update(); // Updates a single record
```

#### updateMultiple 
```javascript
var gr = new GlideRecord('incident');
gr.addQuery('active', true);
gr.setValue('state',  4);
gr.updateMultiple(); // update the state of all active incidents to 4 - "Awaiting User Info"
```

#### isValid 
```javascript
var gr = new GlideRecord('incident');
gs.info(gr.isValid()); // true
 
var anotherGr = new GlideRecord('wrong_table_name');
gs.info(anotherGr.isValid()); // false
```

#### setLimit
```javascript
var gr = new GlideRecord('incident');
gr.orderByDesc('sys_created_on');
gr.setLimit(10);
gr.query(); // this retrieves latest 10 incident records created
```


## GlideAggregate 
Use GlideAggregate to easily run database aggregation (COUNT, SUM, MIN, MAX, AVG) queries. GlideAggregate extends GlideRecord!

```javascript
var ga = new GlideAggregate('incident');
ga.addAggregate('COUNT', 'state');
ga.query();
while(ga.next()) {
   gs.info([ga.getDisplayValue('state'), ga.getAggregate('COUNT', 'state')]);
}

/*
Output: 
    New, 312
    In Progress, 21
    On Hold, 6
    Closed, 28
*/

```

### Methods 

Method | Description
--- | ---
addAggregate(String aggFn, String fieldName) | Add an aggregate function to fieldName. aggFn: (COUNT, MIN, MAX, SUM)
addQuery(String fieldName, String operator, Object value) | Adds a filter. **See Operators**
addTrend(String fieldName, String timeInterval) | Add timeInterval trend for fieldName. timeInterval: (Year, Quarter, Date, Week, DayOfWeek, Hour, Value)
getAggregate(String aggFn, String fieldName) | Return the value of an aggregate function for fieldName
groupBy(String fieldName) | Group by fieldName.
orderByAggregate(String aggFn, String fieldName) | Orders the aggregate result based on the specified aggregate function and fieldName.


### Examples

#### SUM with groupBy
```javascript

var ga = new GlideAggregate("cmdb_ci");
ga.addAggregate('SUM', "cost"); // SUM the cost of every cmdb_ci
ga.groupBy('sys_class_name'); // Group by record class name
ga.orderByAggregate('SUM', 'cost'); // Order by the aggregate function
ga.query();
while(ga.next()) {
    gs.info([ga.getDisplayValue('sys_class_name'), Math.floor(ga.getAggregate('SUM', 'cost'))]);
}

/*
Output: 
    Computer, 1511313
    Linux Server, 182230
    UNIX Server, 38399
    Mass Storage Device, 34735
    ...
*/

```

#### addTrend

```javascript
var ga = new GlideAggregate('incident');
ga.addAggregate('COUNT'); // Count all incidents opened each quarter
ga.addTrend('opened_at', 'Quarter');
ga.query();
while(ga.next()) {
   gs.info([ga.getValue('timeref'), ga.getAggregate('COUNT')]);
}
/*
Output: 
    3/2018, 9
    4/2018, 2
    1/2019, 38
    2/2019, 310
*/

```

From:

https://developer.servicenow.com/app.do#!/api_doc?v=madrid&id=c_GlideRecordScopedAPI
