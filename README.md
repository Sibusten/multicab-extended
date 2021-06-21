# MultiCAB Extended

A KoLmafia script to add additional combat action bars, based on the original [MultiCAB](https://kolmafia.us/threads/multicab-show-an-extra-combat-action-bar.19907/) by darkcodelagsniper.

## Installation

To install MultiCAB Extended, run the following from the Graphical CLI:

```
svn checkout https://github.com/Sibusten/multicab-extended/trunk/release
```

***This script overrides fight.php and it is possible you already have a fight.ash relay override!***

If this is the case you will get a warning about overwriting files when you install, and be asked if you want to overwrite the old `fight.ash`.
If you don't get that warning then you can ignore the following.

If you want to keep the function of multiple fight.ash scripts you need to manually edit your copy of fight.ash to contain and call the relevant functions from both scripts.
So you would need to copy the addMultiCAB() function into your fight.ash, and your main function would look something like:

```
void main() {
     buffer page = visit_url();
     
     // Other scripts functions that modify the page can go here.
     
     page = page.addMultiCAB();
     
     // Other scripts functions that modify the page can go here too.
     
     page.write();
}
```

## Configuration

The additional bars can be configured with the `multiCAB_additionalBars` property in KoLmafia. It is an array with bar numbers (1 through 12) in the order they should appear below the original bar.

For example, run the following in the CLI to add bars 11 and 12:

```
set multiCAB_additionalBars = [11, 12]
```

The additional bars can also be disabled:

```
set multiCAB_additionalBars = []
```
