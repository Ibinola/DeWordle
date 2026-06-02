#!/usr/bin/env node
"use strict";

const { spawnSync } = require("node:child_process");

const REMEDIATION = {
  node: "Install Node.js >= 18 from https://nodejs.org or use nvm: `nvm install 20`",
  npm: "npm ships with Node.js. Reinstall Node.js from https://nodejs.org",
  rustc: "Install Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`",
  cargo: "Install Rust (includes cargo): `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`",
};

function checkCommand(command, args = ["--version"]) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  const ok = !result.error && result.status === 0;
  return {
    command,
    ok,
    output: (result.stdout || result.stderr || "").trim(),
    ...(ok ? {} : { remediation: REMEDIATION[command] ?? `Install \`${command}\` and ensure it is on your PATH` }),
  };
}

function trackNextSteps(track) {
  switch (track) {
    case "sc":
      return ["Run `cargo check --workspace`", "Run `cargo test --workspace`"];
    case "sdk":
      return ["Run `npm run typecheck --prefix soroban/sdk/ts`"];
    case "fe":
      return ["Run `npm run lint --prefix frontend`", "Run `npm run typecheck --prefix frontend`"];
    case "be":
      return ["Run `npm run lint --prefix backend`", "Run `npm run typecheck --prefix backend`", "Run `npm run test --prefix backend -- --runInBand`"];
    default:
      return ["Run `./scripts/ci-local.sh frontend backend soroban`"];
  }
}

function runBootstrap(track = "all") {
  const checks = [
    checkCommand("node"),
    checkCommand("npm"),
    checkCommand("rustc"),
    checkCommand("cargo"),
  ];

  const failures = checks.filter((check) => !check.ok);
  const result = {
    ok: failures.length === 0,
    track,
    checks,
    nextSteps: trackNextSteps(track),
    failures: failures.map((check) => check.command),
  };

  return result;
}

if (require.main === module) {
  const track = process.argv[2] || "all";
  const json = process.argv.includes("--json");
  const result = runBootstrap(track);

  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    console.log("Contributor bootstrap diagnostics");
    for (const check of result.checks) {
      console.log(`${check.ok ? "✓" : "✗"} ${check.command}${check.output ? ` (${check.output})` : ""}`);
      if (!check.ok) console.log(`  → ${check.remediation}`);
    }
    console.log("");
    console.log(`Track: ${track}`);
    for (const step of result.nextSteps) {
      console.log(`- ${step}`);
    }
  }

  process.exit(result.ok ? 0 : 1);
}

module.exports = { checkCommand, runBootstrap, trackNextSteps };
