buffer addMultiCAB( buffer result ) {
  matcher m = create_matcher( "actionbar\.20140514\.js'></script>" , result );
  if ( !m.find() ) return result;
  result.insert( m.end() , "<script src='MultiCAB.js'></script>" );
  return result;
}

void main() {
	buffer result = visit_url();
  result = result.addMultiCAB();
  result.write();
}