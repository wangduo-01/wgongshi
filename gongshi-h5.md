# 公式学习H5应用 - Cursor开发规则

## 项目初始化

- 使用Create React App (TypeScript模板)初始化项目: `npx create-react-app gongshi-app --template typescript`
- 安装核心依赖: React Router DOM, Styled Components, FontAwesome图标
- 使用清晰的目录结构: `/components`, `/styles`, `/utils`, `/types`, `/contexts`
- 确保TypeScript配置正确，特别是JSX设置和类型声明

## 需求理解

- 公式学习应用面向中小学生，需要清晰易用的界面
- 核心功能包括：公式浏览、练习测试、错题本、收藏、打印
- 支持多学科(数学、物理、化学)和多年级(小学、初中、高中)
- 实现学习进度追踪和掌握度评估

## UI设计规范

- 使用一致的主题系统，定义在`src/styles/theme.ts`中
- 颜色系统: 主色(`#4a89dc`)、次色(`#e8f1fc`)、强调色(`#ff9500`)
- 组件边距尺寸: xs(5px), sm(10px), md(15px), lg(20px), xl(30px)
- 字体尺寸: small(12px), medium(14px), large(16px), xlarge(18px)
- 组件间距保持一致，遵循8px网格系统
- 响应式设计断点: mobile(480px), tablet(768px), desktop(1024px)

## 组件编写规则

### 通用原则

- 每个组件使用TypeScript接口严格定义Props
- 使用功能注释解释组件的作用和用法
- 共用组件放在`/components/common`，页面组件放在`/components/pages`
- 使用Styled Components命名组件时使用语义化名称
- 组件Props默认值在解构时设置，而不是在接口中

### 样式指南

- 使用Styled Components，避免内联样式
- 通过props.theme访问主题变量，而不是硬编码值
- 响应式样式通过主题中的断点定义
- 组件变体通过props实现，而不是创建多个组件
- 保持样式与业务逻辑分离

## 数据管理

- 使用TypeScript接口定义所有数据模型(`/types/models.ts`)
- 在开发阶段使用模拟数据(`/utils/mockData.ts`)
- 实际应用中应替换为API调用和后端交互
- 使用React上下文(Context)在组件间共享状态
- 本地存储(LocalStorage)用于保存用户偏好和数据

## 问题解决

- TypeScript类型问题：确保所有接口和类型定义正确
- Styled Components问题：正确配置theme类型
- React JSX问题：配置正确的tsconfig.json
- 依赖问题：确保package.json中的依赖版本兼容

## 项目测试

- 组件测试：确保UI组件正确渲染
- 功能测试：验证用户交互和数据流
- 响应式测试：检查不同屏幕尺寸的布局
- 浏览器兼容性测试：确保在主流浏览器中正常工作

## 性能优化

- 组件懒加载：使用React.lazy延迟加载非关键组件
- 图片优化：使用适当的格式和尺寸
- 缓存策略：利用本地存储缓存常用数据
- 按需加载：路由级别的代码分割

## 部署方法

- 构建优化：使用`npm run build`生成生产版本
- 静态资源托管：使用CDN加速静态资源
- CI/CD：配置自动化部署流程
- 环境配置：使用.env文件管理不同环境的变量

## 开发方法论

- 组件驱动开发：从小组件开始，逐步构建复杂界面
- 模块化思维：每个功能区域独立开发和测试
- 增量迭代：分阶段实现功能，快速获取反馈
- 代码审查：遵循一致的代码风格和最佳实践

记住，良好的代码组织和清晰的注释是项目长期维护的关键。始终考虑未来的开发者如何理解和扩展您的代码。 