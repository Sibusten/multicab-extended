function getCache(buttonraw) // replaces function of same name in actionbar.js
{
  var button = ( buttonraw - 1 ) % 12 + 1;
  var modpage = ( Math.floor( ( buttonraw - 1 ) / 12 ) + top.buttoncache.whichpage ) % 12;
	var nullcache = {type: null, id: null, pic: null};
	if (button < 1 || button > 12)
		return nullcache;
	if (state["shapeshift"])
	{
		var obj = shiftbar[button - 1];
		if (obj == null)
			return nullcache;
		else
		{
			if (typeof state[obj["type"] + "s"][obj["id"]] == "undefined")
				return nullcache;

			obj["pic"] = state[obj["type"] + "s"][obj["id"]]["pic"];
			return obj;
		}
	}
	else
		with (top.buttoncache)
		{
			var obj = pages[modpage][button - 1];
			if (obj == null)
				return nullcache;
			else
				return obj;
		}
}

function setCache(buttonraw, type, id, pic) // replaces function of same name in actionbar.js
{
  var button = ( buttonraw - 1 ) % 12 + 1;
  var modpage = ( Math.floor( ( buttonraw - 1 ) / 12 ) + top.buttoncache.whichpage ) % 12;
	var nullcache = {type: null, id: null, pic: null};
	if (button < 1 || button > 12)
		return null;
	if (state["shapeshift"])
		return null;
	with (top.buttoncache)
	{
		if (type == null && id == null && pic == "blank")
			pages[modpage][button - 1] = null;
		else
		{
			if (type == "action" && id == "attack")
				pic = state.actions.attack.pic;
			pages[modpage][button - 1] = {type: type, id: id, pic: pic};
		}
	}
}

function setPage(page)
{
	var img;
	if (page < 0 || page > 11)
		return;
	if (state["shapeshift"])
		page = 0;
	else
		top.buttoncache.whichpage = page;

	for (var i = 1; i <= state["totalbuttons"]; i++)
	{
		var cache = getCache(i);
		var button = document.getElementById('button' + i);
		if (cache)
			assignButton(button, cache["type"], cache["id"], cache["pic"]);
		else
			unassignButton(button);
	}

	if (state["funkslinging"])
		for (var i = 1; i <= 2; i++)
			if (img = state["ants" + i])
				img.style.display = state["funkpage" + i] == whichpage ? "inline" : "none";

	var pageout = document.getElementById('page_out');
	pageout.innerHTML = page + 1;
}

function addElement( parent , type , className , id ) {
  var el = document.createElement( type );
  if ( className != undefined ) el.className = className;
  if ( id ) el.id = id;
  parent.appendChild( el );
  return el;
}

function multiCAB_init() {
  state.totalbuttons = 24;
  var newtopbarheight = 110 + 'px';
  var topbar = document.getElementById('topbar');
  topbar.style.height = newtopbarheight;
  document.getElementById('content_').style.top = newtopbarheight;
  
  var actionbar = document.getElementsByClassName('actionbar')[0];
  var newbar = addElement( actionbar.firstChild , 'tr' , 'blueback');
  var newqty = addElement( actionbar.firstChild , 'tr' , 'label' );
  addElement( newbar , 'td' , 'spacer' ).colSpan = 4;
  addElement( newqty , 'td' , 'spacer' ).colSpan = 4;
  
  for ( var button_it = 1; button_it < 13; button_it++ ) {
    button_id = button_it + 12;
    state.buttonstate[ button_id ];
    var newButtonTD = addElement( newbar , 'td' );
    addElement( newqty , 'td' , '' , 'qty' + button_id ).style.height = '11px';
    var newButton = addElement( newButtonTD , 'img' , '' , 'button' + button_id );
    if (!state["shapeshift"])
    {
      dragdrop.addDrop(newButton);
      dragdrop.register(newButton);
    }
    newButton.onclick = buttonClick;
    newButton.oncontextmenu = buttonClick;
  }
}

multiCAB_init();