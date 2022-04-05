#!/bin/bash

source /home/vyadl/nodevenv/idli/14/bin/activate && cd /home/vyadl/idli;
git pull "https://vyadl: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@github.com/vyadl/idli.git" master;
npm install;
npm run build;
