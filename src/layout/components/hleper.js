
import { pathResolve } from '@/utils/routerHelper'

export const filterAffixTags = (routes, parentPath = '/') => {
  let tags = []
  routes.forEach((route) => {
    const meta = route.meta ?? {}
    const tagPath = pathResolve(parentPath, route.path)
    // console.log(1111)
    if (meta.affix) {
      // console.log(1111)
      tags.push({ ...route, path: tagPath, fullPath: tagPath })
    }
    if (route.children) {
      const tempTags= filterAffixTags(route.children, tagPath)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })

  return tags
}
