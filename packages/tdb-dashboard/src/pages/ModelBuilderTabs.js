import React,{useEffect,useState} from "react"
import {modelCallServerHook, ViewBuilder, SchemaDocumentView} from "@terminusdb-live/tdb-react-components"
import {Tabs, Tab,Stack, Row, Col, Button} from "react-bootstrap"
import {SCHEMA_MODEL_VIEW, DOCUMENT_TAB, GRAPH_TAB, JSON_TAB, DIAGRAM_TAB} from "./constants"
import {WOQLClientObj} from '../init-woql-client'
import {Loading} from "../components/Loading" 
import {PROGRESS_BAR_COMPONENT}  from "../components/constants"
import {JSONModelBuilder} from "../components/JSONModelBuilder" 
import {ErrorMessageReport} from "../components/ErrorMessageReport"
import Nav from 'react-bootstrap/Nav';
import { MODEL_BUILDER_NAV } from "../components/constants" 
import {GraphContextObj} from "@terminusdb-live/tdb-react-components"
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { AiOutlineCheckCircle, AiOutlineCheck } from "react-icons/ai"
import ListGroup from 'react-bootstrap/ListGroup';
import { FiHelpCircle } from "react-icons/fi"
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const renderTooltip = (helpText) => (
	<Tooltip id="help-tooltip" >
		<label className="text-light">{helpText}</label>
	</Tooltip>
);

const Help = ({ helpText }) => {
	return <OverlayTrigger
		placement="top"
		overlay={renderTooltip(helpText)}
		>
			<Button variant="transparent" className="btn btn-sm"><FiHelpCircle className="text-muted"/></Button>
	</OverlayTrigger>
}

const ModelBuilderViewControl = ({ selectedMode, setSelectedMode }) => {
	
	function handleSwitch(chosen) {
		setSelectedMode(chosen)
	}

	function getVariant(mode, selectedMode) {
		if(mode === selectedMode) return "light"
		return "dark"
	}

	function getActive (mode, selectedMode) {
		if(mode === selectedMode) return true
		return false
	}

	function getActiveClassName (mode, selectedMode) {
		if(mode === selectedMode) return "bg-dark border border-light"
		return ""
	}

	function getHelpLabel(mode, selectedMode, label) {
		if(mode === selectedMode) return label
		return `Switch to ${label}`
	}

	function getLabel(mode, selectedMode, helpText) {
		if(mode === DOCUMENT_TAB) return <div title={getHelpLabel(mode, selectedMode, helpText)}>{
			`UI`}
		</div>
		else if (mode === GRAPH_TAB) return <div title={getHelpLabel(mode, selectedMode, helpText)}>
			{`GUI`}
		</div>
		return  <div title={getHelpLabel(mode, selectedMode, helpText)}>{`JSON UI`}</div>
	}

	return <Stack direction="vertical" gap={2} className="w-100 mt-4">
		<Button onClick={(e)=>handleSwitch(DOCUMENT_TAB)}
			variant = "secondary"
			active={getActive(DOCUMENT_TAB, selectedMode)}
			className={getActiveClassName(DOCUMENT_TAB, selectedMode)}
			title={getHelpLabel(DOCUMENT_TAB, selectedMode, "UI Mode")}>
			UI 
		</Button>
		<Button onClick={(e)=>handleSwitch(GRAPH_TAB)}
			variant = "secondary"
			active={getActive(GRAPH_TAB, selectedMode)}
			className={getActiveClassName(GRAPH_TAB, selectedMode)}
			title={getHelpLabel(GRAPH_TAB, selectedMode, "Graph UI Mode")}>
			GUI
		</Button>
		<Button onClick={(e)=>handleSwitch(JSON_TAB)}
			variant = "secondary"
			active={getActive(JSON_TAB, selectedMode)}
			className={getActiveClassName(JSON_TAB, selectedMode)}
			title={getHelpLabel(JSON_TAB, selectedMode, "JSON Mode")}>
			JSON
		</Button>

	</Stack>

	/*return <ListGroup variant="flush">
		<ListGroup.Item onClick={(e)=>handleSwitch(DOCUMENT_TAB)} 
			action
			active={getActiveClassName(DOCUMENT_TAB, selectedMode)}
			className="bg-transparent">
			{getLabel(DOCUMENT_TAB, selectedMode, "UI Mode")}
		</ListGroup.Item>
		<ListGroup.Item onClick={(e)=>handleSwitch(GRAPH_TAB)}
			action
			active={getActiveClassName(GRAPH_TAB, selectedMode)}
			className="bg-transparent">
			{getLabel(GRAPH_TAB, selectedMode, "Graph UI Mode")}
		</ListGroup.Item>
		<ListGroup.Item onClick={(e)=>handleSwitch(JSON_TAB)}
			active={getActiveClassName(JSON_TAB, selectedMode)}
			action
			className="bg-transparent">
			{getLabel(JSON_TAB, selectedMode, "JSON Mode")}
		</ListGroup.Item>
	</ListGroup>*/

//{<Help helpText={getHelpLabel(JSON_TAB, selectedMode, "JSON Mode")}/>}

} 

export const ModelBuilderTabs = () => {

  const { woqlClient, branch, ref, accessControlDashboard, currentChangeRequest } = WOQLClientObj()
	if(!woqlClient) return "" 
	const dataProduct = woqlClient.db()
	const { callServerLoading, saveGraphChanges } = modelCallServerHook(woqlClient, branch, ref,dataProduct)
	const { selectedNodeObject } = GraphContextObj();
	const [showSavedMsg, setShowSavedMsg] = useState(false);
	const [selectedKey, setSelectedKey] = useState(1)

	const [tab, setTab]=useState(DOCUMENT_TAB)

	const [selectedMode, setSelectedMode] = useState(DOCUMENT_TAB)

	// check if the user is in view mode or edit mode
	let isEditMode = accessControlDashboard && accessControlDashboard.schemaWrite() || false
	isEditMode = currentChangeRequest ? false : isEditMode

  const saveData=async (jsonObj, commitMessage)=>{
    await saveGraphChanges(jsonObj, commitMessage)
		setShowSavedMsg(Date.now())
  }

	const closeShowSavedMessage = () => setShowSavedMsg(!showSavedMsg);

	return   <Row className="w-100">
		<Col md={11}>
			<ToastContainer
				className="p-3 mt-4"
				position={'top-end'}
				style={{ zIndex: 1 }}>
				<Toast show={showSavedMsg} 
					delay={3000} autohide
					onClose={closeShowSavedMessage} 
					bg="secondary">
						<Toast.Header>
						<span>Success</span>
							</Toast.Header>
						<Toast.Body>
							
							<strong className="me-auto">
								<AiOutlineCheck className="mr-2" style={{color: "#00bc8c"}} size="22"/> 
								Your changes have been successfully saved
							</strong>

						</Toast.Body>
					</Toast>
			</ToastContainer>
			{!callServerLoading && selectedMode === DOCUMENT_TAB  && 
				<SchemaDocumentView  	dbName={dataProduct} 
					saveGraph={saveData}
					custom={true}/>}


			{!callServerLoading && selectedMode === GRAPH_TAB  && 
				<ViewBuilder  dbName={dataProduct} 
					custom={true}
					saveGraph={saveData}
					isEditMode={isEditMode}/>}
			
			{!callServerLoading && selectedMode === JSON_TAB && <div className="ml-3">
				<JSONModelBuilder accessControlEditMode={isEditMode} tab={tab} />
			</div>}
		
			 
		</Col>
		<Col md={1}  className="border-left border-secondary vh-100">
			<ModelBuilderViewControl selectedMode={selectedMode} setSelectedMode={setSelectedMode}/>
		</Col>
	</Row>


}