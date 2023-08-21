import logo from './assets/images/logo-universal.png';
import './App.css';
import { useTypedSelector } from './hooks/useTypedSelector';
import { useActions } from './hooks/useActions';
import React, { useEffect, useState } from 'react';
import { GetAvailableSites } from '../wailsjs/go/main/App';
import SiteDashboard from './components/SiteDashboard';

function App() {
 
    const {addSite} = useActions()
    const sites = useTypedSelector(state => state)
    const [currentSite, setCurrentSite] = useState("")
    useEffect(() => {
        GetAvailableSites()
        .then((data) => {
            data.forEach((site,index) => {
                console.log(site)
                addSite(site)
                if(index === 0 ){
                    setCurrentSite(site)
                }
            })
        })
    },[])

    return (
        <div id='App'>
            <div className='row' >
                <div className='col-md-4'>
                    {Object.keys(sites).map(site =>
                        <button onClick={() => setCurrentSite(site)} key={site} >{site}</button>
                    )}
                </div>
                <div className='col-md-8'>
                    <SiteDashboard siteName={currentSite}/>
                </div>
            </div>  
        </div>    
    )
}

export default App
