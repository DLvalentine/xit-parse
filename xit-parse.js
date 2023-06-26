// NOTE - Possible improvement, this might live better as a class one day. I'm happy with it for now though.
// TODO - If this gets >=400 lines, might be best to pull constants out into own file
/**
 * xit-pase.js
 * dependencies: uuid
 * -----------
 * Utilities and constants to be used to parse/represent *.xit files, to be used in writing an xit editor.
 * There are some behaviors here that the spec doesn't count as valid, e.g. "---> 2022-01-01" not being a valid due date.
 * For the time being, I'm going to count those as valid, as I don't see anything wrong with them.
 * Another example of this would be tags that include special characters, e.g. "#dependsOn:<label>"
 */
'use strict';

import { v4 as uuidv4 } from 'uuid';

// To be used when looking at *entire* line to determine type
const xitLineTypePatterns = {
    title: /^([a-zA-Z0-9].*|\[(?!x\])[a-zA-Z0-9].*)/gm,
    openItem: /^\[ \] .*/gm,
    checkedItem: /^\[x\] .*/gm,
    ongoingItem: /^\[@\] .*/gm,
    obsoleteItem: /^\[~\] .*/gm,
    inQuestionItem: /^\[\?\] .*/gm,
    itemDetails: /^([\t]+|[ ]{4}).*/gm,
};

// To be used when splitting raw content out into "human readable"/sanitized content
// TODO -> Is this a good solution? Or is there a way to modify the regex we have above?
const xitItemStatusDelimiterPatterns = {
    openItem: /^\[ \] /gm,
    checkedItem: /^\[x\] /gm,
    ongoingItem: /^\[@\] /gm,
    obsoleteItem: /^\[~\] /gm,
    inQuestionItem: /^\[\?\] /gm,
};

// To be used when looking at line tokens to determine modifiers
const xitLineModifierPatterns = {
    priorityLine: /^.*([!]|[.]*[!]){1,} .*/gm, // FIXME -> this currently accepts "!.!" forms as valid, which is not the case. I see this as a formatting thing for now, so low priority fix.
    priority: /[!.]{1,} /gm,
    dueDate: /-> ([0-9]{4}(-|\/){0,1}([qQwW]{0,1}[0-9]{1,2}){0,1})(-|\/){0,1}([0-9]{2}){0,1}/gm,
    tag: /#[^ ]{1,}/gm,
};

const TITLE_TYPE = 'title';

const ITEM_TYPE = 'item';
const ITEM_LEFT_SYM = '[';
const ITEM_RIGHT_SYM = ']';
const ITEM_STATUS_OPEN = 'open';
const ITEM_STATUS_OPEN_SYM = ' ';
const ITEM_STATUS_CHECKED = 'checked';
const ITEM_STATUS_CHECKED_SYM = 'x'
const ITEM_STATUS_ONGOING = 'ongoing';
const ITEM_STATUS_ONGOING_SYM = '@';
const ITEM_STATUS_OBSOLETE = 'obsolete';
const ITEM_STATUS_OBSOLETE_SYM = '~';
const ITEM_STATUS_IN_QUESTION = 'in-question';
const ITEM_STATUS_IN_QUESTION_SYM = '?';

const ITEM_DETAILS_TYPE = 'details';

const NEWLINE_TYPE = 'newline'

const PRIORITY_MOD_TYPE = 'priority';
const DUE_DATE_MOD_TYPE = 'due';
const TAG_MOD_TYPE = 'tag';

/**
 * Given a string (the raw xit file contents), represent the xit file 
 * as a JSON object
 * @param {string} xitString 
 * @returns {object} - representation of xit file in JSON format.
 */
function toObject(xitString) {

    // NOTE / TODO -> 'groups' as a value might be unnecessary in the long run. Values could just be the UUIDs, but we'll see how it works out on the UI
    const xitObject = {
        groups: {}
    };

    /**
     * Given a line's contents, parse it for any modifiers
     * such as tags, due dates, etc.
     * @param {string} content 
     * @returns {object} - an object representing the item's modifiers
     */
    const parseXitModifiers = (content) => {
        const modifiers = {
            hasPriority: false,
            priorityLevel: 0,
            priorityPadding: 0,
            due: null,
            tags: []
        };

        const hasPriority = content.match(xitLineModifierPatterns.priorityLine);
        const priorityLevel = hasPriority ? content.match(xitLineModifierPatterns.priority)[0].trim().replace(/\.*/gm, '').length : 0;
        const priorityPadding = hasPriority ? content.match(xitLineModifierPatterns.priority)[0].trim().replace(/\!*/gm, '').length : 0;
        const due = content.match(xitLineModifierPatterns.dueDate);
        const tags = content.match(xitLineModifierPatterns.tag);

        if (hasPriority !== null && hasPriority.length)
        {
            modifiers.hasPriority = true;
            modifiers.priorityLevel = priorityLevel;
            modifiers.priorityPadding = priorityPadding;
        }

        if (due !== null && due.length)
            modifiers.due = due[0].split('-> ')[1];

        if (tags !== null && tags.length)
            modifiers.tags = tags;
       
        return modifiers;
    };

    /**
     * Adds a line to a group object in the xitObject
     * @param {string} uuid - the uuid of the group
     * @param {string} type - xit-constant representation of item type - e.g. TITLE
     * @param {string|null} status - if the item type has a status, this is the string representation, or null
     * @param {string} content - raw string content of line
     */
    // TODO -> Need some better "invalid" line handling. Right now I think we gracefully handle with a good-faith guess, but we should commit to either throwing an error or continuing with tbe best guess.
    const addXitObjectGroupLine = (uuid, type, status, content) => {
        const trimmedRawContent = content.replace(/[\n\r]*$/, '');

        if(!xitObject.groups[uuid]) {
            xitObject.groups[uuid] = [];
        }

        let readableContent = content;
        if(type === ITEM_TYPE) {
            switch(status) {
                case ITEM_STATUS_OPEN:
                    readableContent = readableContent.replace(xitItemStatusDelimiterPatterns.openItem, '');
                    break;
                case ITEM_STATUS_CHECKED:
                    readableContent = readableContent.replace(xitItemStatusDelimiterPatterns.checkedItem, '');
                    break;
                case ITEM_STATUS_ONGOING:
                    readableContent = readableContent.replace(xitItemStatusDelimiterPatterns.ongoingItem, '');
                    break;
                case ITEM_STATUS_OBSOLETE:
                    readableContent = readableContent.replace(xitItemStatusDelimiterPatterns.obsoleteItem, '');
                    break;
                case ITEM_STATUS_IN_QUESTION:
                    readableContent = readableContent.replace(xitItemStatusDelimiterPatterns.inQuestionItem, '');
                    break;
            }
        }
        
        if ( type === ITEM_TYPE || type === ITEM_DETAILS_TYPE) {
            readableContent = readableContent.replace(xitLineModifierPatterns.priority, '');
            readableContent = readableContent.replace(xitLineModifierPatterns.dueDate, '');
            readableContent = readableContent.replace(xitLineModifierPatterns.tag, '');
        }

        // TODO -> content/rawContent newline type check could be cleaned up, fine as is.
        // NOTE -> rawContent should never be used in toString, as it may not match state of object, as we don't provide update methods
        // TODO (?) -> Originally out of scope, but could be nice to refactor some of this and then provide a way to create a new xit object via an xit class...
        //          ^ I plan to do this anyway with one of my own applications that will consume this, maybe I'll circle back on that after I work on the application...
        xitObject.groups[uuid].push(
            {
                type,
                status,
                content: type === NEWLINE_TYPE ? '\n' : readableContent.replace(/[\n\r]*$/, '').trim(),
                rawContent: type === NEWLINE_TYPE ? '\n' : trimmedRawContent,
                modifiers: (type === TITLE_TYPE || type === NEWLINE_TYPE) ? null : parseXitModifiers(trimmedRawContent),
                groupID: uuid
            }
        );
    };

    // Used mostly to determine if current item is an item's details
    let prevItemType = null;

    // Used to track the group(s)
    // TODO -> Need some better "invalid" group handling. Right now I think we gracefully handle with a good-faith guess, but we should commit to either throwing an error or continuing with tbe best guess.
    let currentGroupId = uuidv4();

    // Build Xit object group lines here. By default (above, L120) we always assume one group, even if it is an empty file (indicating a new file)
    xitString.split('\n').forEach((line, idx) => {
        if (line.match(xitLineTypePatterns.title)) {
            addXitObjectGroupLine(currentGroupId, TITLE_TYPE, null, line)
            prevItemType = TITLE_TYPE;
        } else if (line.match(xitLineTypePatterns.openItem)) {
            addXitObjectGroupLine(currentGroupId, ITEM_TYPE, ITEM_STATUS_OPEN, line);
            prevItemType = ITEM_TYPE;
        } else if (line.match(xitLineTypePatterns.checkedItem)) {
            addXitObjectGroupLine(currentGroupId, ITEM_TYPE, ITEM_STATUS_CHECKED, line);
            prevItemType = ITEM_TYPE;
        } else if (line.match(xitLineTypePatterns.ongoingItem)) {
            addXitObjectGroupLine(currentGroupId, ITEM_TYPE, ITEM_STATUS_ONGOING, line);
            prevItemType = ITEM_TYPE;
        } else if (line.match(xitLineTypePatterns.obsoleteItem)) {
            addXitObjectGroupLine(currentGroupId, ITEM_TYPE, ITEM_STATUS_OBSOLETE, line);
            prevItemType = ITEM_TYPE;
        } else if (line.match(xitLineTypePatterns.inQuestionItem)) {
            addXitObjectGroupLine(currentGroupId, ITEM_TYPE, ITEM_STATUS_IN_QUESTION, line);
            prevItemType = ITEM_TYPE;
        } else if ((prevItemType === ITEM_TYPE || prevItemType === ITEM_DETAILS_TYPE) && line.match(xitLineTypePatterns.itemDetails)) {
            addXitObjectGroupLine(currentGroupId, ITEM_DETAILS_TYPE, null, line);
            prevItemType = ITEM_DETAILS_TYPE;
        } else if (line.match(/^[\n\r]*/gm)) {
            if (prevItemType !== null)
            {
                currentGroupId = uuidv4();
            }
            prevItemType = null;
        } else {
            throw `ParserError: One or more lines of provided Xit are invalid starting on L${idx} with content: ${line}`;
        }
    });

    return xitObject;
};

/**
 * Given an xitObject (as generated by toObject), return
 * xit formatted string contents, usually for file writing
 * @param {object} xitObject 
 * @returns {string} - raw xit file contents as a string
 */
function toString(xitObject) {
    let xitString = '';

    Object.values(xitObject.groups).forEach((group) => {
        Object.values(group).forEach((line) => {
            if(line.type === TITLE_TYPE) {
                xitString += `${line.content}\n`;
            } else if (line.type === ITEM_TYPE || ITEM_DETAILS_TYPE) {
                // status
                switch(line.status) {
                    case ITEM_STATUS_OPEN:
                        xitString += `${ITEM_LEFT_SYM}${ITEM_STATUS_OPEN_SYM}${ITEM_RIGHT_SYM} `;
                        break;
                    case ITEM_STATUS_CHECKED:
                        xitString += `${ITEM_LEFT_SYM}${ITEM_STATUS_CHECKED_SYM}${ITEM_RIGHT_SYM} `;
                        break;
                    case ITEM_STATUS_ONGOING:
                        xitString += `${ITEM_LEFT_SYM}${ITEM_STATUS_ONGOING_SYM}${ITEM_RIGHT_SYM} `;
                        break;
                    case ITEM_STATUS_OBSOLETE:
                        xitString += `${ITEM_LEFT_SYM}${ITEM_STATUS_OBSOLETE_SYM}${ITEM_RIGHT_SYM} `;
                        break;
                    case ITEM_STATUS_IN_QUESTION:
                        xitString += `${ITEM_LEFT_SYM}${ITEM_STATUS_IN_QUESTION_SYM}${ITEM_RIGHT_SYM} `;
                        break;
                }

                // priority
                if(line.modifiers.hasPriority) {
                    for(let priorityPadding = 1; priorityPadding <= line.modifiers.priorityPadding; priorityPadding++) {
                        xitString += `.`;
                    }
                    for(let priorityLevel = 1; priorityLevel <= line.modifiers.priorityLevel; priorityLevel++) {
                        xitString += `!`;
                    }

                    xitString += ' ';
                }

                // content
                xitString += `${line.content} `;

                // mods (sans priority)
                if(line.modifiers.tags.length) {
                    xitString += `${line.modifiers.tags.join(' ')} `;
                }

                if(line.modifiers.due !== null) {
                    xitString += `-> ${line.modifiers.due}`;
                }

                // newline for formatting between lines
                xitString += '\n';
            }
        });

        // newline between groups
        xitString += '\n';
    });

    // To spec, ensure newline at end of file after trimming any extra space
    return xitString.trim() + '\n';
};

export {
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
};
