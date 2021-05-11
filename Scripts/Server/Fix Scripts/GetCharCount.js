// A one time use script that generates a CSV file of before and after character lengths when removing HTML from Project Status fields
//
// Note: Change the SysID '21c686781ba3a090c998a6c8ec4bcb45' to where you would like the attachment file to be generated
// Note: Functions and script are hard coded for certain fields, adjust array of fields to accomidate other use cases
//

/**
 * Helper function to get the character length of a string
 * @param {string} stringInput - Input string to get the character count of
 * @returns {integer} Character count of input string
 */
function getCharCount(stringInput) {

    if (stringInput != null) {

        return stringInput.length

    } else {

        return 0;

    }

}

/**
 * Helper function to remove HTML from a string using REGEX
 * @param {string} stringInput - Input string to remove HTML from
 * @returns {string} Input string with HTML removed
 */
function stripHTML(stringInput) {

    var stringOutput = "";

    if (stringInput != null) {

        stringOutput = stringInput.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");

    }

    return stringOutput;

}

/**
 * Helper function to subtract two integers
 * @param {integer} before - The character count before removing HTML tags
 * @param {integer} after - The character count after removing HTML tags
 * @returns {integer} The difference of before and after
 */
function getDifference(before, after) {

    return before - after;

}

/**
 * Generates a Commad deliminated string to be used to generate a CSV file
 * @param {object} objPrjStatus - An object of fields to create a comma deliminated string from
 * @returns {string} A comma deliminated string of rows
 */
function generateDataRow(objPrjStatus) {

    var arrFields = ["executiveSummary", "comments", "achievementsLastWeek", "keyActivitiesNextWeek", "scheduleComments", "costComments", "resourcesComments", "scopeComments"];
    var prjNumber = objPrjStatus.number;

    var csvDataRow = prjNumber;

    arrFields.forEach(function(fieldName) {
        
        var before = objPrjStatus.fields[fieldName].beforeCharCount;
        var after = objPrjStatus.fields[fieldName].afterCharCount;
        var difference = getDifference(before, after);

        csvDataRow += "," + before + "," + after + "," + difference;

    });

    csvDataRow += "\r\n";

    return csvDataRow;

}

/**
 * Creates a Project Status Object of specific fields
 * @returns {array} An array of objects of project status fields
 */
function createPrjStatusObj() {

    var arrPrjStatuses = [];

    var grProjectStatus = new GlideRecord('project_status');
    grProjectStatus.query();
    while (grProjectStatus.next()) {
    
        var projectStatusNumber = grProjectStatus.getValue('number');
    
        // Overall Status Tab
        var executiveSummary = grProjectStatus.getValue('executive_summary');
        var cleanExecutiveSummary = stripHTML(executiveSummary);
    
        var comments = grProjectStatus.getValue('comments');
        var cleanComments = stripHTML(comments);
    
        var achievementsLastWeek = grProjectStatus.getValue('achievements_last_week');
        var cleanAchievementsLastWeek = stripHTML(achievementsLastWeek);
    
        var keyActivitiesNextWeek = grProjectStatus.getValue('key_activities_next_week');
        var cleanKeyActivitiesNextWeek = stripHTML(keyActivitiesNextWeek);
    
        // Schedule Tab
        var scheduleComments = grProjectStatus.getValue('schedule_comments');
        var cleanScheduleComments = stripHTML(scheduleComments);
    
        // Cost Tab
        var costComments = grProjectStatus.getValue('cost_comments');
        var cleanCostComments = stripHTML(costComments);
    
        // Resources Tab
        var resourcesComments = grProjectStatus.getValue('resources_comments');
        var cleanResourcesComments = stripHTML(resourcesComments);
    
        // Scope Tab
        var scopeComments = grProjectStatus.getValue('scope_comments');
        var cleanScopeComments = stripHTML(scopeComments);
    
        var objPrjStatus = {
            number: projectStatusNumber,
            fields: {
                executiveSummary: {
                    beforeCharCount: getCharCount(executiveSummary),
                    afterCharCount: getCharCount(cleanExecutiveSummary),
                    beforeValue: executiveSummary,
                    afterValue: cleanExecutiveSummary
                },
                comments: {
                    beforeCharCount: getCharCount(comments),
                    afterCharCount: getCharCount(cleanComments),
                    beforeValue: comments,
                    afterValue: cleanComments
                },
                achievementsLastWeek: {
                    beforeCharCount: getCharCount(achievementsLastWeek),
                    afterCharCount: getCharCount(cleanAchievementsLastWeek),
                    beforeValue: achievementsLastWeek,
                    afterValue: cleanAchievementsLastWeek
                },
                keyActivitiesNextWeek: {
                    beforeCharCount: getCharCount(keyActivitiesNextWeek),
                    afterCharCount: getCharCount(cleanKeyActivitiesNextWeek),
                    beforeValue: keyActivitiesNextWeek,
                    afterValue: cleanKeyActivitiesNextWeek
                },
                scheduleComments: {
                    beforeCharCount: getCharCount(scheduleComments),
                    afterCharCount: getCharCount(cleanScheduleComments),
                    beforeValue: scheduleComments,
                    afterValue: cleanScheduleComments
                },
                costComments: {
                    beforeCharCount: getCharCount(costComments),
                    afterCharCount: getCharCount(cleanCostComments),
                    beforeValue: costComments,
                    afterValue: cleanCostComments
                },
                resourcesComments: {
                    beforeCharCount: getCharCount(resourcesComments),
                    afterCharCount: getCharCount(cleanResourcesComments),
                    beforeValue: resourcesComments,
                    afterValue: cleanResourcesComments
                },
                scopeComments: {
                    beforeCharCount: getCharCount(scopeComments),
                    afterCharCount: getCharCount(cleanScopeComments),
                    beforeValue: scopeComments,
                    afterValue: cleanScopeComments
                }
            }
        };
    
        arrPrjStatuses.push(objPrjStatus);

    }

    return arrPrjStatuses;

}

var arrPrjStatuses = createPrjStatusObj();

// Generate CSV Header
var arrFields = ["executiveSummary", "comments", "achievementsLastWeek", "keyActivitiesNextWeek", "scheduleComments", "costComments", "resourcesComments", "scopeComments"];
var csvHeader = "projectNumber";

arrFields.forEach(function(fieldName) {
    
    var before = fieldName + "Before"
    var after = fieldName + "After"
    var difference = fieldName + "Diff"

    csvHeader += "," + before + "," + after + "," + difference;

});

csvHeader += "\r\n";

// Generate CSV Data Row
var csvData = "";

for (var i = 0; i < arrPrjStatuses.length; i++) {

    var objPrjStatus = arrPrjStatuses[i];

    csvData += generateDataRow(objPrjStatus);

}

// Join CSV Header and CSV Data
var csvAttachment = csvHeader + csvData;

var grIncident = new GlideRecord('incident');
if (grIncident.get('21c686781ba3a090c998a6c8ec4bcb45')) {

    var grAttachment = new GlideSysAttachment();
    grAttachment.write(grIncident, "ProjectStatusResults.csv", 'application/csv', csvAttachment);

}
