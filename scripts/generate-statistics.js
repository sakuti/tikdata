#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import ora from "ora";
import { computeAuthorStats } from "../lib/statistics.js";

const program = new Command();

program
    .name("tikdata-generate-statistics")
    .description("Generate statistics from exported TikTok liked videos")
    .version("1.0.0");

program
    .argument("<file>", "JSON file to read exported liked videos from")
    .action(async (file) => {
        try {
            const inputPath = path.resolve(file);
            if (!fs.existsSync(inputPath)) {
                console.error(`File not found: ${inputPath}`);
                process.exit(1);
            }

            const spinner = ora("Loading videos...").start();
            const videos = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
            spinner.succeed(`Loaded ${videos.length} videos`);

            spinner.start("Computing statistics...");

            const statistics = {
                authorStats: await computeAuthorStats(videos),
            };

            spinner.succeed("Statistics computation complete");

            const outputPath = path.join("./interface/public/exports", "statistics.json");
            fs.writeFileSync(outputPath, JSON.stringify(statistics, null, 2));
            console.log(`Statistics saved to ${outputPath}`);

        } catch (err) {
            console.error("Error generating statistics:", err.message);
        }
    });

program.parse(process.argv);