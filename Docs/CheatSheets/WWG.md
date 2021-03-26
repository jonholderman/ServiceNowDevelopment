# WWG Specific #

## Service Catalog ##

### Approval Field ###

* `Not Yet Requested` Used when there is no approval
* `Requested`, `Approved`, or `Rejected` Used when there is an approval

### Stage Field ###

#### Default Stages ####
* `Request Approved`
* `Waiting for Approval`
* `Fulfillment`
* `Delivery`
* `Request Item`
* `Request Cancelled`
* `Completed`

### State Field ###
This field is not out-of-box and it does not update based off of any conditions or triggers. It must be updated with the Set Values activity.
* `Open`
* `Work in Progress`
* `Closed Complete`
* `Cancelled`

### The Active Field ###
Using the `Set Values` Activity at the end of the workflow it should be set to `False`.

### Catalog Task Conditions ###
* Named `Closed Complete` with a condition of `activity.result==3`
* Named `Cancelled` with a condition of `activity.result==4`

## User Reference Variables ##
Reference Qualifer:
```javascript
javascript:gs.getProperty("specialUserIds");
```

Value Attributes: 
```
ref_auto_completer=AJAXTableCompleter,ref_ac_columns=user_name;email;title,ref_ac_columns_search=true,ref_ac_order_by=name
```
