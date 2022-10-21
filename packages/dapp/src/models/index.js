/**
 * 自动生成，只需添加models文件即可
 */
const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context('./', false, /\.ts$/);
export default requireAll(req).map(m => m.default);
