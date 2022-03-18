var swissArmyUtil = Class.create();
swissArmyUtil.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    /**
     *
     * This function allows you to get the value of any field on any table
     *
     * @param {string} sysparm_SysID - SysID of the Record
     * @param {string} sysparm_TableName - Table name to get value
     * @param {string} sysparm_FieldName - The field name to get the value of
     * @return {string} The value of the field name
     *
     * @example
     *     
     *     function getSCItemFieldValue(response) {
     *         var fieldValue = response.responseXML.documentElement.getAttribute("answer");
     *         g_form.setValue('foo', fieldValue);
     *     }
     *     
     *     var gaGetName = new GlideAjax('swissArmyUtil');
     *     gaGetName.addParam('sysparm_name', 'getFieldValue');
     *     gaGetName.addParam('sysparm_TableName', "sc_cat_item");
     *     gaGetName.addParam('sysparm_FieldName', "name");
     *     gaGetName.getXML(getSCItemFieldValue);
     *     
     */    
    getFieldValue: function() {

        // GlideAjax System Paramaters
        var sysID = this.getParameter('sysparm_SysID');
        var fieldName = this.getParameter('sysparm_FieldName');
        var tableName = this.getParameter('sysparm_TableName');

        var grLookup = new GlideRecord(tableName);
        grLookup.get(sysID);
        grLookup.query();

        var fieldValue;

        if (grLookup.next()) {

            // If fieldName Needs to Dot Walk
            if (fieldName.indexOf(".") !== -1) {

                // Call the Private Function _getValue and Pass the Array of Fields and GlideRecord Object
                fieldValue = this._getValue(fieldName, grLookup);

            } else {

                fieldValue = grLookup[fieldName].getValue();
            }

        }

        if (fieldValue === null || fieldValue === undefined) {
            fieldValue = "";
        }

        return fieldValue;

    },

    /**
     * This function allows you to pass a JSON string of an Array of Fields you want to get a value of. 
     * This function also supports using dot-walked fields.
     *
     * @param {string} sysparm_SysID - SysID of the Record
     * @param {string} sysparm_TableName - Table name to get value
     * @param {string} sysparm_ArrOfFields - A JSON string of fields that you want the value of
     * @return {array} An array of objects that contain the fieldName and fieldValue
     *
     * @example
     *     
     *     function getSCItemFieldValues(response) {
     *         var arrFieldObj = response.responseXML.documentElement.getAttribute("answer");
     *
     *         for(var i = 0; i < arrFieldObj.length; i++) {
     *	           g_form.setValue('scCat' + arrFieldObj[i].fieldName, arrFieldObj[i].fieldValue);
     *         }
     *
     *     }
     *     
     *     var arrOfFields = ["name", "u_owning_group.manager", "u_owning_group"]
     *
     *     var gaGetMultipleFields = new GlideAjax('swissArmyUtil');
     *     gaGetMultipleFields.addParam('sysparm_name', 'getMultipleFields');
     *     gaGetMultipleFields.addParam('sysparm_SysID', "88c34f3a1b2e2cd8fe7e997fbd4bcbf3");
     *     gaGetMultipleFields.addParam('sysparm_SysID', "sc_cat_item");
     *     gaGetMultipleFields.addParam('sysparm_ArrOfFields', JSON.stringify(arrOfFields));
     *     gaGetMultipleFields.getXML(getSCItemFieldValues);
     *     
     */
    getMultipleFields: function() {

        // GlideAjax System Paramaters
        var sysID = this.getParameter('sysparm_SysID');
        var tableName = this.getParameter('sysparm_TableName');
        var arrOfFields = JSON.parse("" + this.getParameter('sysparm_ArrOfFields'));

        var grLookup = new GlideRecord(tableName);
        grLookup.get(sysID);
        grLookup.query();

        var arrOfValues = [];

        if (grLookup.next()) {

            for (var i = 0; i < arrOfFields.length; i++) {

                var fieldNamePart = arrOfFields[i];
                var fieldValue = "";

                // If fieldName Needs to Dot Walk
                if (fieldNamePart.indexOf(".") !== -1) {

                    // Call the Private Function _getValue and Pass the Array of Fields and GlideRecord Object
                    fieldValue = this._getValue(fieldNamePart, grLookup);

                } else {

                    fieldValue = grLookup[fieldNamePart].getValue();
                }

                var objTemp = {
                    "fieldName": fieldNamePart,
                    "fieldValue": fieldValue
                };

                arrOfValues.push(objTemp);

            }

        }

        return JSON.stringify(arrOfValues);

    },

    /**
     * This function allows you to see if a user has a role. This differs from using the built-in
     * gs.hasRole() function as this will always return true for admins.
     *
     * @param {string} roleName - A string that contains the dot-walked field needed
     * @return {bool} Returns true if the user has the specified role
     *
     * @example
     * var gu = new swissArmyUtil();
	 * 
     * var isCitizenDeveloper = gu.hasRoleExactlyServerSide("wwg_citizen_developer");
     * 
     * if (isCitizenDeveloper) {
     *     answer = false;
     * } else {
     *     answer = true;
     * }
     *     
     */
    hasRoleExactlyServerSide: function(roleName) {

        if (gs.getSession().getRoles().toString().indexOf(roleName) > 0) {
            return true;
        } else {
            return false;
        }

    },

    /**
     * A private function that allows you to dynamically dot walk to any field from a GlideRecord Object
     *
     * @param {string} fieldName - A string that contains the dot-walked field needed
     * @param {object} obj - The object to dot-walk from
     * @return {string} The value of the field name
     *
     * @example
     *     
     *     var fieldName = "u_owning_group.manager";
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
     *       fieldValue = this._getValue(fieldName, grScCatItem);
     *     
     */
    _getValue: function(fieldName, obj) {

        var arrOfFields = fieldName.split(".");

        arrOfFields.forEach(function(key) {
            obj = obj[key];
        });

        return obj.getValue();

    },

    type: 'swissArmyUtil'
});
