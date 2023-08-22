import { useTypedSelector } from "../hooks/useTypedSelector"
import {useActions} from "../hooks/useActions"
import {ParseLinksAndSaveToXlsx} from "../../wailsjs/go/main/App"
import { Site } from "../types/sitesTypes"
import { models } from "../../wailsjs/go/models"
import React, { useEffect, useState } from "react"
import {EventsOn} from "../../wailsjs/runtime/runtime"
import { Row, Col, List, Avatar, Checkbox, Space, Input, InputNumber, Button } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"

type dashProps = {
    siteName :string
}
type innerProps = {
    site : Site
}
type itemProps = {
    siteName : string,
    item : models.Item
}

const defaultInfo = "Please enter your query above 👇"

const SearchInput = ({site} : innerProps) => {
    const {clearQuery, fetchNumPages, setQuery, fetchItems} = useActions()
    const {request: query, numItems, loading : queryLoading, error } = site.query
    const {loading : itemsLoading} = site.items
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
        setQuery(e.target.value, site.name)
    }
    const clearInput = () => {
        clearQuery(site.name)
    }
    const getNumPages = async () => {
        if (!query.length) {
            window.alert("Empty query")
            return
        }
        fetchNumPages(query, site.name)
    }
    const getItems = async () => {
        if (query.length && numItemsToFetch) fetchItems(query, numItemsToFetch, site.name)
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
    const {xlsxStatus} = useTypedSelector(state => state[siteName])
    const {toggleHideItem} = useActions()
    const toggleHide = () => {
        toggleHideItem(item.Url, siteName)
    }

    const failed = xlsxStatus.failed.find(fail => fail.Url === item.Url) 

    return (
        <List.Item style={{textDecoration : failed ? " line-through" : ""}} >
            <Checkbox style={{marginRight:"20px"}} disabled={xlsxStatus.loading} checked={!item.Hide} onChange={toggleHide}/>
            {/* <input disabled={xlsxStatus.loading} checked={!item.Hide} onChange={toggleHide} type="checkbox"></input> */}
            <List.Item.Meta
                style={{color:"white !important"}}
                avatar={<Avatar size="large" shape="square" src={item.ImageLink} />}
                title={<a href={item.Url}>{`${item.Brand} ${item.Name}`}</a>}
                description={item.Description}
            />
        </List.Item>
    )

}


const ItemsList = ({site} : innerProps) => {
    const {data: items, loading, error} = site.items
    if (loading) {
        return <h1>Loading...</h1>
    } 
    if(error) {
        return <h1>{error}</h1>
    }
    if(!items.length) {
        return (
            <></>
        )
    }

    return (
        <List
            style={{overflowY: "auto", height: "570px"}}
            dataSource={items}
            renderItem={(item) => ( 
                <Item key={item.Url} item={item} siteName={site.name}/>
            )}
        >
        </List>
    
    )
}

const XlsxComponent = ({site} : innerProps) => {
    const {items, xlsxStatus, name} = site
    const [fileName, setFilename] = useState("test")
    const {setXlsxLoading, setXlsxComplete, setXlsxError, incrementProgress} = useActions()

    const onButtonClick = (e : React.MouseEvent<HTMLButtonElement>) => {
        const itemsToFetch = items.data.filter(item => !item.Hide)
        setXlsxLoading(name, itemsToFetch.length)
        ParseLinksAndSaveToXlsx(itemsToFetch, name, fileName)
        .then((failed : models.Item[]) => {
            setTimeout(() => setXlsxComplete(name, failed), 500)
            console.log(failed)
        })
        .catch((e : string) => {
            setXlsxError(name, e)
        })
    }

    useEffect(() => {
        const cancel = EventsOn("xlsxInc", (data) => incrementProgress(data))
        return () => {
            cancel()
        }
    },[])


    if (xlsxStatus.loading) {
        return <h1>Loading...{xlsxStatus.completed}/{xlsxStatus.total}</h1>
    }
    if(!items.data.length) {
        return <></>
    }
    return (
        <>
        {xlsxStatus.error}
        <Space.Compact style={{ width: '100%' }}>
            <Input value={fileName} onChange={(e) => setFilename(e.target.value)} type="text" />
            <Button type="primary" disabled={xlsxStatus.loading || !fileName.length} onClick={onButtonClick} >Get XLSX</Button>
        </Space.Compact>
      
        </>
    )
}



const SiteDashboard = ({siteName} : dashProps) => {
    const site = useTypedSelector(state => state[siteName])
    if (!site) {
        return <h1>Site not found, Error occured</h1>
    }

    return (
        <div style={{marginLeft : "20px"}}>
        <Row  justify={"space-between"} style={{marginTop: "4vh", marginRight: "10px"}} >
            <Col >
                <SearchInput site={site}/>
            </Col>
            <Col >
                <XlsxComponent site={site}/>
            </Col>
        </Row>
        <Row style={{marginTop: "4vh"}}>
            <Col span={24} >
                <ItemsList site={site}/>
            </Col>
        </Row>
        </div>
    )
}


export default SiteDashboard