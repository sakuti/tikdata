#!/usr/bin/env node

import { Command } from "commander";
import { fetchLikedVideos } from "../lib/parser.js";
import fs from "fs";
import path from "path";
import ora from "ora";

const program = new Command();

program
  .name("tikdata-export")
  .description("Export TikTok liked videos to local JSON")
  .version("1.0.0");

program
  .argument("<count>", 'Number of videos to download (number or "all")')
  .action(async (count) => {
    try {
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

      const outputFile = path.join(
        "./interface/public/exports",
        `liked_videos_${Date.now()}.json`,
      );
      console.log(`Fetching up to ${count} liked videos...`);

      let allVideos = [];
      let cursor = 0;
      let hasMore = true;

      // Initialize spinner
      const spinner = ora(`Fetched 0 videos so far...`).start();

      while (hasMore) {
        const data = await fetchLikedVideos(cursor);

        if (!data?.itemList || data.itemList.length === 0) {
          hasMore = false;
          break;
        }

        allVideos.push(...data.itemList);

        // Trim if we exceeded requested total
        if (allVideos.length >= totalToFetch) {
          allVideos = allVideos.slice(0, totalToFetch);
          hasMore = false;
          break;
        }

        // Update cursor for next page
        cursor = data?.cursor || 0;

        // Update hasMore flag from API
        hasMore = data?.hasMore ?? false;

        // Update spinner text
        spinner.text = `Fetched ${allVideos.length} video${allVideos.length !== 1 ? "s" : ""} so far...`;

        // Stop if no more pages
        if (!cursor || !hasMore) {
          hasMore = false;
        }
      }

      spinner.succeed(
        `Finished fetching ${allVideos.length} video${allVideos.length !== 1 ? "s" : ""}`,
      );

      // Write JSON file
      fs.writeFileSync(outputFile, JSON.stringify(allVideos, null, 2));
      console.log(`Saved ${allVideos.length} videos to ${outputFile}`);
    } catch (err) {
      console.error("Error fetching liked videos:", err.message);
    }
  });

program.parse(process.argv);
