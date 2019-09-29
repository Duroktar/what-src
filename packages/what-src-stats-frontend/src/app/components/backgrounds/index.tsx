import * as React from 'react'
import { CloudyDayBackground } from './cloudy-day'

export const Backgrounds = {
  'Cloudy Day': CloudyDayBackground,
} as const

export type BackgroundType = keyof typeof Backgrounds

export const BackgroundNames = Object.keys(Backgrounds) as BackgroundType[]

type BackgroundComponentProps = {
  background: BackgroundType;
  children: React.ReactNode;
}

export const BackGroundComponent = React.memo(({ background, children }: BackgroundComponentProps) => {
  const Background = React.useMemo(() => Backgrounds[background], [background])
  return <Background>{children}</Background>
})

BackGroundComponent.displayName = 'BackGroundComponent'
