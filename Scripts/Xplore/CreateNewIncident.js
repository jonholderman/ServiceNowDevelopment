function createNewIncident() {

    var grCreateIncident = new GlideRecord('incident');
    grCreateIncident.initialize();

    grCreateIncident.setDisplayValue('caller_id', 'Jon Holderman');
    grCreateIncident.setDisplayValue('u_affected_user', 'Jon Holderman');
    grCreateIncident.setValue('contact_type', 'call');
    grCreateIncident.setValue('short_description', 'Test Incident Survey');
    grCreateIncident.setDisplayValue('category', 'ServiceNow');
    grCreateIncident.setDisplayValue('subcategory', 'Incident');
    grCreateIncident.setValue('u_environment', 'Production');
    grCreateIncident.setValue('state', '1');
    grCreateIncident.setValue('impact', '1');
    grCreateIncident.setValue('u_users_impacted', '2');
    grCreateIncident.setValue('urgency', '1');
    grCreateIncident.setDisplayValue('assignment_group', 'Service Now Administration');
    grCreateIncident.setDisplayValue('assigned_to', 'Greg Green');
    grCreateIncident.setValue('description', 'Test Incident Survey');

    var sysId = grCreateIncident.insert();

    var grIncident = new GlideRecord('incident');
    if (grIncident.get(sysId)) {
        gs.log("Incident Created... " + grIncident.getDisplayValue());
    }

    return sysId;

}

function closeIncident(refIncident) {

    var grIncident = new GlideRecord('incident');

    if (grIncident.get(refIncident)) {

        grIncident.setValue('state', '6');
        grIncident.setValue('u_resolve_code', 'Reset/Restore/Repair');
        grIncident.update();

        gs.log("Incident Closed... " + grIncident.getDisplayValue());

    }

}

var sysId = createNewIncident();
closeIncident(sysId);