/**
 * 在测试环境中模拟 window.fetch
 * - 将期望的返回值注入到全局 fetch
 * - 支持通过 expect.json() 获取解析后的数据
 */
export function mockFetch(expect: any) {
  expect.json = () => Promise.resolve(expect);
  const oriFetch = () => Promise.resolve(expect);
  const fetch = () => {
    return oriFetch();
  };
  Object.defineProperty(window, 'fetch', {
    value: fetch,
  });
}
