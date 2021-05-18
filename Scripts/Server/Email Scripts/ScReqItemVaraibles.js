template.print("Summary of Requested Item:\n");
var grRequestedItem = new GlideRecord("sc_req_item");
grRequestedItem.addQuery("sys_id", current.sysapproval);
grRequestedItem.query();

while (grRequestedItem.next()) {

    var grVariables = new GlideRecord('sc_item_option_mtom');
    grVariables.addQuery("request_item", current.sysapproval);
    grVariables.query();

    while (grVariables.next()) {

        var visible = grVariables.sc_item_option.item_option_new.visible_summary;
        var question = Packages.com.glideapp.questionset.Question.getQuestion(grVariables.sc_item_option.item_option_new);
        question.setValue(grVariables.sc_item_option.value);

        if (question.getLabel() != "" && question.getDisplayValue() != "" && visible == true) {
            template.print(question.getLabel() + " = " + question.getDisplayValue() + "\n");
        }

    }

}
