// replaces function of same name in actionbar.js
function getCache(buttonraw) {
    var button = (buttonraw - 1) % 12 + 1; // NEW LINE
    var modpage = (Math.floor((buttonraw - 1) / 12) + top.buttoncache.whichpage) % 12; // NEW LINE
    var nullcache = { type: null, id: null, pic: null };
    if (button < 1 || button > 12)
        return nullcache;
    if (state["shapeshift"]) {
        var obj = shiftbar[button - 1];
        if (obj == null)
            return nullcache;
        else {
            if (typeof state[obj["type"] + "s"][obj["id"]] == "undefined")
                return nullcache;

            obj["pic"] = state[obj["type"] + "s"][obj["id"]]["pic"];
            return obj;
        }
    }
    else
        with (top.buttoncache) {
            var obj = pages[modpage][button - 1];  // MODIFIED LINE
            if (obj == null)
                return nullcache;
            else
                return obj;
        }
}

// replaces function of same name in actionbar.js
function setCache(buttonraw, type, id, pic) {
    var button = (buttonraw - 1) % 12 + 1; // NEW LINE
    var modpage = (Math.floor((buttonraw - 1) / 12) + top.buttoncache.whichpage) % 12; // NEW LINE
    var nullcache = { type: null, id: null, pic: null };
    if (button < 1 || button > 12)
        return null;
    if (state["shapeshift"])
        return null;
    with (top.buttoncache) {
        if (type == null && id == null && pic == "blank")
            pages[modpage][button - 1] = null;  // MODIFIED LINE
        else {
            if (type == "action" && id == "attack")
                pic = state.actions.attack.pic;
            pages[modpage][button - 1] = { type: type, id: id, pic: pic };  // MODIFIED LINE
        }
    }
}

// replaces function of same name in actionbar.js
function setPage(page) {
    var img;
    if (page < 0 || page > 11)
        return;
    if (state["shapeshift"])
        page = 0;
    else
        top.buttoncache.whichpage = page;

    for (var i = 1; i <= state["totalbuttons"]; i++) { // MODIFIED LINE
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

function addElement(parent, type, className, id) {
    var el = document.createElement(type);
    if (className != undefined) el.className = className;
    if (id) el.id = id;
    parent.appendChild(el);
    return el;
}

const buttonsPerBar = 12;

const multiCAB_repositionSkillsAndItems = (function() {
    // Store skills and items buttons to simplify repositioning
    const skillsButton = document.getElementById('skills');
    const itemsButton = document.getElementById('items');

    const skillsIndex = 2;
    const itemsIndex = 18;

    return function() {
        // Get the action bar table
        const actionBarTable = document.getElementsByClassName('actionbar')[0].firstChild;

        // Place spacers in all rows but the last two, which hold the last action bar
        const totalRows = actionBarTable.childNodes.length;
        const lastActionRowIndex = totalRows - 2;
        for (let row = 0; row < lastActionRowIndex; row++) {
            actionBarTable.children[row].children[skillsIndex].className = 'spacer';
            actionBarTable.children[row].children[skillsIndex].innerHTML = '';

            actionBarTable.children[row].children[itemsIndex].className = 'spacer';
            actionBarTable.children[row].children[itemsIndex].innerHTML = '';
        }

        const lastLabelRowIndex = lastActionRowIndex + 1;

        // Add the skills button to the bottom bar
        actionBarTable.children[lastActionRowIndex].children[skillsIndex].className = '';
        actionBarTable.children[lastActionRowIndex].children[skillsIndex].appendChild(skillsButton);
        actionBarTable.children[lastLabelRowIndex].children[skillsIndex].innerHTML = 'skills';

        // Add the items button to the bottom bar
        actionBarTable.children[lastActionRowIndex].children[itemsIndex].className = '';
        actionBarTable.children[lastActionRowIndex].children[itemsIndex].appendChild(itemsButton);
        actionBarTable.children[lastLabelRowIndex].children[itemsIndex].innerHTML = 'items';
    }
})();

function multiCAB_addActionBar(barIndex) {
    // Get the action bar holder
    var actionbar = document.getElementsByClassName('actionbar')[0];

    // Add a new bar and quantity
    var newbar = addElement(actionbar.firstChild, 'tr', 'blueback');
    var newqty = addElement(actionbar.firstChild, 'tr', 'label');

    // Add a spacer for the script button
    addElement(newbar, 'td', 'spacer');
    addElement(newqty, 'td', 'spacer');

    // Add a spacer after the script button
    addElement(newbar, 'td', 'spacer');
    addElement(newqty, 'td', 'spacer');

    // Add spacers for the skills button
    addElement(newbar, 'td', 'spacer');
    addElement(newqty, 'td', 'spacer');

    // Add a spacer after the skills button
    addElement(newbar, 'td', 'spacer');
    addElement(newqty, 'td', 'spacer');

    // Add the new buttons
    const startingButtonNum = barIndex * buttonsPerBar + 1;
    for (var buttonNum = startingButtonNum; buttonNum < startingButtonNum + buttonsPerBar; buttonNum++) {
        state.buttonstate[buttonNum];
        var newButtonTD = addElement(newbar, 'td');
        addElement(newqty, 'td', '', 'qty' + buttonNum).style.height = '11px';
        var newButton = addElement(newButtonTD, 'img', '', 'button' + buttonNum);
        if (!state["shapeshift"]) {
            dragdrop.addDrop(newButton);
            dragdrop.register(newButton);
        }
        newButton.onclick = buttonClick;
        newButton.oncontextmenu = buttonClick;
    }

    // Add a spacer for the page up/down arrows
    addElement(newbar, 'td', 'spacer');
    addElement(newqty, 'td', 'spacer');

    // Add a spacer before the items button
    addElement(newbar, 'td', 'spacer');
    addElement(newqty, 'td', 'spacer');

    // Add a spacer for the items button
    addElement(newbar, 'td', 'spacer');
    addElement(newqty, 'td', 'spacer');
}

function multiCAB_init() {
    // Set the total button count
    const barCount = 2;
    state.totalbuttons = barCount * buttonsPerBar;

    // Calculate the height of the top bar
    const skillRowHeight = 36;  // The size of the skill boxes
    const labelRowHeight = 12;  // The size of the labels above and below skill boxes
    const bottomSpacingHeight = 6;  // Extra spacing before the combat body
    const topBarHeight =
        labelRowHeight  // The hotkey numbers above the first action bar
        + barCount * (skillRowHeight + labelRowHeight)  // The size of all bars
        + bottomSpacingHeight;  // Extra spacing at the bottom

    // Expand the top bar to fit the second action bar
    var topbar = document.getElementById('topbar');
    topbar.style.height = topBarHeight + 'px';
    document.getElementById('content_').style.top = topBarHeight + 'px';

    // Add the second action bar
    multiCAB_addActionBar(1);

    multiCAB_repositionSkillsAndItems();
}

multiCAB_init();
