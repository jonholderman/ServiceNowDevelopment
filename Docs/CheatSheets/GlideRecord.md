<!-- TODO -->

## Dot Walking Best Practices

Avoid | Prefer
--- | ---
gr.sys_id | gr.getUniqueValue()
gr.short_description | gr.getDisplayValue('short_description')
gr.caller_id.name | gr.getDisplayValue('caller_id')
gr.caller_id.manager.name | gr.caller_id.manager.getDisplayValue()