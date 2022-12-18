
import * as CONST from "../constants"
import * as util from "../utils"
import * as dataType from "../dataTypeFrames/dataType.utils"
import * as subDocumentType from "../subDocumentTypeFrames/subDocumentType.utils"
//import {getCommentFromDocumentation} from '../documentationTemplates'
import * as choiceDocumentType from "../choiceDocumentTypeFrames/choiceDocumentTypeFrames.utils"
import * as choiceSubDocumentType from "../choiceSubDocumentTypeFrames/choiceSubDocumentTypeFrames.utils"
import * as documentType from "../documentTypeFrames/documentTypeFrames.utils"
import * as enumType from "../enumTypeFrames/enumTypeFrames"
import * as sysType from "../sysDataTypeFrames/sysDataTypeFrames"
import {addCustomUI} from "../addCustomUI"
import {generateLabel} from "./labelHelper"
import * as oneOfDataType from "../oneOfTypeFrames/oneOfTypeFrames.utils"
import * as rdfType from "../rdfLanguageString/rdfLanguageString.utils"

export function generateUI(fullFrame, frame, item, uiFrame, mode, formData, onTraverse, onSelect, documentation, extractedFrames) {
    /** return null if frmae doesnt have property in it */
    if(!frame.hasOwnProperty(item)) return null

    let generatedUILayout={}
 
    if(util.isDataType(frame[item])) { 
        generatedUILayout=dataType.getUILayout(frame, item, uiFrame, mode, formData, documentation)
    } 
    else if(util.isSubDocumentType(frame[item])) {
        generatedUILayout=subDocumentType.getUILayout(extractedFrames, item, uiFrame, mode, formData, documentation)
    }
    else if(util.isChoiceSubDocumentType(frame[item])) {
        generatedUILayout=choiceSubDocumentType.getUILayout(extractedFrames, item, uiFrame, mode, formData, documentation)
    }
    else if(util.isChoiceDocumentType(frame[item])) {
        generatedUILayout=choiceDocumentType.getUILayout(extractedFrames, frame, item, uiFrame, mode, formData, onSelect, onTraverse, documentation)
    }
    else if(util.isOneOfDataType(frame, item)) {
        generatedUILayout=oneOfDataType.getUILayout(extractedFrames, frame, item, uiFrame, mode, formData, onSelect, onTraverse, documentation)
    }
    else if(util.isDocumentType(frame[item], fullFrame)) {
        generatedUILayout=documentType.getUILayout(extractedFrames, onSelect, onTraverse, item, uiFrame, mode, formData, documentation)
    }
    else if(util.isEnumType(frame[item])) {
        generatedUILayout=enumType.getUILayout(fullFrame, frame, item, uiFrame, mode, formData, documentation)
    }
    else if(util.isSysJSONDataType(frame[item])) {
        generatedUILayout=sysType.getSysJSONUILayout(fullFrame, frame, item, uiFrame, mode, formData, documentation)
    }
    else if(util.isSysUnitDataType(frame[item])) {
        generatedUILayout=sysType.getSysUnitUILayout(fullFrame, frame, item, uiFrame, mode, formData, documentation)
    }
    else if(util.isRdfLangString(frame[item])) {
        generatedUILayout=rdfType.getUILayout(fullFrame, frame, item, uiFrame, mode, formData, documentation)
    }

    /** add description if available */
    //let description = getCommentFromDocumentation(item, documentation)
    //if(description) generatedUILayout["ui:description"]=description

    /** add custom ui Frame if available */
    let generatedCustomUI=addCustomUI(item, generatedUILayout, uiFrame)
    //console.log("generatedCustomUI", generatedCustomUI)

    let generatedLabel=generateLabel(frame, item, documentation)
    generatedCustomUI["ui:title"]=generatedLabel

    // hide non filled data from View mode
    /*if(mode === CONST.VIEW && formData && !formData.hasOwnProperty(item)) {
        generatedCustomUI={}
        generatedCustomUI["ui:widget"]="hidden"//util.hidden
    }*/
    
    return generatedCustomUI
}