# xit-parse
A simple, plain JavaScript, program that parses [Xit files](https://xit.jotaen.net/). Written originally to be used in a desktop editor that I'm currently writing for desktop, web, and mobile.

It deviates just a little bit from the spec (included in this repo for convenience), but only to the extent that I find acceptable.

To use, simply add `xit-parse` to your `package.json`, then add:
`import * as xit from 'xit-parse'` to your code. From there, you can use any of the exposed functions or constants, like so: `xit.toObject(...)`

There are two methods exposed:
* `toObject`: Given an Xit string (assuming you have already read the file to a variable), this returns the Xit string represented as an Object.
* `toString`: Given the Xit string represented as an Object, this returns the Xit as a string, that can be written to file. 
 
There are also a number of constants exposed, whether you find them useful is up to you:
```
    toObject,
    toString,
    xitLineTypePatterns,
    xitItemStatusDelimiterPatterns,
    xitLineModifierPatterns,
    TITLE_TYPE,
    ITEM_TYPE,
    ITEM_LEFT_SYM,
    ITEM_RIGHT_SYM,
    ITEM_STATUS_OPEN,
    ITEM_STATUS_OPEN_SYM,
    ITEM_STATUS_CHECKED,
    ITEM_STATUS_CHECKED_SYM,
    ITEM_STATUS_ONGOING,
    ITEM_STATUS_ONGOING_SYM,
    ITEM_STATUS_OBSOLETE,
    ITEM_STATUS_OBSOLETE_SYM,
    ITEM_STATUS_IN_QUESTION,
    ITEM_STATUS_IN_QUESTION_SYM,
    ITEM_DETAILS_TYPE,
    NEWLINE_TYPE,
    PRIORITY_MOD_TYPE,
    DUE_DATE_MOD_TYPE,
    TAG_MOD_TYPE
```
# Output Example

When `toObject` is called on the following *.xit file (A book reading list, as an example), you can expect the following object (stringified for your reading convenience)

**The Xit file:**

```
Books I Am Reading
[@] !!!! Lord of Chaos #jordan #fantasy -> 2023
[@] ...! Cibola Burn #scifi #corey

Books I Have Read
[x] The Tao of Pooh #philosophy

Books I Want to Read
[?] The Way of Kings #sanderson #fantasy
[~] Infinite Jest #fiction
```

**The Output:**

```
{
  "groups": {
    "bada0924-202c-4adb-9bdf-151057c8ef71": [
      {
        "type": "title",
        "status": null,
        "content": "Books I Am Reading",
        "rawContent": "Books I Am Reading",
        "modifiers": null,
        "groupID": "bada0924-202c-4adb-9bdf-151057c8ef71"
      },
      {
        "type": "item",
        "status": "ongoing",
        "content": "Lord of Chaos",
        "rawContent": "[@] !!!! Lord of Chaos #jordan #fantasy -> 2023",
        "modifiers": {
          "hasPriority": true,
          "due": "2023",
          "tags": [
            "#jordan",
            "#fantasy"
          ]
        },
        "groupID": "bada0924-202c-4adb-9bdf-151057c8ef71"
      },
      {
        "type": "item",
        "status": "ongoing",
        "content": "Cibola Burn",
        "rawContent": "[@] ...! Cibola Burn #scifi #corey",
        "modifiers": {
          "hasPriority": true,
          "due": null,
          "tags": [
            "#scifi",
            "#corey"
          ]
        },
        "groupID": "bada0924-202c-4adb-9bdf-151057c8ef71"
      }
    ],
    "289ce5f4-c1b5-4320-baff-028d104382fa": [
      {
        "type": "title",
        "status": null,
        "content": "Books I Have Read",
        "rawContent": "Books I Have Read",
        "modifiers": null,
        "groupID": "289ce5f4-c1b5-4320-baff-028d104382fa"
      },
      {
        "type": "item",
        "status": "checked",
        "content": "The Tao of Pooh",
        "rawContent": "[x] The Tao of Pooh #philosophy",
        "modifiers": {
          "hasPriority": false,
          "due": null,
          "tags": [
            "#philosophy"
          ]
        },
        "groupID": "289ce5f4-c1b5-4320-baff-028d104382fa"
      }
    ],
    "833b7cbe-dffd-441c-9452-8cf990ad12cb": [
      {
        "type": "title",
        "status": null,
        "content": "Books I Want to Read",
        "rawContent": "Books I Want to Read",
        "modifiers": null,
        "groupID": "833b7cbe-dffd-441c-9452-8cf990ad12cb"
      },
      {
        "type": "item",
        "status": "in-question",
        "content": "The Way of Kings",
        "rawContent": "[?] The Way of Kings #sanderson #fantasy",
        "modifiers": {
          "hasPriority": false,
          "due": null,
          "tags": [
            "#sanderson",
            "#fantasy"
          ]
        },
        "groupID": "833b7cbe-dffd-441c-9452-8cf990ad12cb"
      },
      {
        "type": "item",
        "status": "obsolete",
        "content": "Infinite Jest",
        "rawContent": "[~] Infinite Jest #fiction",
        "modifiers": {
          "hasPriority": false,
          "due": null,
          "tags": [
            "#fiction"
          ]
        },
        "groupID": "833b7cbe-dffd-441c-9452-8cf990ad12cb"
      }
    ]
  }
}
```