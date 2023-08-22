
import { useTypedSelector } from './hooks/useTypedSelector';
import { useActions } from './hooks/useActions';
import React, { useEffect, useState } from 'react';
import { GetAvailableSites } from '../wailsjs/go/main/App';
import SiteDashboard from './components/SiteDashboard';
import { Row, Col } from 'antd';
import {
    ContainerOutlined,
    DesktopOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
  
type MenuItem = Required<MenuProps>['items'][number];
  
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const icons = [<PieChartOutlined />, <DesktopOutlined />, <ContainerOutlined />]

function App() {
 
    const {addSite} = useActions()
    const sites = useTypedSelector(state => state)
    const [currentSite, setCurrentSite] = useState("")
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
      setCollapsed(!collapsed);
    };

    useEffect(() => {
        GetAvailableSites()
        .then((data) => {
            data.forEach((site,index) => {
                addSite(site)
                if(index === 0 ){
                    setCurrentSite(site)
                }
            })
        })
    },[])

    return (
        <Row >
            <Col style={{width: "fit-content", textAlign: "center", padding:0}} className='sitescol' >
                <Button style={{ marginBottom: "16px", marginTop:"8px"}} type="primary" onClick={toggleCollapsed} >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
                <Menu
                    mode="inline"
                    theme="dark"
                    style={{
                        backgroundColor:"inherit"
                    }}
                    inlineCollapsed={collapsed}
                    selectedKeys={[currentSite]}
                    defaultActiveFirst
                    onSelect={(e) => setCurrentSite(e.key)}
                    items={
                        Object.keys(sites).map((site) =>
                            getItem(site, site, icons[Math.floor(Math.random() * icons.length)])
                        )
                    }
                />
                </Col>
            <Col span={20} >
                <SiteDashboard siteName={currentSite}/>
            </Col>
        </Row>
    )
}

export default App
