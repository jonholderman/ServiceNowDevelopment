var cmdbUtil = Class.create();

cmdbUtil.prototype = {

    initialize: function() {

    },

    /**
     * A function that creates a dynamic query filter string to show all server configuration items.
     * 
     * @param {boolean} [showOnlyOperational=false] - Show Only Configuration Items that are in 'Operational', 'Repair in Progress' or 'DR Standby'.
     * @return {string} - A Dynamic Filter Query String.
     * @example javascript: new cmdbUtil().getAllServerConfigurationItems(false);
     */
    getAllServerConfigurationItems: function(showOnlyOperational) {

      // Set Default Value for 'showOnlyOperational' Parameter -- Pre ES2015
      showOnlyOperational = typeof showOnlyOperational !== 'undefined' ? showOnlyOperational : false;

      // Returns a Java ArrayList of all classes participating in the hierarchy of the Server Table
      var serverTable = new TableUtils("cmdb_ci_server");
      var serverTablesList = serverTable.getAllExtensions();

      // Returns a Java ArrayList of all classes participating in the hierarchy of the Virtual Object Table
      var vServerTable = new TableUtils("cmdb_ci_vm_object");
      var vServerTablesList = vServerTable.getAllExtensions();

      // Converts a java object from system code to a JavaScript object
      gs.include("j2js");

      // Convert to Javascript Array
      var serverTables = j2js(serverTablesList);
      var vServerTables = j2js(vServerTablesList);
		
      // Concatenate the Server Table Array and the Virtual Server Table Array
      var allServerTables = serverTables.concat(vServerTables);

      var filter = "";

      // Loop Through All Server Tables and Create Dynamic Query Filter String
      for (var i = 0; i < allServerTables.length; i++) {

          // If this is the last iteration
          if ((i + 1) == (serverTables.length)) {

              filter += "sys_class_name=" + serverTables[i];

          } else {

              filter += "sys_class_name=" + serverTables[i] + "^OR";

          }

      }

      if (showOnlyOperational) {
          filter += "^operational_statusIN1,3,4";
      }

      return filter;

    },

    type: 'cmdbUtil'
};
