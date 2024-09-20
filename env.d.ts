// 在项目的根目录创建 env.d.ts 文件
interface ImportMetaEnv {
  readonly VITE_GLOB_APP_TITLE: string;
  readonly MODE: string;
  // 你可以在这里继续定义其他环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
