import React, {useState, useEffect} from "react"
import {WOQLClientObj} from '../init-woql-client'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/ayu-dark.css'
require('codemirror/mode/css/css')
require('codemirror/mode/javascript/javascript')
//import 'codemirror/addon/display/autorefresh.js'
import {PROGRESS_BAR_COMPONENT, TERMINUS_SUCCESS} from "./constants"
import {Loading} from "./Loading"
import {MODEL_BUILDER_EDITOR_OPTIONS} from "./constants"
import {AiOutlineCloseCircle, AiOutlineEdit, AiOutlineSave} from "react-icons/ai"
import {FaRegEdit} from 'react-icons/fa'
import {Alerts} from "./Alerts"
import {TERMINUS_DANGER,DOCUMENT_PREFIX} from "./constants"
import {GRAPH_TAB} from "../pages/constants"
import {GraphContextObj} from "@terminusdb-live/tdb-react-components"
import {CopyButton} from "./utils"
import {BsSave} from "react-icons/bs"

export const JSONModelBuilder = ({tab,saveGraph,accessControlEditMode}) => {
    const {getSchemaGraph} = GraphContextObj();
    const {dataProduct} = WOQLClientObj()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [commitMsg, setCommitMessage]=useState("Add new schema")
    const [report, setReport]=useState(false)

    const [jsonSchema, setJsonSchema]=useState(false)

    let branch = "main"
    let ref = ""

    const onBlurHandler = (value) =>{
        setValue(value)
    }

    async function getJSONSchema () {
        //get the schema from the mainGraphObj
        //the result is the schema in json format
        const resultJson = getSchemaGraph()// await woqlClient.getDocument(params, dataProduct)
        setJsonSchema(resultJson)
        setValue(resultJson)
    }
    
    useEffect(() => {
        if(tab == GRAPH_TAB) return
        setEditMode(false)
        getJSONSchema()
    }, [tab,dataProduct])

    const [editMode, setEditMode]=useState(false)
	const [value, setValue]=useState(false) 


    MODEL_BUILDER_EDITOR_OPTIONS.readOnly=!editMode

    function handleCommitMessage (e) {
        setCommitMessage(e.target.value)
    }


    async function saveChange (){
        setLoading(<Loading message={"Updating schema"} type={PROGRESS_BAR_COMPONENT}/>)

        if(value) {
            try{
                //save change in the server
                await saveGraph(value, commitMsg)   
                setLoading(false)
                setEditMode(false)
             
            }catch(err){
                let jsonError= JSON.parse(JSON.stringify(err))
                setLoading(false)
                if(jsonError.data && jsonError.data["api:message"]) {
                    setReport(<Alerts message={jsonError.data["api:message"]} type={TERMINUS_DANGER}/>)
                }
                else setReport(<Alerts message={err.toString()} type={TERMINUS_DANGER}/>)  
            }       
        }
    }
    const editStyle = editMode ? {className:"border rounded border-warning"} : {}
    const editMessage = editMode ? "Save schema or you will loose your changes" : ""

    return <React.Fragment>
            {loading && loading} 
            
            <div {...editStyle}>
                <div className="d-flex align-items-center justify-content-between ml-4">
                    <label className="text-warning mt-4 pb-2">{editMessage}</label>                   
                        {accessControlEditMode && !editMode &&
                            <button  type="button" className="btn-edit-json-model btn btn-sm btn-light text-dark border-0 col-md-1 mt-3" onClick={()=>{setEditMode(true)}}>
                                <FaRegEdit/> Edit Schema
                            </button>
                        }
                        {editMode && 
                            <button  type="button" className="btn btn-lg border-0 col-md-1 float-right" onClick={()=>{setEditMode(false)}}>
                                <AiOutlineCloseCircle className="float-right mr-2"/>
                            </button>
                        }
                </div>
                          
                {editMode &&
                    <div role="group" className="btn-group w-100">
                        <div className="ml-4 flex-grow-1">
                            <input id="schema_save_description" placeholder={"Enter a description to tag update"} type="text" className="form-control" onBlur={handleCommitMessage}/>
                        </div>
                        <button  type="button" id="schema_save_button" className="col-md-1 btn btn-md bg-light text-dark mr-4" onClick={saveChange}>
                            <BsSave className="small"/> <label className="mt-1">Save Schema</label>
                        </button>
                    </div>
                }
               
                <div className="h-100 m-4">
                    {report && <span className="w-100 m-4">{report}</span>}

                    <CopyButton text={jsonSchema} 
                        label={"Copy schema"}
                        title={`Copy JSON schema`} 
                        css={"btn btn-sm bg-light text-dark model-builder-copy-button"}/>
                    <CodeMirror  
                        onBlur={(editor, data) => {
                            const editorValue =editor.doc.getValue()
                            onBlurHandler(editorValue)
                        }}
                        value={jsonSchema}
                        options={MODEL_BUILDER_EDITOR_OPTIONS}
                        className="model-builder-code-mirror"
                    />
                    {/*<div><pre>{schema}</pre></div>*/}
                </div>
            </div>
        </React.Fragment>

}
