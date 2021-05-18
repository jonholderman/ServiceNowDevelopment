var tableUtils = new TableUtils("cmdb_ci");
var tableString = String(tableUtils.getAllExtensions());
var modTableString = tableString.slice(1, -1);
var tableArray = modTableString.split(",");
for(var i in tableArray){

	var tableName = '';
  
	if(tableArray[i].indexOf(" ") == 0) {

		tableName = tableArray[i].slice(1);

	} else {

		tableName = tableArray[i];

	}
  
	var ciCount = 0;
	var grConfigurationItems = new GlideRecord(tableName);
  grConfigurationItems.setLimit(1);
	grConfigurationItems.query();
	ciCount = grConfigurationItems.getRowCount();
  
  gs.print(grConfigurationItems.getClassDisplayValue() + "," + tableName + "," + ciCount);
  
	var tableLabel = grConfigurationItems.getClassDisplayValue();
  
  var grSysDictionary = new GlideRecord('sys_dictionary');
  grSysDictionary.addActiveQuery();
  grSysDictionary.addEncodedQuery('nameIN' + tableName);
  grSysDictionary.query();
  
  while(grSysDictionary.next()) {
    
    var columnLabel = grSysDictionary.column_label;
    var columnName = grSysDictionary.element;
    
    if(columnLabel != "" || columnLabel != null) {
      
      if(columnName.startsWith("u_")) {
        
      	gs.print(tableLabel + "|" + tableName + "|" + columnLabel + "|" + columnName);
        
      }
      
    }

  }
  
}
