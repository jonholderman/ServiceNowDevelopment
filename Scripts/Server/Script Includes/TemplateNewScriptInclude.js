var GetEmailAndNameUtil = Class.create();
GetEmailAndNameUtil.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
	
    getEmailAndName: function() {
		
		// Recieves a UserID and outputs the users Email and Full Name as a single string
		var gr = new GlideRecord('sys_user');
		if(gr.get('sys_id', this.getParameter('sysparm_userID'))) {
			return gr.name + " - " + gr.email;
		}
		
    },
	type: 'GetEmailAndNameUtil'
});
