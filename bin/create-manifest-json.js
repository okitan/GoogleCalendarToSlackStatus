#!/usr/bin/env node

"use strict";

const { readFileSync, writeFileSync } = require("fs");

const manifestTemplate = JSON.parse(readFileSync("manifest.template.json", "utf8"));
const claspJson = JSON.parse(readFileSync("src/.clasp.json", "utf8"));

manifestTemplate.oauth_config.redirect_urls = [`https://script.google.com/macros/d/${claspJson.scriptId}/usercallback`];

writeFileSync("manifest.json", JSON.stringify(manifestTemplate, null, 2));
