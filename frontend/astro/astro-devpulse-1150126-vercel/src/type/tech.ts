export type TechStatus = 'mastered' | 'learning' | 'wishlist'

export type Tech = {
  data: {
    status: TechStatus,
    icon: string,
    name: string
  },
  body?: string
}

export type CategoryMap = Record<TechStatus, Tech[]>