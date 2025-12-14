#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import gradient from "gradient-string";
import ora from "ora";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

console.clear();

console.log(
  gradient.pastel(`
╭────────────────────────────╮
│   🚀 NPM MODULE TOOL       │
│   Advanced CLI Downloader  │
╰────────────────────────────╯
`)
);

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Select an option",
      choices: [
        "📦 Download NPM Module",
        "❌ Exit"
      ]
    }
  ]);

  if (action === "📦 Download NPM Module") {
    downloadModule();
  } else {
    console.log(chalk.red("\nBye Bye 👋"));
    process.exit(0);
  }
}

async function downloadModule() {
  const { moduleName } = await inquirer.prompt([
    {
      type: "input",
      name: "moduleName",
      message: "Enter NPM module name:",
      validate: input => input ? true : "Module name required"
    }
  ]);

  const spinner = ora("Fetching module...").start();

  const downloadDir = path.join(process.cwd(), "downloads");
  if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

  exec(`npm pack ${moduleName}`, { cwd: downloadDir }, (err, stdout) => {
    if (err) {
      spinner.fail("Failed to download module");
      console.log(chalk.red(err.message));
      return mainMenu();
    }

    const fileName = stdout.trim();
    spinner.succeed("Module downloaded successfully!");

    console.log(
      chalk.green(`
✔ Module: ${moduleName}
✔ Saved as: ${fileName}
✔ Location: /downloads
`)
    );

    mainMenu();
  });
}

mainMenu();
