/* "use client"
import React from 'react'
import { useState } from 'react'
import { useAppSelector } from '../hooks'
import styled from 'styled-components'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import XIcon from '@mui/icons-material/X'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import HomeIcon from '@mui/icons-material/Home'
import Typography from '@mui/material/Typography'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'


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

const FooterText = styled(Typography)`
  position: fixed;
  bottom: 16px;
  left: 16px;
  color: white;
  font-size: 0.85 rem;
  font-weight: 900;
  font-family: 'Press Start 2P', cursive; /* The most authentic 8-bit game font */
  /*text-shadow: 2px 2px 0px rgba(0, 0, 139, 0.3);
  -webkit-text-stroke: 0.5px rgba(0, 0, 255, 0.2);
`
const Title = styled.h3`
  font-size: 24px;
  color: #eee;
  text-align: center;
`
const Wrapper = styled.div`
  position: relative;
  font-size: 16px;
  color: #eee;
  background: #222639;
  box-shadow: 0px 0px 5px #0000006f;
  border-radius: 16px;
  padding: 15px 35px 15px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .close {
    position: absolute;
    top: 15px;
    right: 15px;
  }

  .tip {
    margin-left: 12px;
  }
`
export default function HelperButtonGroup() {
  const [showControlGuide, setShowControlGuide] = useState(false)
  const readyToConnect = useAppSelector((state) => state.user.readyToConnect)
  return (
    <Backdrop>
      <FooterText variant="body1">
        MADE WITH ♥️ BY IEEE JUSB
      </FooterText>
      <div className="wrapper-group">
          {readyToConnect && showControlGuide && (
            <Wrapper>
              <Title>Controls</Title>
              <IconButton className="close" onClick={() => setShowControlGuide(false)} size="small">
                <CloseIcon />
              </IconButton>
              <ul>
                <li>
                  <strong>W, A, S, D or arrow keys</strong> to move
                </li>
                <li>
                  <strong>E</strong> to sit down (when facing a chair)
                </li>
                <li>
                  <strong>R</strong> to interact!
                </li>
                </ul>
            </Wrapper>
          )}
        </div>
      <ButtonGroup>
      {readyToConnect && (
            <Tooltip title="Control Guide">
              <StyledFab
                size="small"
                onClick={() => setShowControlGuide(!showControlGuide)}
              >
                <HelpOutlineIcon />
              </StyledFab>
            </Tooltip>
          )}
      <Tooltip title="Visit Our Official Website">
          <StyledFab size="small" href="https://www.ieee-jaduniv.in/" target="_blank">
            <HomeIcon />
          </StyledFab>
        </Tooltip>
        <Tooltip title="Follow Us on X">
          <StyledFab size="small" href="https://x.com/_ieeeju?t=TkHeupITSuACLko8_wXXyQ&s=09" target="_blank">
            <XIcon />
          </StyledFab>
        </Tooltip>
        <Tooltip title="Follow Us on Instagram">
          <StyledFab size="small" href="https://www.instagram.com/_ieeeju/" target="_blank">
            <InstagramIcon />
          </StyledFab>
        </Tooltip>
        <Tooltip title="Connect With Us on LinkedIn">
          <StyledFab size="small" href="https://www.linkedin.com/company/ieee-ju" target="_blank">
            <LinkedInIcon />
          </StyledFab>
        </Tooltip>
      </ButtonGroup>
    </Backdrop>
  )
}
 */