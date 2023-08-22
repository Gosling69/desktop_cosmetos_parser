import { useTypedSelector } from "../hooks/useTypedSelector"
import {useActions} from "../hooks/useActions"
import {ParseLinksAndSaveToXlsx} from "../../wailsjs/go/main/App"
import { Site } from "../types/sitesTypes"
import { models } from "../../wailsjs/go/models"
import React, { useEffect, useState } from "react"
import {EventsOn} from "../../wailsjs/runtime/runtime"

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

const defaultInfo = "Please enter your query below 👇"

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
            <div>{info}</div>
            <button  onClick={clearInput}>Clear</button>
            <input value={query} onChange={onInputChange} ></input>
            <button  onClick={getNumPages}>Search...</button>
            {numItems ? 
                <>
                <button disabled={itemsLoading} onClick={getItems}>Get Items</button>
                <input disabled={itemsLoading} max={numItems} min={1} type="number" onChange={(e) => setNumItemsToFetch(Number(e.target.value))} value={numItemsToFetch} />
                </>
                :
                <></>
            }
        </>
    )
}

const Item = ({item, siteName} : itemProps) => {
    const {xlsxStatus} = useTypedSelector(state => state[siteName])
    const {toggleHideItem} = useActions()
    const toggleHide = (e : React.ChangeEvent<HTMLInputElement>) => {
        toggleHideItem(item.Url, siteName)
    }

    const failed = xlsxStatus.failed.find(fail => fail.Url === item.Url) 

    return (
        <div style={{textDecoration : failed ? " line-through" : ""}} >
            <input disabled={xlsxStatus.loading} checked={!item.Hide} onChange={toggleHide} type="checkbox"></input>
            {item.Name}
            {/* <img width={100} height={100} src={item.ImageLink} ></img> */}
        </div>
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

    return (
        <div>
            {items.map(item => 
                <Item key={item.Url} siteName={site.name} item={item} />
            )}
            {items.length ? 
                <XlsxComponent site={site}/>
                :
                <></>
            }

        </div>
    )
}

const XlsxComponent = ({site} : innerProps) => {
    const {items, xlsxStatus, name} = site
    const [fileName, setFilename] = useState("test")
    const {setXlsxLoading, setXlsxComplete, incrementProgress} = useActions()

    const onButtonClick = (e : React.MouseEvent<HTMLButtonElement>) => {
        const itemsToFetch = items.data.filter(item => !item.Hide)
        setXlsxLoading(name, itemsToFetch.length)
        ParseLinksAndSaveToXlsx(itemsToFetch, name, fileName)
        .then((failed : models.Item[]) => {
            setTimeout(() => setXlsxComplete(name, failed), 500)
            console.log(failed)
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
    return (
        <>
        <input value={fileName} onChange={(e) => setFilename(e.target.value)} type="text" />
        <button disabled={xlsxStatus.loading || !fileName.length} onClick={onButtonClick} >Get XLSX</button>
        </>
    )
}



const SiteDashboard = ({siteName} : dashProps) => {
    const site = useTypedSelector(state => state[siteName])
    if (!site) {
        return <h1>Site not found, Error occured</h1>
    }

    return (
        <>
            <SearchInput site={site}/>
            <ItemsList site={site}/>
        </>
    )
}


export default SiteDashboard