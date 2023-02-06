#!/bin/sh

npm run cti create './src/@shared/application' -- -i '*spec.ts' -b &&
npm run cti create './src/@shared/domain' -- -i '*spec.ts' -e 'tests' -b &&
npm run cti create './src/@shared/infrastructure' -- -i '*spec.ts' -b &&

npm run cti create './src/todo/application' -- -i '*spec.ts' -b &&
npm run cti create './src/todo/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/todo/infrastructure' -- -i '*spec.ts' -b