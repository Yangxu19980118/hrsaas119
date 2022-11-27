import store from '@/store'
export default {
  methods: {
    checkPermission(point) {
      return store.getters.points.includes(point)
    }
  }
}
