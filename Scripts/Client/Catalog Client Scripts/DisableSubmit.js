// Disable Submit Button on Catalog Item
// 
// UI Type = All
// Type = onSubmit
// Applies on a Catalog Item View

function onSubmit() {
    // Disable Submit button if on the Expense Report Section or Lost Card Section

    var currentSection = g_form.getValue('ccSupOption');

    if (currentSection == 'expRep' || currentSection == 'lostCard') {
        return false;
    }

}
