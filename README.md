# Xit-Parse
A JavaScript library that can parse [Xit files](https://xit.jotaen.net/). 
The primary purpose of this library is to output Xit file contents into JSON, or create Xit-formatted data from JSON.

# Getting Started
The easiest way to use xit-parse is with [Node](https://nodejs.org/en). Once Node is installed on your system, and you have a project with a `package.json` file created ([npm-init documentation](https://docs.npmjs.com/cli/v10/commands/npm-init)), do the following:

#### Install the Library
In the working directory of your project, run `npm i xit-parse` in a command prompt or terminal

#### Import the Library
Add `import * as xit from 'xit-parse'` to your code. From there, you can use any of the exposed functions or constants, described below, like so: `xit.toObject(...)`.

# Usage

There are two functions exposed:
* `toObject`: Given an Xit string (assuming you have already read the file to a variable, or have the string in memory), this returns the Xit string represented as an Object.
* `toString`: Given the Xit string represented as an Object, this returns the Xit as a string, that can then be written to file.

***Note***: The [schema](https://json-schema.org/) (or shape) of this Object is described below, and must be followed if you plan to use `toString`. I am considering creating functions to construct Xit Objects to make it easier in the future.

## Overview of Expected JSON Schema
#### Overview
Xit-parse breaks up an Xit file into groups. Xit groups are a title line, followed by any number of items and their details. 

In the JSON Schema, A ***group*** is an object that maps unique group name strings to arrays of objects describing each line in that group of Xit data from top to bottom.

Within that **group** should be an array of group items. An **item** is a line in an Xit file that has a **status** (open, in-progress, etc.), **type** (title, item, item-details), **content** (plain content, no modifiers or status data), **rawContent** (raw, unformatted content - the original xit as written), **modifiers** (priority, due date, etc.), and **groupID**. The **groupID** is that unique group name, so that each line can refer to the group it belongs to. 

The next section will discuss **item** properties (status, type, and so on) in detail.

#### Item Properties
* `type <string>`: The type of item. A group title, item, or item details.
* `status <string|null>`: If the item `type` is `title`, this should be null. Otherwise it is the status of the item. See *Exposed Constants and Objects* below for valid statuses.
* `content <string>`: The content of the line, but without modifiers, status indicators, or any other Xit-specific markup
* `rawContent <string>`: The *raw, unmodified* content of the Xit line. This is the Xit line as-written.
* `modifiers <object|null>`: An object containing modifiers of the item if it is not a title type, otherwise this is null. Valid properties:
  * `hasPriority <bool>`: True if the xit line has any `!` priority indicators.
  * `priorityLevel <number>`: The number of `!` priority indicators the line contains.
  * `priorityPadding <number>`: The number of `.` priority padding indicators preceding the first `!` priority indicator
  * `due <string>`: The due date. A `->` in Xit, followed by a valid date format. (See [Xit syntax](https://xit.jotaen.net/syntax-guide) for details)
  * `tags <array<string>>`: An array of strings listing the tags given to the line
* `groupID`: The name of the group this item belongs to. As mentioned above, group names ***must*** be unique.

#### Schema
```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "groups": {
      "type": "object",
      "properties": {
        "UniqueGroupName": {
          "type": "array",
          "items": [
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string"
                },
                "status": {
                  "type": "string (null if title type)"
                },
                "content": {
                  "type": "string"
                },
                "rawContent": {
                  "type": "string"
                },
                "modifiers": {
                  "type": "null"
                },
                "groupID": {
                  "type": "string"
                }
              },
              "required": [
                "type",
                "status",
                "content",
                "rawContent",
                "modifiers",
                "groupID"
              ]
            },
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string"
                },
                "status": {
                  "type": "string"
                },
                "content": {
                  "type": "string"
                },
                "rawContent": {
                  "type": "string"
                },
                "modifiers": {
                  "type": "object",
                  "properties": {
                    "hasPriority": {
                      "type": "boolean"
                    },
                    "priorityLevel": {
                      "type": "integer"
                    },
                    "priorityPadding": {
                      "type": "integer"
                    },
                    "due": {
                      "type": "string"
                    },
                    "tags": {
                      "type": "array",
                      "items": [
                        {
                          "type": "string"
                        },
                        {
                          "type": "string"
                        }
                      ]
                    }
                  },
                  "required": [
                    "hasPriority",
                    "priorityLevel",
                    "priorityPadding",
                    "due",
                    "tags"
                  ]
                },
                "groupID": {
                  "type": "string"
                }
              },
              "required": [
                "type",
                "status",
                "content",
                "rawContent",
                "modifiers",
                "groupID"
              ]
            }
          ]
        }
      },
      "required": [
        "UniqueGroupName"
      ]
    }
  },
  "required": [
    "groups"
  ]
}
```

# Exposed Constants and Objects
 
In addition to the functions `toObject` and `toString`, there are also a number of objects and constants exposed, documented here primarily as reference for contributors:
```
    // Objects containing REGEX patterns
    xitLineTypePatterns,             // Used to determine the type of line being parsed (title, item, details, etc.)
    xitItemStatusDelimiterPatterns,  // Used to determine status of Xit item (done [x], obsolete [~], in-progress [@], etc.)
    xitLineModifierPatterns          // Used to collect any modifiers on the item (due date, priority, etc.)

    // Constants (see xit-parse.js for their values)
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
# Usage Example

When `toObject` is called on the following *.xit file (A book reading list, as an example), you can expect the following object:

**Input: ReadingList.xit**

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

**JSON Output**

```
{
  "groups": {
    "5215f2ee-51f3-4de0-a270-8c856364bc85": [
      {
        "type": "title",
        "status": null,
        "content": "Books I Am Reading",
        "rawContent": "Books I Am Reading",
        "modifiers": null,
        "groupID": "5215f2ee-51f3-4de0-a270-8c856364bc85"
      },
      {
        "type": "item",
        "status": "ongoing",
        "content": "Lord of Chaos",
        "rawContent": "[@] !!!! Lord of Chaos #jordan #fantasy -> 2023",
        "modifiers": {
          "hasPriority": true,
          "priorityLevel": 4,
          "priorityPadding": 0,
          "due": "2023",
          "tags": [
            "#jordan",
            "#fantasy"
          ]
        },
        "groupID": "5215f2ee-51f3-4de0-a270-8c856364bc85"
      },
      {
        "type": "item",
        "status": "ongoing",
        "content": "Cibola Burn",
        "rawContent": "[@] ...! Cibola Burn #scifi #corey",
        "modifiers": {
          "hasPriority": true,
          "priorityLevel": 1,
          "priorityPadding": 3,
          "due": null,
          "tags": [
            "#scifi",
            "#corey"
          ]
        },
        "groupID": "5215f2ee-51f3-4de0-a270-8c856364bc85"
      }
    ],
    "85d6ad60-4f10-4e06-9a0c-a54f49273b84": [
      {
        "type": "title",
        "status": null,
        "content": "Books I Have Read",
        "rawContent": "Books I Have Read",
        "modifiers": null,
        "groupID": "85d6ad60-4f10-4e06-9a0c-a54f49273b84"
      },
      {
        "type": "item",
        "status": "checked",
        "content": "The Tao of Pooh",
        "rawContent": "[x] The Tao of Pooh #philosophy",
        "modifiers": {
          "hasPriority": false,
          "priorityLevel": 0,
          "priorityPadding": 0,
          "due": null,
          "tags": [
            "#philosophy"
          ]
        },
        "groupID": "85d6ad60-4f10-4e06-9a0c-a54f49273b84"
      }
    ],
    "38b122df-1da5-4958-8853-76a17f5ea01e": [
      {
        "type": "title",
        "status": null,
        "content": "Books I Want to Read",
        "rawContent": "Books I Want to Read",
        "modifiers": null,
        "groupID": "38b122df-1da5-4958-8853-76a17f5ea01e"
      },
      {
        "type": "item",
        "status": "in-question",
        "content": "The Way of Kings",
        "rawContent": "[?] The Way of Kings #sanderson #fantasy",
        "modifiers": {
          "hasPriority": false,
          "priorityLevel": 0,
          "priorityPadding": 0,
          "due": null,
          "tags": [
            "#sanderson",
            "#fantasy"
          ]
        },
        "groupID": "38b122df-1da5-4958-8853-76a17f5ea01e"
      },
      {
        "type": "item",
        "status": "obsolete",
        "content": "Infinite Jest",
        "rawContent": "[~] Infinite Jest #fiction",
        "modifiers": {
          "hasPriority": false,
          "priorityLevel": 0,
          "priorityPadding": 0,
          "due": null,
          "tags": [
            "#fiction"
          ]
        },
        "groupID": "38b122df-1da5-4958-8853-76a17f5ea01e"
      }
    ]
  }
}
```