<template>
    <!-- 优先渲染 Ant Design 图标 -->
    <component
      v-if="antdIconComponent"
      :is="antdIconComponent"
      v-bind="$attrs"
      :style="mergedStyle"
    />
  
    <!-- 使用 SVG 雪碧图 -->
    <svg
      v-else
      :style="mergedStyle"
      aria-hidden="true"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <use :xlink:href="symbolId" />
    </svg>
  </template>
  
  <script>
  // 自动导入所有 Ant Design 图标（按需加载）
  const antdIcons = require.context(
    '@ant-design/icons-vue/es/icons',
    false,
    /Outlined\.js$/
  ).keys().reduce((acc, fileName) => {
    const name = fileName.replace('./', '').replace('.js', '')
    acc[name.toLowerCase()] = () => import(
      /* webpackChunkName: "antd-icon" */
      `@ant-design/icons-vue/es/icons/${fileName}`
    )
    return acc
  }, {})
  
  export default {
    name: 'SmartIcon',
    props: {
      type: {
        type: String,
        required: true
      },
      size: {
        type: [Number, String],
        default: 14
      },
      color: String
    },
    computed: {
      // 转换图标名称格式（如 user -> useroutlined）
      normalizedType() {
        return this.type.toLowerCase().replace(/-/g, '') + 'outlined'
      },
  
      // 动态加载 AntD 图标组件
      antdIconComponent() {
        const loader = antdIcons[this.normalizedType]
        return loader ? loader() : null
      },
  
      // 生成 SVG 雪碧图 ID
      symbolId() {
        return `#icon-${this.type}`
      },
  
      // 合并样式
      mergedStyle() {
        return {
          fontSize: `${this.size}px`,
          color: this.color,
          verticalAlign: '-0.15em',
          fill: 'currentColor'
        }
      }
    }
  }
  </script>