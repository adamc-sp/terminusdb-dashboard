import {
    CREATE,
    VIEW,
    EDIT
} from "../constants"

import {SYS_UNIT_DATA_TYPE, ONEOFVALUES} from "../constants"
import {getTitle, getDefaultValue, checkIfKey, isFilled} from "../utils"
import {
    getCreateDocumentLayout,
    getViewDocumentLayout,
    getCreateSysUnitDocumentLayout,
    getViewSysUnitDocumentLayout
} from "./oneOfTypeFrames.utils"

import {addCustomUI} from "../utils"

/** sorts the list of chosen one ofs on select  */
function sortOneOfs (anyOfArray, formData, mode) {
    if(mode === CREATE) return anyOfArray
    if(mode === EDIT) {
        let sorted = []
        // add on form Data 
        anyOfArray.map(aOf => {
            if(aOf.hasOwnProperty("title")) {
                if(formData.hasOwnProperty(aOf["title"])) { // filled match found
                    sorted.push(aOf)
                }
            }
        })
        return sorted
    }
    if(mode === VIEW) {
        let sorted = []
        // add on form Data 
        anyOfArray.map(aOf => {
            if(aOf.hasOwnProperty("title")) {
                if(formData.hasOwnProperty(aOf["title"])) { // filled match found
                    sorted.push(aOf)
                }
            }
        })
        return sorted
    }
}

// get one of  type frames
function oneOfTypeFrames (fullFrame, current, frame, item, uiFrame, mode, formData, onTraverse, onSelect, documentation, language) {

    let properties={}, propertiesUI={}

    // get choice documents
    let anyOfArray = []

    //layout
    frame[item].map(fr => {
        for(var oneOf in fr) {
            let documentName=fr[oneOf]
            let currentChoice=oneOf
            if(documentName !== SYS_UNIT_DATA_TYPE) {
                if(mode!==VIEW)
                    anyOfArray.push(getCreateDocumentLayout(documentName, fullFrame, currentChoice, item, uiFrame, mode, formData, onTraverse, onSelect, documentation, language))
                else anyOfArray.push(getViewDocumentLayout(documentName, fullFrame, currentChoice, item, uiFrame, mode, formData, onTraverse, onSelect, documentation, language))
            }
            else if(documentName === SYS_UNIT_DATA_TYPE) {
                if(mode!==VIEW){
                    anyOfArray.push(getCreateSysUnitDocumentLayout(documentName, fullFrame, currentChoice, item, uiFrame, mode, formData, onTraverse, onSelect))
                }
                else anyOfArray.push(getViewSysUnitDocumentLayout(documentName, fullFrame, currentChoice, item, uiFrame, mode, formData, onTraverse, onSelect))
            }
        }
    })


    let sortedArray = sortOneOfs (anyOfArray, formData, mode)

    let layout = {
        type: 'object',
        info: ONEOFVALUES,
        title: item,
        description: `Choose ${item} from the list ...`,
        anyOf: sortedArray.length === 0 ? anyOfArray : sortedArray
    }

    //ui layout
    let uiLayout = {
        "ui:title": getTitle(item, checkIfKey(item, frame["@key"])),
        classNames: "tdb__input mb-3 mt-3"
    }

    //console.log("qqq layout", layout)

    if(layout.hasOwnProperty("anyOf") && Array.isArray(layout.anyOf)) {

        layout.anyOf.map(aOf => {
            if(aOf.hasOwnProperty("properties")) {
                for(var ui in aOf.uiProperties) {
                    uiLayout[ui]=aOf.uiProperties[ui]
                }
            }
        })
    }

    // custom ui:schema - add to default ui schema
    let addedCustomUI=addCustomUI(item, uiFrame, uiLayout)

    // schema
    properties[current] = layout
    // ui schema
    propertiesUI[current] = addedCustomUI


    return {properties, propertiesUI}
}
 
// mandatory
export function makeOneOfTypeFrames (fullFrame, current, frame, item, uiFrame, mode, formData, onTraverse, onSelect, documentation, language) {
    let madeFrames = oneOfTypeFrames (fullFrame, current, frame, item, uiFrame, mode, formData, onTraverse, onSelect, documentation, language)

    let properties = madeFrames.properties
    let propertiesUI = madeFrames.propertiesUI
    return {properties, propertiesUI}
}
