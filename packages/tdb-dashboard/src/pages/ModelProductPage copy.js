import React from "react"
import {ModelBuilder} from "./ModelBuilder"
import { Layout } from "./Layout"
export const ModelProductPage = () => {
  
    return <Layout showLeftSideBar={true}>
        <main className="content mr-3 ml-5">
            <ModelBuilder/>
        </main> 
    </Layout> 
     
}