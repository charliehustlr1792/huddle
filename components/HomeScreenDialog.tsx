import React, { useState } from 'react'
import logo from '../public/assets/cypher/Cypher.png'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Image from 'next/image'
import { useEffect } from 'react'
import { useAppSelector } from '../hooks'


import { getGameInstance } from './PhaserGame'
import Preloader from '../components/Preloader'
import { SignInForm,SignUpForm } from './AuthForms'

const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
   z-index: 1000;
`

const Wrapper = styled.div`
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
`

const CustomRoomWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;

  .tip {
    font-size: 18px;
  }
`

const TitleWrapper = styled.div`
  display: grid;
  width: 100%;

  .back-button {
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
    align-self: center;
  }

  h1 {
    grid-column: 1;
    grid-row: 1;
    justify-self: center;
    align-self: center;
  }
`

const Title = styled.h1`
  font-size: 24px;
  color: #eee;
  text-align: center;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px 0;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 8px;
    height: 120px;
  }
`

const LogoContainer = styled.div`
  width: 200px;
  height: 120px;
  position: relative;
  margin-bottom: 10px;
`

/* const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    color: #33ac96;
  }
`

const ProgressBar = styled(LinearProgress)`
  width: 360px;
` */

export default function HomeScreenDialog() {
  const phaserGame = getGameInstance();
  const [showSignUpForm, setShowSignUpForm] = useState(false)
  const [showSignInForm, setShowSignInForm] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)

  const loggedIn = useAppSelector((state) => state.user.loggedIn)


  useEffect(() => {
    // This effect runs when loggedIn state changes
    if (loggedIn && phaserGame) {
      console.log('User logged in, launching game from HomeScreenDialog')
      const preloader = phaserGame.scene.keys.preloader as Preloader
      if (preloader) {
        preloader.launchGame()
      } else {
        console.error('Preloader scene not found')
        setShowSnackbar(true)
      }
    } else if (!loggedIn) {
      setShowSnackbar(true)
    }
  }, [loggedIn, phaserGame])

  /* useEffect(() => {
    // When user is logged in, ensure all dialogs are hidden
    if (loggedIn) {
      const preloader = phaserGame?.scene.keys.preloader as Preloader
      preloader.launchGame()
    }
    else {
      setShowSnackbar(true)
    }}, [loggedIn]) */
  /*const handleConnect = () => {
    if (lobbyJoined) {
      const preloader = phaserGame.scene.keys.preloader as Preloader
      preloader.network
        .joinOrCreatePublic()
        .then(() => preloader.launchGame())
        .catch((error) => console.error(error))
    } else {
      setShowSnackbar(true)
    }
  } */

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false)
        }}
      >
        <Alert
          severity="error"
          variant="outlined"
          // overwrites the dark theme on render
          style={{ background: '#fdeded', color: '#7d4747' }}
        >
          Trying to connect to server, please try again!
        </Alert>
      </Snackbar>
      <Backdrop>
        <Wrapper>
          {showSignUpForm ? (
            <CustomRoomWrapper>
              <TitleWrapper>
                <IconButton className="back-button" onClick={() => setShowSignUpForm(false)}>
                  <ArrowBackIcon />
                </IconButton>
                <Title>SignUp</Title>
              </TitleWrapper>
              <SignUpForm />
            </CustomRoomWrapper>
          ) : showSignInForm ? (
            <CustomRoomWrapper>
              <TitleWrapper>
                <IconButton className="back-button" onClick={() => setShowSignInForm(false)}>
                  <ArrowBackIcon />
                </IconButton>
                <Title>Sign In</Title>
              </TitleWrapper>
             <SignInForm/>
            </CustomRoomWrapper>
          ) : (
            <>
              <Title>Welcome to Cypher3331</Title>
              <Content>
                <LogoContainer>
                  <Image
                    src={logo}
                    alt="Cypher Logo"
                    fill
                    style={{ objectFit: "contain" }} 
                    priority
                  />
                </LogoContainer>
                <Button variant="contained" color="secondary" onClick={() => setShowSignUpForm(true)}>
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setShowSignInForm(true)}
                >
                  SignIn
                </Button>
              </Content>
            </>
          )}
        </Wrapper>
         {/* {!lobbyJoined && (
          <ProgressBarWrapper>
            <h3> Connecting to server...</h3>
            <ProgressBar color="secondary" />
          </ProgressBarWrapper>
        )}  */}
      </Backdrop>
    </>
  )
}