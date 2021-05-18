function onLoad() {
	
	function getClientVariable(response) {
    
		var answer = response.responseXML.documentElement.getAttribute("answer");
		g_form.setValue('clientVariable2', answer);
    
	}
		
		var gaGetVariable = new GlideAjax('NameOfScriptInclude');
		gaGetVariable.addParam('sysparm_name', 'nameOfFunction');
		gaGetVariable.addParam('sysparm_newVariable', g_form.getValue('clientVariable'));
		gaGetVariable.getXML(getClientVariable);
   
}
