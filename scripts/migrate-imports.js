const { execSync } = require('node:child_process');
const { readFileSync, writeFileSync } = require('node:fs');

function listFiles() {
  const inputDirs = process.argv.slice(2);
  const dirs = inputDirs.length ? inputDirs : ['packages', 'docs', '.dumi', 'examples'];
  const files = [];
  for (const d of dirs) {
    try {
      const cmd = `find ${d} -type f \\( -name '*.ts' -o -name '*.tsx' -o -name '*.md' -o -name '*.mdx' \\) ! -path '*/dist/*' ! -path '*/lib/*'`;
      const out = execSync(cmd, { encoding: 'utf8' }).trim();
      if (out) files.push(...out.split('\n'));
    } catch (e) {
      // ignore missing dirs
    }
  }
  return files;
}

function migrate() {
  const replacements = [
    // brand & textual mentions
    ['Ant Design Web3', 'Pelican Web3'],
    ['ant-design-web3', 'pelican-web3-lib'],
    ['@ant-design/web3-ethers/wagmi', 'pelican-web3-lib-ethers/wagmi'],
    ['@ant-design/web3-ethers/provider', 'pelican-web3-lib-ethers/provider'],
    ['@ant-design/web3-ethers/wallets', 'pelican-web3-lib-ethers/wallets'],
    ['@ant-design/web3-assets/solana', 'pelican-web3-lib-assets/solana'],
    ['@ant-design/web3-assets/tokens', 'pelican-web3-lib-assets/tokens'],
    ['@ant-design/web3-assets/wallets', 'pelican-web3-lib-assets/wallets'],
    ['@ant-design/web3-ethers-v5/wagmi', 'pelican-web3-lib-ethers-v5/wagmi'],
    ['@ant-design/web3-ethers-v5', 'pelican-web3-lib-ethers-v5'],
    ['@ant-design/web3-ethers', 'pelican-web3-lib-ethers'],
    ['@ant-design/web3-wagmi', 'pelican-web3-lib-evm'],
    ['@ant-design/web3-eth-web3js', 'pelican-web3-lib-eth-web3js'],
    ['@ant-design/web3-solana', 'pelican-web3-lib-solana'],
    ['@ant-design/web3-sui', 'pelican-web3-lib-sui'],
    ['@ant-design/web3-ton', 'pelican-web3-lib-ton'],
    ['@ant-design/web3-bitcoin', 'pelican-web3-lib-bitcoin'],
    ['@ant-design/web3-tron', 'pelican-web3-lib-tron'],
    ['@ant-design/web3-common', 'pelican-web3-lib-common'],
    ['@ant-design/web3-icons', 'pelican-web3-lib-icons'],
    ['@ant-design/web3-assets', 'pelican-web3-lib-assets'],
    ['@ant-design/web3', 'pelican-web3-lib'],
  ];

  const files = listFiles();
  let changed = 0;
  for (const f of files) {
    let content = readFileSync(f, 'utf8');
    const original = content;
    for (const [from, to] of replacements) {
      content = content.split(from).join(to);
    }
    if (content !== original) {
      writeFileSync(f, content);
      changed++;
    }
  }
  console.log(`migrate-imports: updated ${changed} files of ${files.length}`);
}

if (require.main === module) {
  migrate();
}
