buffer addMultiCAB( buffer result ) {
    // Initialize additional bars property
    string additionalBars = get_property("multiCAB_additionalBars");
    if (additionalBars == "") {
        additionalBars = "[12]";
        set_property("multiCAB_additionalBars", additionalBars);
    }

    matcher m = create_matcher( "actionbar\\.\\d+\\.js.+?<\\/script>" , result );
    if ( !m.find() ) return result;

    // Insert MultiCAB configuration
    int endOfActionbarScript = m.end();
    string multiCabConfigScript = "<script>multiCAB_additionalBars = " + additionalBars + ";</script>";
    result.insert(endOfActionbarScript, multiCabConfigScript);

    // Insert MultiCAB
    int endOfMultiCabConfigScript = endOfActionbarScript + length(multiCabConfigScript);
    string multiCabScript = "<script src='multicab.js'></script>";
    result.insert(endOfMultiCabConfigScript, multiCabScript);

    return result;
}

void main() {
    buffer result = visit_url();
    result = result.addMultiCAB();

    // Add doctype to escape quirks mode
    result.replace_string('<html>', '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n<html>');

    result.write();
}
