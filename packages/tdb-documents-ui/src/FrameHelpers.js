import { makeMandatoryFrames } from "./mandatoryFrames"
import { makeOptionalFrames } from "./optionalFrames"
import * as util from "./utils"
import * as CONST from "./constants"


export function getProperties (args) {
  let properties = {}, propertiesUI = {}, required = []

	let { documentFrame } = args
    
	for(let property in documentFrame) {

		if(property === "@id") continue
		else if(property === "@key") continue
		else if(property === "@type") continue 
		else if(property === "@id") continue
		else if(property === "@inherits") continue
		else if(util.isMandatory(documentFrame, property)) {
			let mandatoryFrames=makeMandatoryFrames(args, property)
			//set property layout & uiLayout
			properties[property] = mandatoryFrames.layout
			propertiesUI[property] = mandatoryFrames.uiLayout
			//set property as required since Mandatory
			required.push(property)
		}
		else if(util.isOptional(documentFrame, property)) { 
			let extractedFrames = util.extractFrames(documentFrame, property)
			args.documentFrame=extractedFrames
			let optional = getProperties(args)
			let optionalFrames = makeOptionalFrames(optional, property) 
		 
			//set property layout & uiLayout
			properties[property] = optionalFrames.layout
			propertiesUI[property] = optionalFrames.uiLayout
		}
	}

	return {
		properties: properties,
		required: required,
		uiSchema: propertiesUI
	}

}
