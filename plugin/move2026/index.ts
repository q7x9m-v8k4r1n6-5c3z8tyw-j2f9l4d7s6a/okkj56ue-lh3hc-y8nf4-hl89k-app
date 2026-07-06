import { Move2026HomePage } from './pages/home'

export { move2026LandingContent } from './features/showcase-move'
export { Move2026HomePage } from './pages/home'
export { Move2026Landing } from './widgets/landing'

export const move2026Plugin = {
  name: 'move2026',
  pages: {
    HomePage: Move2026HomePage,
  },
} as const
