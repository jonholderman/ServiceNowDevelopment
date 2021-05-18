(function(outputs, steps, stepResult, assertEqual) {

// Step Outputs
// Automated Test Framework (ATF) > Step Configurations > Output Records

  var step26_sysID = "56e543a91b885450c2f82fcdee4bcb27";
	var demandSysID = steps(step26_sysID).record_id;
	
	gs.log("$$$ demandSysID: " + demandSysID);

    var grSysApprovalApprover = new GlideRecord("sysapproval_approver");
    grSysApprovalApprover.get("sysapproval", demandSysID);
    grSysApprovalApprover.query();
    while (grSysApprovalApprover.next()) {

        grSysApprovalApprover.state = 'approved';
        grSysApprovalApprover.update();

    }

	var output = "";
	
    var grSysApprovalApprover_after = new GlideRecord("sysapproval_approver");
    grSysApprovalApprover_after.get("sysapproval", demandSysID);
    grSysApprovalApprover_after.query();
    while (grSysApprovalApprover_after.next()) {

        var name = grSysApprovalApprover_after.approver.getDisplayValue();
        var state = grSysApprovalApprover_after.state.getDisplayValue();
		
		output += name + " " + state + ", ";

    }

    stepResult.setOutputMessage(output);
    outputs.table = 'sysapproval';
    outputs.record_id = demandSysID;

})(outputs, steps, stepResult, assertEqual);
