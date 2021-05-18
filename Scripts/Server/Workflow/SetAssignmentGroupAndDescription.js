// Assign Assignment Group to 'ServiceNow Group Name'
task.assignment_group.name = 'ServiceNow Group Name';

// If the variable 'New Folder' is selected for the 'folderType' Variable  
if(current.variables.folderType == 'New Folder') {
	
	// Set the Short Description as 'New Restricted Shared Folder'
	task.short_description = 'New Restricted Shared Folder';

// If the variable 'Increase Size of Existing Folder' is selected for the 'folderType' Variable  
} else if(current.variables.folderType == 'Increase Size of Existing Folder') {
	
	// Set the Short Description as 'Increase Size of Existing Shared Folder'
	task.short_description = 'Increase Size of Existing Shared Folder';
	
}
