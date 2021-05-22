var wwgHelperUtil = Class.create();
scCatItemUtil.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    /**
     * This function allows you to get the value of any field on the SC Cat Item Table
     *
     * @param {string} sysparm_SysID - SysID of the Catalog Item
     * @param {string} sysparm_TableName - The table name where the field is located
     * @param {string} sysparm_FieldName - The field name to get the value of (can use dotwalked field like manager.name)
     * @return {string} The value of the field
     *
     * @example
     *     
     *     function getUserManagerName(response) {
     *         var userManagerName = response.responseXML.documentElement.getAttribute("answer");
     *         g_form.setValue('foo', userManagerName);
     *     }
     *     
     *     var gaGetName = new GlideAjax('wwgHelperUtil');
     *     gaGetName.addParam('sysparm_name', 'getFieldValue');
     *     gaGetName.addParam('sysparm_SysID', "88c34f3a1b2e2cd8fe7e997fbd4bcbf3");
     *     gaGetName.addParam('sysparm_FieldName', "user");
     *     gaGetName.addParam('sysparm_FieldName', "manager.name");
     *     gaGetName.getXML(getUserManagerName);
     *     
     */
    getFieldValue: function() {

        // GlideAjax System Paramaters
        var inputRecordSysID = this.getParameter('sysparm_SysID');
        var inputTableName = this.getParameter('sysparm_TableName');
        var inputFieldName = this.getParameter('sysparm_FieldName');

        // Return Output
        var fieldValue;

        // Strip Input of WhiteSpace
        inputRecordSysID = inputRecordSysID.trim();
        inputTableName = inputTableName.trim();
        inputFieldName = inputFieldName.trim();

        // Check Input for Empty, Null or Undefined
        if(this._isEmpty(inputRecordSysID) || this._isEmpty(inputTableName) || this._isEmpty(inputFieldName)) {

            fieldValue = null;

        } else {

            // Create an Array of Fields (Enables Dot Walking)
            var arrOfFields = inputFieldName.split(".");

            // GlideRecord Object
            var grGetValue = new GlideRecord(inputTableName);
            grGetValue.get(inputRecordSysID);
            grGetValue.query();

            if (grGetValue.next()) {

                // If 'inputFieldName' Needs to be Dot-Walked
                if(inputFieldName.indexOf('.') !== -1) {

                    // Create an Array of Fields (Enables Dot Walking)
                    var arrOfFields = inputFieldName.split(".");

                    // Call the Private Function _getValue
                    fieldValue = this._getValue(arrOfFields, grGetValue);

                } else {

                    // Get Value of Field
                    fieldValue = grGetValue[inputFieldName].getValue();

                }

            } else {

                fieldValue = null;

            }

        }

        // Will Return Null if Error
        return fieldValue;

    },

    /**
     * This function allows you to update the work_notes field outside of a GlideRecord
     * where setWorkflow(false) is set
     *
     * @param {object} glideRec - The GlideRecord Object of the record you want to update
     * @param {string} fieldName - The field name of the activity you want to update (work_notes)
     * @param {string} workNotes - The notes you want to add to the record
     * @param {string} userName - The username to show who updated
     *
     * @example
     *     
     *      var grStory = new GlideRecord("rm_story");
     *      grRmStoryUpdate.get("sysID");
     *      grRmStoryUpdate.query();
     * 
     *      insertJournalEntry(grStory, 'work_notes', workNotes, "userIdOfUser");
     *     
     */
    insertJournalEntry: function(glideRec, fieldName, workNotes, userName) {

        // Check is provided GlideRecord valid
        if(!glideRec.isValidRecord()) {
            return;
        }

        // Check is the field valid for that table
        if(!glideRec.isValidField(fieldName)) {
            return;
        }

        // Check if field type is of type journal input
        var glideElement = glideRec.getElement(fieldName);
        var descriptor = glideElement.getED();
        var internalType = descriptor.getInternalType();
        if(internalType != 'journal_input') {
            return;
        }
        
        var grSysUser = new GlideRecord('sys_user');
        if (grSysUser.get('user_name', userName)) {
            var userSysID = grSysUser.getUniqueValue();
            var userDisplayName = grSysUser.getDisplayValue();
        }

        // Init all variables to be used later on
        var recSysId = glideRec.getUniqueValue();
        var recTable = glideRec.getTableName();
        var recField = fieldName;
        var recFieldLabel = glideRec[fieldName].getLabel();
        var currentDateTime = new GlideDateTime();
        
        // Insert the workNotes into the Journal table
        var grJournal = new GlideRecord('sys_journal_field');
        grJournal.initialize();
        grJournal.name = recTable;
        grJournal.element_id = recSysId;
        grJournal.element = recField;
        grJournal.value = workNotes;
        var journalSysId = grJournal.insert();
        
        // Get the history set for the current record
        var grHistSet = new GlideRecord('sys_history_set');
        grHistSet.get('id', recSysId);
        
        // Insert History line record
        var grHistLine = new GlideRecord(grHistSet.line_table);
        grHistLine.initialize();
        grHistLine.field = recField;
        grHistLine.label = recFieldLabel;
        grHistLine.setValue('new', workNotes);
        grHistLine.user_name = userDisplayName;
        grHistLine.user_id = userName;
        grHistLine.user = userSysID;
        grHistLine.update_time = currentDateTime;
        grHistLine.set = grHistSet.getUniqueValue();
        grHistLine.insert();

    },

    /**
     * A private function that allows you to dynamically dot walk to any field from a GlideRecord Object
     *
     * @param {array} arrOfFields - A sorted array of fields to dot-walk to
     * @param {object} obj - The object to dot-walk from
     * @return {string} The value of the field name
     *
     * @example
     *     
     *     var fieldName = "u_owning_group.manager";
     *     var arrOfFields = fieldName.split(".");
     *     
     *     var grScCatItem = new GlideRecord("sc_cat_item");
     *     grScCatItem.get("88c34f3a1b2e2cd8fe7e997fbd4bcbf3");
     *     grScCatItem.query();
     *     
     *     var fieldValue;
     *     
     *     if(grScCatItem.next()) {
     *       
     *       // Equivalent of: grScCatItem["u_owning_group"]["manager"].getValue();
     *       // or
     *       // Equivalent of: grScCatItem.u_owning_group.manager.getValue();
     *       fieldValue = this._getValue(arrOfFields, grScCatItem);
     *     
     */
    _getValue: function(arrOfFields, obj) {

        arrOfFields.forEach(function(key) {
            obj = obj[key];
        });

        return obj.getValue();

    },

    /**
     * A private function that checks for Empty, Null or Undefined strings
     * 
     * @param {string} string - Input string to check
     * @returns {boolean}
     */
    _isEmpty: function(string) {

        return (!string || 0 === string.length);

    },


    type: 'wwgHelperUtil'
});
