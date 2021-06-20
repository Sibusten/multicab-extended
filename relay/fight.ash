buffer addMultiCAB( buffer result ) {
    matcher m = create_matcher( "actionbar\\.\\d+\\.js.+?<\\/script>" , result );
    if ( !m.find() ) return result;
    result.insert( m.end() , "<script src='MultiCAB.js'></script>" );
    return result;
}

void main() {
    buffer result = visit_url();
    result = result.addMultiCAB();

    // Add doctype to escape quirks mode
    result.replace_string('<html>', '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">\n<html>');

    result.write();
}
