// 在项目的根目录创建 env.d.ts 文件
interface ImportMetaEnv {
	/**
	 * @global 当前项目运行模式（生产/开发）
	*/
  readonly MODE: string;
	/**
	 * @global 项目标题
	 */
  readonly VITE_GLOB_APP_TITLE: string;
	/**
	 * @global 基本接口地址SPA
	 */
  readonly VITE_GLOB_API_URL: string;
	/**
	 * @global 文件上传地址
	 */
  readonly VITE_GLOB_UPLOAD_URL: string;
	/**
	 * @global 腾讯地图key
	 */
  readonly VITE_GEOCODER_KEY: string;
  // 你可以在这里继续定义其他环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
