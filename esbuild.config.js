const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

const FUNCTIONS_DIR = path.join(__dirname, 'src', 'functions')

function findHandlers(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            return findHandlers(fullPath)
        }

        if (entry.isFile() && entry.name.endsWith('.handler.ts')) {
            return [fullPath]
        }

        return []
    })
}

const handlerPaths = findHandlers(FUNCTIONS_DIR)

// Strip the ".handler" suffix from the output filename (e.g. "check.handler.ts" -> "check.js")
// so the AWS Lambda handler string can stay in the simple "<file>.handler" form.
const entryPoints = handlerPaths.map((handlerPath) => {
    const relativePath = path.relative(FUNCTIONS_DIR, handlerPath)
    const out = relativePath.replace(/\.handler\.ts$/, '')

    return { in: handlerPath, out }
})

esbuild
    .build({
        entryPoints,
        outdir: 'dist/functions',
        bundle: true,
        platform: 'node',
        target: 'node20',
        format: 'cjs',
        sourcemap: true,
        minify: true,
    })
    .then(() => {
        console.log(`Built ${entryPoints.length} function(s):`)
        entryPoints.forEach(({ in: entry, out }) => console.log(`  ${path.relative(__dirname, entry)} -> dist/functions/${out}.js`))
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
