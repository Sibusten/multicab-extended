// Wrap the original function from actionbar.js
getCache = (function() {
    const original_getCache = getCache;

    return function(button) {
        // Translate the global button number into a row-specific button number
        rowButton = (button - 1) % 12 + 1;

        // Temporarily override the active page
        const savedWhichpage = tp.buttoncache.whichpage;
        const clickedPage = (Math.floor((button - 1) / 12) + savedWhichpage) % 12;
        tp.buttoncache.whichpage = clickedPage;

        try {
            return original_getCache(rowButton);
        }
        finally {
            // Restore the original page
            tp.buttoncache.whichpage = savedWhichpage;
        }
    }
})();

// Wrap the original function from actionbar.js
setCache = (function() {
    const original_setCache = setCache;

    return function(button, type, id, pic) {
        // Translate the global button number into a row-specific button number
        rowButton = (button - 1) % 12 + 1;

        // Temporarily override the active page
        const savedWhichpage = tp.buttoncache.whichpage;
        const clickedPage = (Math.floor((button - 1) / 12) + savedWhichpage) % 12;
        tp.buttoncache.whichpage = clickedPage;

        try {
            return original_setCache(rowButton, type, id, pic);
        }
        finally {
            // Restore the original page
            tp.buttoncache.whichpage = savedWhichpage;
        }
    }
})();

// Wrap the original function from actionbar.js
setPage = (function() {
    const original_setPage = setPage;

    return function(page) {
        // Temporarily override the number of buttons so setPage will initialize all of the extra buttons as well
        const savedButtonmax = tp.buttoncache.buttonmax;
        const totalButtons = state.barCount * state.buttonsPerBar;
        state.buttonmax = totalButtons;

        try {
            return original_setPage(page);
        }
        finally {
            // Restore the original buttonmax
            state.buttonmax = savedButtonmax;
        }
    }
})();

function addElement(parent, type, className, id) {
    var el = document.createElement(type);
    if (className != undefined) el.className = className;
    if (id) el.id = id;
    parent.appendChild(el);
    return el;
}

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
    const startingButtonNum = barIndex * state.buttonsPerBar + 1;
    for (var buttonNum = startingButtonNum; buttonNum < startingButtonNum + state.buttonsPerBar; buttonNum++) {
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
    // Store the number of buttons per bar separately, since buttonmax will be overridden in some methods. This cannot be modified.
    state.buttonsPerBar = state.buttonmax;

    // Set the number of bars to show, including the original bar
    state.barCount = 8;

    // Calculate the height of the top bar
    const skillRowHeight = 36;  // The size of the skill boxes
    const labelRowHeight = 12;  // The size of the labels above and below skill boxes
    const bottomSpacingHeight = 6;  // Extra spacing before the combat body
    const topBarHeight =
        labelRowHeight  // The hotkey numbers above the first action bar
        + state.barCount * (skillRowHeight + labelRowHeight)  // The size of all bars
        + bottomSpacingHeight;  // Extra spacing at the bottom

    // Expand the top bar to fit the second action bar
    var topbar = document.getElementById('topbar');
    topbar.style.height = topBarHeight + 'px';
    document.getElementById('content_').style.top = topBarHeight + 'px';

    // Add the additional action bars
    for (let barIndex = 1; barIndex < state.barCount; barIndex++) {
        multiCAB_addActionBar(barIndex);
    }

    multiCAB_repositionSkillsAndItems();
}

multiCAB_init();
