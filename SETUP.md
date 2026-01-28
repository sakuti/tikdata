# TikData Setup Guide

This document explains exactly how to obtain the required values and configure TikData so it can run correctly. You do not need prior experience with reverse engineering or networking tools. Every step is explained.

## What You Will Need
- A desktop browser (Google Chrome, Brave, or Firefox recommended)
- A TikTok account
- Node.js and npm 
- TikData project files on your computer


## Overview

TikData requires three short-lived values from the TikTok web application. These values are used to authenticate requests as your own browser session.
- sid_guard (cookie value)
- secUid (query parameter)
- msToken (query parameter)
 
You need to:
- Open TikTok in your browser
- Open Developer Tools
- Copy required values
- Paste them into the environment configuration file

## Step 1: Open TikTok Web
1. Open your browser, go to https://www.tiktok.com
2. Log in to your TikTok account if not logged in yet
3. Make sure the page is fully loaded
4. Do not close this tab while doing the setup

## Step 2: Open Developer Tools

**On Windows / Linux**: Press F12 or Ctrl + Shift + I \
**On macOS**: Press Cmd + Option + I

*Developer Tools will open on the side or bottom of your browser.*

## Step 3: Get `sid_guard` (cookie)

1. In Developer Tools, click the Application tab 
2. Open "Cookies" dropdown 
3. Select https://www.tiktok.com, *You will see a table of cookies.*
4. Click inside the Filter or Search box
5. Search and click the row named `sid_guard`
6. Copy the "Value" column and paste to **.env.example** file.

> ⚠️ *Important: Copy the entire value exactly as it appears. Do not add quotes or spaces.*

## Step 4: Get secUid and msToken
1. Open Network Tab
2. In Developer Tools, click the Network tab
3. Make sure it is enabled (red record button should be on)
4. Click on your profile, liked videos, etc. to see requests that contain the required values.
5. In the Network tab search/filter box, type: `secUid` or `msToken`
6. Click any request that appears
7. After clicking a request, open the Payload tab (sometimes called Query String Parameters)
8. Scroll until you find: `secUid`, `msToken`. Copy each value separately and paste to **.env.example** file.

> ⚠️ *These values are case-sensitive, must be copied exactly, will expire after some time (so you might need to do this multiple times)*

## Step 5: Environment variables file
1. Locate .env.example file in your File Explorer
2. Rename it to `.env` from `.env.example`

## Step 6: Verify setup
1. Check that all three values are present
2. No placeholder text remains in `.env` file
3. No extra spaces or line breaks
4. TikTok browser session is still logged in

Remember; If TikData stops working later, repeat this setup. <u>Values expire</u>.

## Notes
TikData relies on your active browser session. This setup must be repeated periodically. Never share your .env file publicly. .You're Done. Once .env is configured, TikData is ready to run.

If something breaks, redo the setup carefully. Most issues come from expired or incorrectly copied values.