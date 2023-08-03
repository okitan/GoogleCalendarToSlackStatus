#!/usr/bin/env node

"use strict";

const { readdirSync, readFileSync, writeFileSync } = require("fs");

const files = readdirSync("src").filter((file) => file.endsWith(".ts"));

const libs = files.filter((file) => file !== "Code.ts");

const claspJson = JSON.parse(readFileSync("src/.clasp.json", "utf8"));
claspJson.filePushOrder = [...libs, "Code.ts"];

writeFileSync("src/.clasp.json", JSON.stringify(claspJson, null, 2));
