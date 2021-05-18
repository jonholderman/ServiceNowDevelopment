// Attachments Deal with Two Tables: Attachments 'sys_attachment' and Attachment Documents 'sys_attachment_doc'
// The 'Attachments' Table, Holds the Record with some metadata (File Name, Content Type, and Size)
// The 'Attachment Documents' Table, Holds the Actual Binary Data of the File which is Split into 4KB chunks
// 
// GlideSysAttachment.copy(), unfortunately copies over ALL Attachments on a Record. The Below Functions will Allow you to Target a Single Attachment to Copy Over.
//
// ## Usage ##
//
//	var copySingleAttachment = new CopySingleAttachment();
//	// copyAttachment(fileName, sourceTable, sourceTableSysID, recipientTable, recipientTableSysID)
//	copySingleAttachment.copyAttachment("Phone Setup Detailed Instructions.pdf", "sc_cat_item", gs.getProperty('Mobile Phone Setup Instructions'), "sc_req_item", current.sys_id);

var CopySingleAttachment = Class.create();
CopySingleAttachment.prototype = {

	initialize: function() {
		
	},
	
    copyAttachment: function(fileName, sourceTable, sourceTableSysID, targetTable, targetTableSysID) {

        // Initialize Function Variables
        var sourceAttachmentSysID;
        var newAttachmentRecord;
        var attachmentDataRecord;
        var newDocumentRecord;

        // Get Attachment
        var attachmentRecord = new GlideRecord('sys_attachment');
        attachmentRecord.addQuery('table_name', sourceTable);
        attachmentRecord.addQuery('table_sys_id', sourceTableSysID);
        attachmentRecord.addQuery('file_name', fileName);
        attachmentRecord.query();

        while (attachmentRecord.next()) {

            // Create Attachment Stub for Recipent Table
            sourceAttachmentSysID = attachmentRecord.getValue('sys_id');
            newAttachmentRecord = this.copyRecord(attachmentRecord);
            newAttachmentRecord.setValue('table_name', targetTable);
            newAttachmentRecord.setValue('table_sys_id', targetTableSysID);
            newAttachmentRecord.update();

            // Copy Attachment Contents to 'sys_attachment_doc' table
            attachmentDataRecord = new GlideRecord('sys_attachment_doc');
            attachmentDataRecord.addQuery('sys_attachment', sourceAttachmentSysID);
            attachmentDataRecord.query();

            while (attachmentDataRecord.next()) {

                newDocumentRecord = this.copyRecord(attachmentDataRecord);
                newDocumentRecord.setValue('sys_attachment', newAttachmentRecord.getValue('sys_id'));
                newDocumentRecord.update();

            }

        }

    },

    copyRecord: function(record) {

        // Initialize Function Variables
        var recordElement;
        var recordElementName;
        var recordTable = record.getTableName();
        var recordFields = record.getFields();
        var newRecord = new GlideRecord(recordTable);

        newRecord.initialize();

        // Loop Through All Records for the Attachment
        for (var i = 0; i < recordFields.size(); i++) {

            recordElement = recordFields.get(i);

            // Dont Copy Over 'sys_id' or 'number' field names
            if (recordElement.getName() != 'sys_id' && recordElement.getName() != 'number') {

                recordElementName = recordElement.getName();
                newRecord.setValue(recordElementName, record.getValue(recordElementName));

            }

        }

        var newSysId = newRecord.insert();
        return newRecord;


    },

    type: 'CopySingleAttachment'
};
