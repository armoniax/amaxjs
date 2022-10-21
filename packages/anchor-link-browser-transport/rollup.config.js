import fs from 'fs'
import dts from 'rollup-plugin-dts'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import {terser} from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'

import pkg from './package.json'

const license = fs.readFileSync('LICENSE').toString('utf-8').trim()
const banner = `
/**
 * Anchor Link Browser Transport v${pkg.version}
 * ${pkg.homepage}
 *
 * @license
 * ${license.replace(/\n/g, '\n * ')}
 */
`.trim()

const extensions = ['.js', '.mjs', '.ts']

const replaceVersion = replace({
    preventAssignment: true,
    __ver: `${pkg.version}`,
})

export default [
    {
        input: 'src/index.ts',
        output: {
            banner,
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            exports: 'default',
        },
        plugins: [replaceVersion, typescript({target: 'es6'}), json()],
        external: Object.keys({...pkg.dependencies, ...pkg.peerDependencies}),
        onwarn,
    },
    {
        input: 'src/index.ts',
        output: {
            banner,
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
        },
        plugins: [replaceVersion, typescript({target: 'es2020'}), json()],
        external: Object.keys({...pkg.dependencies, ...pkg.peerDependencies}),
        onwarn,
    },
    {
        input: 'src/index.ts',
        output: {banner, file: pkg.types, format: 'esm'},
        onwarn,
        plugins: [dts(), json()],
    },
    {
        input: 'src/index.ts',
        output: {
            globals: {'anchor-link': 'AnchorLink'},
            banner,
            name: 'AnchorLinkBrowserTransport',
            file: pkg.unpkg,
            format: 'iife',
            sourcemap: true,
        },
        plugins: [
            replaceVersion,
            resolve({extensions}),
            commonjs(),
            babel({
                extensions,
                babelHelpers: 'bundled',
                include: ['src/**/*'],
                presets: [
                    '@babel/preset-typescript',
                    [
                        '@babel/preset-env',
                        {
                            targets: '>0.25%, not dead',
                            useBuiltIns: 'usage',
                            corejs: '3',
                        },
                    ],
                ],
                plugins: ['@babel/plugin-proposal-class-properties'],
            }),
            terser({
                format: {
                    comments(_, comment) {
                        return comment.type === 'comment2' && /@license/.test(comment.value)
                    },
                    max_line_len: 500,
                },
            }),
            json(),
        ],
        external: Object.keys({...pkg.peerDependencies}),
        onwarn,
    },
]

function onwarn(warning, rollupWarn) {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        rollupWarn(warning)
    }
}
