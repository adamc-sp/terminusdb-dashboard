import React,{useState,useEffect} from "react";
import { ControlledGraphqlQuery , GraphqlTable} from '@terminusdb/terminusdb-react-table'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { AdvancedSearch } from "../components/AdvancedSearch";
import {Tab,Tabs,Form, Button} from 'react-bootstrap'
import { GraphqlQueryView } from "./GraphqlQueryViewer";
import {gql} from "@apollo/client";
import { format } from 'graphql-formatter'
import Accordion from 'react-bootstrap/Accordion'

//to be review
export const DocumentsTable = ({type,onRowClick,showGraphqlTab=true,tableConfig}) => {
    
    const querystr  = tableConfig.objQuery[type].query
    const query = gql`${querystr}`
    //const query =gql`query Doc01Query($offset: Int, $limit: Int, $filter: Doc01_Filter, $orderBy: Doc01_Ordering) {\n  Doc01(offset: $offset, limit: $limit, filter: $filter, orderBy: $orderBy) {\n    _id\n    label\n  }\n}`
    const [advSearchFields,setAdvFields] = useState(false)
    const [queryToDisplay,setQueryTodisplay] = useState(false)
   
    if (!query) return ""
    const { documentError,
        rowCount,
        changeOrder,
        changeLimits,
        changeFilters,
        setAdvancedFilters,
        limit,
        queryFilters,
        start,
        orderBy,
        filterBy,
        loading,
        documentResults } = ControlledGraphqlQuery(query, type, 10, 0, {}, false);
    
    useEffect(() => {
       if(type){
            const queryStr = query.loc.source.body
            setQueryTodisplay(format(queryStr))
            setAdvFields(tableConfig.advancedSearchObj[type])          
       }
    },[type]);

    function onRowClickCall(row){
        if (onRowClick) {
            const rowTmp = row && row.original ? {label:row.original.name, id:row.original._id}: {}
            onRowClick(rowTmp)
        }
    }

     const tableConfigObj = {}
     tableConfigObj.columns = tableConfig.tablesColumnsConfig[type] || []
     tableConfigObj.rowClick = onRowClickCall
    
    let extractedResults = documentResults ? extractDocuments(documentResults[type]) : []

    const totalRows = 200

    function extractDocuments(documentResults) {
        var extractedResults = []

        documentResults.map(item => {
            var newJson = {}
            for (var key in item) {
                // if it is an array this is set type, I can have more than 1 result for row
                //?? I can pust the count
                if (Array.isArray(item[key])) {
                    newJson[key] = `${(item[key].length)}`
                }
                else if (item[key] && typeof item[key] === "object") {
                    //key 
                    const objectKey = Object.keys(item[key])
                    objectKey.forEach(element => {
                        newJson[`${key}--${element}`] = item[key][element]
                    });
                }
                else {
                    newJson[key] = item[key]
                }
            }
            extractedResults.push(newJson)
        })
        //console.log("extractedResults", extractedResults)
        return extractedResults
    }



   // const showBar = loading ? {className:"visible"} : {className:"invisible"}
   //return <div>hello</div>
// <AdvancedSearch fields={advSearchFields} setFilter={setAdvancedFilters} />
    return <div>          
            {advSearchFields &&
                 <Accordion className="mb-4">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Advanced filter</Accordion.Header>
                        <Accordion.Body>
                            <AdvancedSearch fields={advSearchFields} setFilter={setAdvancedFilters} />
                        </Accordion.Body>
                    </Accordion.Item>
            </Accordion>}       
            {loading && <span >
                Loading {type} ...
                <ProgressBar variant="success" animated now={100}  className="mb-4"/>
            </span>}
            {!loading && 
            <Tabs defaultActiveKey="table" className="mb-3" >
                <Tab eventKey="table" title="Result Table">
                    {!loading && Array.isArray(extractedResults) && 
                     <GraphqlTable
                     // dowloadConfig={{filename:"test.csv",headers:["Author","Commit ID"]}}
                      result={extractedResults}
                      freewidth={true}
                      config ={tableConfigObj}
                   //   view={(tableConfig ? tableConfig.json() : {})}
                      limit={limit}
                      start={start}
                      orderBy={{}} 
                      setFilters = {changeFilters}
                      setLimits={changeLimits}
                      setOrder={changeOrder}
                     // query={null}
                      loading={loading}
                      totalRows={totalRows}
                      onRefresh={function(){}}
                  />}
            </Tab>
           {showGraphqlTab && <Tab eventKey="graphql" title="Graphql Query">
                <div>
                {queryToDisplay && 
                   <GraphqlQueryView 
                     filterBy={queryFilters}
                     orderBy={orderBy}
                     start={start}
                     limit={limit}
                     queryToDisplay={queryToDisplay} />
                }
                </div>
            </Tab>}
         </Tabs>}
    </div>
}