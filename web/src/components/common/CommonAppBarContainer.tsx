import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material'
import React from 'react'
import logo from '@themes/images/logo.png'
import styles from '@themes/styles/main.module.css'
import { useNavigate } from 'react-router-dom'

type Props = {
  menus?: CommonAppBarMenu[]
  children: React.ReactNode
}

export type CommonAppBarMenu = {
  title: string
  onClick: () => void
}

export function CommonAppBarContainer({ menus, children }: Props) {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar
        sx={{
          backgroundColor: '#fff',
          height: '64px',
        }}
      >
        <Toolbar>
          <IconButton disableRipple onClick={() => navigate('/')}>
            <img
              src={logo}
              className={styles['main-logo']}
              alt='logo'
              height='28px'
            />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {
            menus?.map((menu) => {
              return <Button key={menu.title} onClick={menu.onClick}>{menu.title}</Button>
            })
          }
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: '100%',
          marginTop: '64px',
          flex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
