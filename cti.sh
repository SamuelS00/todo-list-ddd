#!/bin/sh

npm run cti create './src/@shared/application' -- -i '*spec.ts' -b &&
npm run cti create './src/@shared/domain' -- -i '*spec.ts' -b &&

npm run cti create './src/modules/todo/application' -- -i '*spec.ts' -b &&
npm run cti create './src/modules/todo/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/modules/todo/infrastructure' -- -i '*spec.ts' -b