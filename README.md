# xit-parse
A simple, plain JavaScript, program that parses [Xit files](https://xit.jotaen.net/). Written originally to be used in a desktop editor that I'm currently writing for desktop, web, and mobile.

It deviates just a little bit from the spec (included in this repo for convenience), but only to the extent that I find acceptable.

There are two methods exposed:
* `toObject`: Given an Xit string (assuming you have already read the file to a variable), this returns the Xit string represented as an Object.
* `toString`: Given the Xit string represented as an Object, this returns the Xit as a string, that can be written to file.

There are also a number of constants exposed, whether you find them useful is up to you:
``` 
    xitLineTypePatterns,
    xitLineModifierPatterns,
    TITLE_TYPE,
    ITEM_TYPE,
    ITEM_STATUS_OPEN,
    ITEM_STATUS_CHECKED,
    ITEM_STATUS_ONGOING,
    ITEM_STATUS_OBSOLETE,
    ITEM_DETAILS_TYPE,
    NEWLINE_TYPE,
    PRIORITY_MOD_TYPE,
    DUE_DATE_MOD_TYPE,
    TAG_MOD_TYPE
```
