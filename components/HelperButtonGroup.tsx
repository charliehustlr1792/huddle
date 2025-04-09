"use client"
import React from 'react'
import styled from 'styled-components'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import TwitterIcon from '@mui/icons-material/Twitter'
import { BackgroundMode } from '../types/BackgroundMode'
import { toggleBackgroundMode } from '../stores/UserStore'
import { useAppSelector, useAppDispatch } from '../hooks'


const Backdrop = styled.div`
  position: fixed;
  display: flex;
  gap: 10px;
  bottom: 16px;
  right: 16px;
  align-items: flex-end;

  .wrapper-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`
const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`

const StyledFab = styled(Fab)<{ target?: string }>`
  &:hover {
    color: #1ea2df;
  }
`

export default function HelperButtonGroup() {
  
  const backgroundMode = useAppSelector((state) => state.user.backgroundMode)
  const dispatch = useAppDispatch()

  return (
    <Backdrop>
      <ButtonGroup>
        <Tooltip title="Follow Us on Twitter">
          <StyledFab size="small" href="https://x.com/_ieeeju?t=TkHeupITSuACLko8_wXXyQ&s=09" target="_blank">
            <TwitterIcon />
          </StyledFab>
        </Tooltip>
        <Tooltip title="Switch Background Theme">
          <StyledFab size="small" onClick={() => dispatch(toggleBackgroundMode())}>
            {backgroundMode === BackgroundMode.DAY ? <DarkModeIcon /> : <LightModeIcon />}
          </StyledFab>
        </Tooltip>
      </ButtonGroup>
    </Backdrop>
  )
}
