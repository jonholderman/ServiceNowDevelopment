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