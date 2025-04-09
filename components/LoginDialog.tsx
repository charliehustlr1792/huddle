import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import Image from 'next/image'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import Adam from '../public/images/login/Adam_login.png'
import Ash from '../public/images/login/Ash_login.png'
import Lucy from '../public/images/login/Lucy_login.png'
import Nancy from '../public/images/login/Nancy_login.png'
import { useAppSelector, useAppDispatch } from '../hooks'
import { getGameInstance } from './PhaserGame'
import Game from './Game'
import { setReadyToConnect,setInitialisation } from '../stores/UserStore'
import Preloader from './Preloader'

const Wrapper = styled.form`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #222639;
  border-radius: 16px;
  padding: 36px 60px;
  box-shadow: 0px 0px 5px #0000006f;
   z-index: 1000;
`

const Title = styled.p`
  margin: 5px;
  font-size: 20px;
  color: #c2c2c2;
  text-align: center;
`


const SubTitle = styled.h3`
  width: 160px;
  font-size: 16px;
  color: #eee;
  text-align: center;
`

const Content = styled.div`
  display: flex;
  margin: 36px 0;
`

const Left = styled.div`
  margin-right: 48px;

  --swiper-navigation-size: 24px;

  .swiper {
    width: 160px;
    height: 220px;
    border-radius: 8px;
    overflow: hidden;
  }

  .swiper-slide {
    width: 160px;
    height: 220px;
    background: #dbdbe0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-slide img {
    display: block;
    width: 95px;
    height: 136px;
    object-fit: contain;
  }
`

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

/* const Warning = styled.div`
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
` */

const avatars = [
  { name: 'adam', img: Adam },
  { name: 'ash', img: Ash },
  { name: 'lucy', img: Lucy },
  { name: 'nancy', img: Nancy },
]

// shuffle the avatars array
for (let i = avatars.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[avatars[i], avatars[j]] = [avatars[j], avatars[i]]
}

export default function LoginDialog() {
  const phaserGame: Phaser.Game | null | undefined = getGameInstance()
  const name=useAppSelector((state) => state.auth.name)
  const [avatarIndex, setAvatarIndex] = useState<number>(0)
  const dispatch = useAppDispatch()
  const game = phaserGame?.scene.keys.game as Game
  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
      console.log('Join! Name:', name, 'Avatar:', avatars[avatarIndex].name)
      game.registerKeys()
      if (game) {
        // Store selected avatar and name in Redux store
        dispatch(setInitialisation({
          name:name,
          avatar: avatars[avatarIndex].name
        }))
      }
      dispatch(setReadyToConnect(true));
      if (phaserGame) {
        const preloader = phaserGame.scene.keys.preloader as Preloader
        if (preloader) {
          console.log('Manually launching game from LoginDialog')
          preloader.launchGame()
        }
        
        // Get the game scene and register keys if it exists
        const gameScene = phaserGame.scene.keys.game as Game
        if (gameScene) {
          gameScene.registerKeys()
        }
      }
  }

  return (
    <Wrapper onSubmit={handleSubmit}>
      <Title>Welcome to Cypher3331</Title>
      <Content>
          <SubTitle>Select an avatar</SubTitle>
          <Left>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={(swiper) => {
              setAvatarIndex(swiper.activeIndex)
            }}
          >
            {avatars.map((avatar) => (
              <SwiperSlide key={avatar.name}>
                <Image src={avatar.img} alt={avatar.name} />
              </SwiperSlide>
            ))}
          </Swiper>
          </Left>
      </Content>
      <Bottom>
        <Button variant="contained" color="secondary" size="large" type="submit">
          Join
        </Button>
      </Bottom>
    </Wrapper>
  )
}
