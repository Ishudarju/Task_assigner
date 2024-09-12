import React from 'react'
import { Sidebar,Menu,MenuItem,SubMenu } from 'react-pro-sidebar'

const SideBar = () => {
  return (
    <Sidebar>
        <Menu>
            <SubMenu>
                <MenuItem>Dashboard</MenuItem>
                <MenuItem>Tasks</MenuItem>
                <MenuItem>Users</MenuItem>
            </SubMenu>
        </Menu>
    </Sidebar>
  )
}

export default SideBar
