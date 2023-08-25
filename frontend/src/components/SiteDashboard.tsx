import { useTypedSelector } from "../hooks/useTypedSelector"
import {useActions} from "../hooks/useActions"
import {ParseLinksAndSaveToXlsx} from "../../wailsjs/go/main/App"
import { models } from "../../wailsjs/go/models"
import React, { useEffect, useState } from "react"
import {EventsOn} from "../../wailsjs/runtime/runtime"
import { Row, Col, List, Avatar, Checkbox, Space, Input, InputNumber, Button } from "antd"


//add popup message showing errors if they happen

type dashProps = {
    siteName :string
}
type itemProps = {
    siteName : string,
    item : models.Item
}

const defaultInfo = "Please enter your query above 👇"

const SearchInput = ({siteName} : dashProps) => {
    const {clearQuery, fetchNumPages, setQuery, fetchItems} = useActions()
    const {request: query, numItems, loading : queryLoading, error } = useTypedSelector(state => state.query[siteName])
    const {loading : itemsLoading} = useTypedSelector(state => state.items[siteName])
    const [numItemsToFetch, setNumItemsToFetch] = useState(numItems)
    const [info, setInfo] = useState(defaultInfo)

    useEffect(() => {
        setNumItemsToFetch(numItems)
        if(numItems) {
            setInfo(`Found ${numItems} items for query : ${query}`)
        } else {
            setInfo(defaultInfo)
        }
    },[numItems])

    useEffect(() => {
        if(error) {
            setInfo(error)
        } else {
            setInfo(defaultInfo)
        }
    },[error])

    const onInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value, siteName)
    }
    const clearInput = () => {
        clearQuery(siteName)
    }
    const getNumPages = async () => {
        if (!query.length) {
            window.alert("Empty query")
            return
        }
        fetchNumPages(query, siteName)
    }
    const getItems = async () => {
        if (query.length && numItemsToFetch) fetchItems(query, numItemsToFetch, siteName)
    }
    if (queryLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            <Space.Compact style={{ width: '100%' }}>
                <Button type="primary" onClick={clearInput}>Clear</Button>
                <Input.Search  value={query} onChange={onInputChange} placeholder={defaultInfo} onSearch={getNumPages} style={{ width: 200 }} />
            </Space.Compact>
            {/* {info} */}
            {error}
            {numItems ? 
                <Space.Compact style={{ width: '100%', marginTop:"16px" }}>
                    <InputNumber max={numItems} min={1}  onChange={(e) => setNumItemsToFetch(e!)} value={numItemsToFetch}  disabled={itemsLoading}/>
                    <Button type="primary" disabled={itemsLoading} onClick={getItems}>Get Items</Button>
                </Space.Compact>
                :
                <></>
            }
        </>
    )
}



const Item = ({item, siteName} : itemProps) => {
    const {failed : failedItems, loading} = useTypedSelector(state => state.xlsxStatus[siteName])
    const {toggleHideItem} = useActions()
    const toggleHide = () => {
        toggleHideItem(item.Url, siteName)
    }

    const failed = failedItems.find(fail => fail.Url === item.Url) 

    return (
        <List.Item style={{textDecoration : failed ? " line-through" : ""}} >
            <Checkbox style={{marginRight:"20px"}} disabled={loading} checked={!item.Hide} onChange={toggleHide}/>
            <List.Item.Meta
                avatar={<Avatar size="large" shape="square" src={item.ImageLink} />}
                title={<a href={item.Url}>{`${item.Brand} ${item.Name}`}</a>}
                description={item.Description}

            />
        </List.Item>
    )

}


const ItemsList = ({siteName} : dashProps) => {
    const {data, loading, error} = useTypedSelector(state => state.items[siteName])
    if (loading) {
        return <h1>Loading...</h1>
    } 
    if(error) {
        return <h1>{error}</h1>
    }
    if(!data.length) {
        return (
            <></>
        )
    }

    return (
        <List
            style={{overflowY: "auto", height: "570px"}}
            dataSource={data}
            renderItem={(item) => ( 
                <Item key={item.Url} item={item} siteName={siteName}/>
            )}
        >
        </List>
    
    )
}

const XlsxComponent = ({siteName} : dashProps) => {
    const {data} = useTypedSelector(state => state.items[siteName])
    const {loading, completed, total, error} = useTypedSelector(state => state.xlsxStatus[siteName])
    const [fileName, setFilename] = useState("test")
    const {setXlsxLoading, setXlsxComplete, setXlsxError, incrementProgress} = useActions()

    const onButtonClick = (e : React.MouseEvent<HTMLButtonElement>) => {
        const itemsToFetch = data.filter(item => !item.Hide)
        setXlsxLoading(siteName, itemsToFetch.length)
        ParseLinksAndSaveToXlsx(itemsToFetch, siteName, fileName)
        .then((failed : models.Item[]) => {
            setTimeout(() => setXlsxComplete(siteName, failed), 500)
            console.log(failed)
        })
        .catch((e : string) => {
            setXlsxError(siteName, e)
        })
    }

    useEffect(() => {
        const cancel = EventsOn("xlsxInc", (data) => incrementProgress(data))
        return () => {
            cancel()
        }
    },[])


    if (loading) {
        return <h1>Loading...{completed}/{total}</h1>
    }
    if(!data.length) {
        return <></>
    }
    return (
        <>
        {error}
        <Space.Compact style={{ width: '100%' }}>
            <Input value={fileName} onChange={(e) => setFilename(e.target.value)} type="text" />
            <Button type="primary" disabled={loading || !fileName.length} onClick={onButtonClick} >Get XLSX</Button>
        </Space.Compact>
      
        </>
    )
}



const SiteDashboard = ({siteName} : dashProps) => {
    // fix xlsx input position
    const site = useTypedSelector(state => state.sites.find(site => site.name === siteName))
    if (!site) {
        return <h1>Site not found, Error occured</h1>
    }

    return (
        <div style={{marginLeft : "20px"}}>
        <Row  justify={"space-between"} style={{marginTop: "4vh", marginRight: "10px"}} >
            <Col >
                <SearchInput siteName={siteName}/>
            </Col>
            <Col >
                <XlsxComponent siteName={siteName}/>
            </Col>
        </Row>
        <Row style={{marginTop: "4vh"}}>
            <Col span={24} >
                <ItemsList siteName={siteName}/>
            </Col>
        </Row>
        </div>
    )
}


export default SiteDashboard