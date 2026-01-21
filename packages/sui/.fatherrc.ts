// Father 构建配置：继承仓库的基础配置，保持统一的打包规则
import { defineConfig } from 'father';

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
});
