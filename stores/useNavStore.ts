import type { NavBarItem } from '~/modules/base/types'

const useNavStore = defineStore('nav', () => {
  const state = ref<NavBarItem[]>([
    {
      label: 'Home',
      path: '/',
      icon: ['ic:outline-home-max', 'ic:baseline-home-max'],
      badge: {
        label: '99+',
        type: 'large'
      }
    },
    {
      label: 'Favorites',
      path: '/favorites',
      icon: ['ic:baseline-favorite-border', 'ic:baseline-favorite'],
      badge: {
        label: 'new',
        type: 'large'
      }
    },
    {
      label: 'Dialog',
      path: '/dialog',
      icon: ['ic:outline-chat', 'ic:baseline-chat'],
      badge: {
        label: 3,
        type: 'small'
      }
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: ['ic:outline-settings', 'ic:baseline-settings'],
      badge: {
        label: 1,
        type: 'small'
      }
    }
  ])

  const router = useRouter()

  const active = computed(() =>
    state.value.find((item) => item.path === router.currentRoute.value.path)
  )

  const isLabelled = ref<boolean>(false)

  function toggleLabelled() {
    isLabelled.value = !isLabelled.value
  }

  return {
    state,
    active,
    isLabelled,
    toggleLabelled
  }
})

export { useNavStore }
