#!/usr/bin/env node

import { Command } from "commander";
import { fetchLikedVideos } from "../lib/parser.js"; 
import fs from "fs";
import { createRequiredDirectories } from "../utilities/fs.js";

const program = new Command();

program
    .name("tikdata-export")
    .description("Export TikTok liked videos to local JSON")
    .version("1.0.0");

program
    .argument("<count>", 'Number of videos to download (number or "all")')
    .action(async (count) => {
        try {
            // Ensure that required directories exist
            createRequiredDirectories()

            let totalToFetch;

            if (count.toLowerCase() === "all") {
                totalToFetch = Infinity;
            } else {
                totalToFetch = parseInt(count, 10);
                if (isNaN(totalToFetch) || totalToFetch <= 0) {
                    console.error("Please enter a valid number greater than 0 or 'all'");
                    process.exit(1);
                }
            }

            console.log(`Fetching up to ${count} liked videos...`);

            let allVideos = [];
            let cursor = 0;
            let done = false;

            while (!done) {
                const data = await fetchLikedVideos(cursor);

                if (!data?.itemList || data.itemList.length === 0) {
                    done = true;
                    break;
                }

                allVideos.push(...data.itemList);

                if (allVideos.length >= totalToFetch) {
                    allVideos = allVideos.slice(0, totalToFetch);
                    done = true;
                    break;
                }

                cursor = data?.cursor || 0;

                if (!cursor) done = true; 
            }

            const outputFile = `./exports/liked_videos_${Date.now()}.json`;
            fs.writeFileSync(outputFile, JSON.stringify(allVideos, null, 2));

            console.log(`Done! Saved ${allVideos.length} videos to ${outputFile}`);
        } catch (err) {
            console.error("Error fetching liked videos:", err.message);
        }
    });

program.parse(process.argv);
