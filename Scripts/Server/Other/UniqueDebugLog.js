var uuid = Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);

var strVariable = JSON.stringify(incident);
strVariable = JSON.stringify(incident, null, 4);
gs.log("Variable Name: " + strVariable, "Unique Name");