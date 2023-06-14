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
# Output Example

When `toObject` is called on the following *.xit file (A book reading list, as an example), you can expect the following object (stringified for your reading convenience)

**The Xit file:**

```
Books I Am Reading
[@] ! Lord of Chaos #jordan #fantasy -> 2023
[@] Cibolla Burn #scifi #corey

Books I Have Read
[x] The Tao of Pooh #philosophy

Books I Want to Read
[ ] The Way of Kings #sanderson #fantasy
[~] Infinite Jest #fiction
```

**The Output:**

```{
  "groups": {
    "74fbedf1-1235-4af1-b88e-7652bbd19937": [
      {
        "type": "title",
        "status": null,
        "content": "Books I Am Reading",
        "modifiers": null,
        "groupID": "74fbedf1-1235-4af1-b88e-7652bbd19937"
      },
      {
        "type": "item",
        "status": "ongoing",
        "content": "[@] ! Lord of Chaos #jordan #fantasy -> 2023",
        "modifiers": {
          "hasPriority": true,
          "due": "2023",
          "tags": [
            "#jordan",
            "#fantasy"
          ]
        },
        "groupID": "74fbedf1-1235-4af1-b88e-7652bbd19937"
      },
      {
        "type": "item",
        "status": "ongoing",
        "content": "[@] Cibolla Burn #scifi #corey",
        "modifiers": {
          "hasPriority": false,
          "due": null,
          "tags": [
            "#scifi",
            "#corey"
          ]
        },
        "groupID": "74fbedf1-1235-4af1-b88e-7652bbd19937"
      }
    ],
    "25843d77-142c-40fb-8759-5a37f29c3783": [
      {
        "type": "title",
        "status": null,
        "content": "Books I Have Read",
        "modifiers": null,
        "groupID": "25843d77-142c-40fb-8759-5a37f29c3783"
      },
      {
        "type": "item",
        "status": "checked",
        "content": "[x] The Tao of Pooh #philosophy",
        "modifiers": {
          "hasPriority": false,
          "due": null,
          "tags": [
            "#philosophy"
          ]
        },
        "groupID": "25843d77-142c-40fb-8759-5a37f29c3783"
      }
    ],
    "bc578598-f9d3-4146-a366-558679cc2594": [
      {
        "type": "title",
        "status": null,
        "content": "Books I Want to Read",
        "modifiers": null,
        "groupID": "bc578598-f9d3-4146-a366-558679cc2594"
      },
      {
        "type": "item",
        "status": "open",
        "content": "[ ] The Way of Kings #sanderson #fantasy",
        "modifiers": {
          "hasPriority": false,
          "due": null,
          "tags": [
            "#sanderson",
            "#fantasy"
          ]
        },
        "groupID": "bc578598-f9d3-4146-a366-558679cc2594"
      },
      {
        "type": "item",
        "status": "obsolete",
        "content": "[~] Infinite Jest #fiction",
        "modifiers": {
          "hasPriority": false,
          "due": null,
          "tags": [
            "#fiction"
          ]
        },
        "groupID": "bc578598-f9d3-4146-a366-558679cc2594"
      }
    ]
  }
}```