const fs = require('fs')
const esbuild = require('esbuild')

const COMMENT = '//[remove_before_rollup]'

function beforeBuild() {
  const script = fs.readFileSync('./src/d3.ts', 'utf-8')
  fs.writeFileSync('./src/d3.ts', script.replace(COMMENT, ''), 'utf-8')
}

function afterBuild() {
  const script = fs.readFileSync('./src/d3.ts', 'utf-8')
  fs.writeFileSync('./src/d3.ts', COMMENT + script, 'utf-8')
}

const build = async () => {
  beforeBuild()
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    format: 'esm',
    outdir: 'dist',
    bundle: true,
    minify: false,
    platform: 'browser',
    sourcemap: true,
    target: 'chrome58',
    external: ['./node_modules/*'],
  })
  afterBuild()
}

build()
