/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

const pkgDepMap = new Map();
function scanDir(dir) {
    try {
        const content = fs.readFileSync(path.resolve(dir, 'package.json'), { encoding: 'utf-8' });
        const json = JSON.parse(content);
        const depVersionMap = new Map();
        const deps = {
            ...(json.dependencies || {}),
            ...(json.devDependencies || {}),
            ...(json.peerDependencies || {}),
        };
        Object.entries(deps).forEach(([pkgName, version]) => {
            const numVersion = getNumberVersion(version);
            if (numVersion) {
                depVersionMap.set(pkgName, numVersion);
            }
        });
        pkgDepMap.set(json.name, {
            version: json.version,
            depVersionMap,
        });
    } catch (e) {
        //
    }
    fs.readdirSync(dir).forEach((subDir) => {
        const newPath = path.resolve(dir, subDir);
        if (!['node_modules', 'lib'].includes(subDir) && fs.statSync(newPath).isDirectory()) {
            scanDir(newPath);
        }
    });
}
function getDepTree() {
    // eslint-disable-next-line no-undef
    scanDir(path.resolve(process.cwd(), 'packages'));
}

async function getLineVersion(pkgName) {
    const data = await fetch(`https://registry.npmjs.org/-/package/${pkgName}/dist-tags`).then((response) =>
        response.json()
    );
    if (data === 'Unauthorized' || data === 'Not Found') {
        return '';
    }
    return data.latest.trim();
}

async function findMismatchPackage() {
    const resultMap = {};

    for (const [pkgName, { version }] of pkgDepMap.entries()) {
        const oldVersion = await getLineVersion('react');
        console.log(oldVersion, version);
        try {
            // const oldVersion = execSync(`npm view ${pkgName} version`);
            // console.log('oldVersion', pkgName, oldVersion.toString().trim());
        } catch (e) {
            console.log('11111111111', e);
        }
        // for (const [depName, version] of depVersionMap.entries()) {
        //     const oldVersion = execSync(`npm view ${depName} version`);
        //     console.log('depName', depName, version);
        //     if (pkgDepMap.has(depName) && version !== pkgDepMap.get(depName).version) {
        //         misMatchDeps.push(depName);
        //     }
        // }
        // resultMap[pkgName] = misMatchDeps;
    }
    return resultMap;
}

function getNumberVersion(versionString) {
    return versionString.replace(/^[^\d]*/, '');
}

function run() {
    getDepTree();
    const resultMap = findMismatchPackage();
    for (const [pkgName, misMatchDeps] of Object.entries(resultMap)) {
        if (misMatchDeps.length === 0) {
            continue;
        }
        console.log(`The dependencies in ${pkgName} is mismatched:`);
        misMatchDeps.forEach((dep) => {
            console.log(`\t${dep} should have version ${pkgDepMap.get(dep).version}`);
        });
    }
    if (Object.values(resultMap).some((v) => v.length > 0)) {
        process.exit(1);
    }
}
run();
