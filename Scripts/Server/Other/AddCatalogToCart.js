// 1. Creates a new cart and names it the value of a new CartID
var cartId = GlideGuid.generate(null);
var cart = new Cart(cartId);

// 2. Adds the form Catalog Form to the cart
var item = cart.addItem(gs.getProperty('SYSIDOFCATALOGFORM'));

// 3. Answers the majority of the questions and adds the info from the Incident form into the SC form
cart.setVariable(item, 'ri_requester_is_recipient', 'No');
cart.setVariable(item, 'ri_no_user', 'Yes');
cart.setVariable(item, 'ri_recipient', openedBy);
cart.setVariable(item, 'description', scDisplay + " Audit - Manual Review");
cart.setVariable(item, 'workgroup', gs.getProperty('SYSIDOFGROUP'));
cart.setVariable(item, 'closeTask', 'No');
cart.setVariable(item, 'comments', comments);

// 4. Gets the cart, sets the Requested For as the Caller, updates the cart
var cartGR = cart.getCart();
cartGR.requested_for = openedBy;
cartGR.update();

// 5. Submits the RITM/cart
var rc = cart.placeOrder();
