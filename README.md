# TikData

Data archiving tool that extracts TikTok user data into JSON for offline storage and analysis. It allows users to export their liked videos and other interaction data into structured JSON files for offline storage, analysis, and categorization.

## Features
- Export TikTok liked videos as JSON
- Works with short-lived session tokens as there is no public APIs available
- Easy-to-follow setup for beginner programmers

## Notice
This version of TikData is an early prototype. Currently, it only supports the test command, which verifies that your environment is set up correctly and that TikTok data can be retrieved. There will be more features soon. The test command does not download or archive full datasets yet. <u>Future versions will include full liked video export, categorization, and local JSON storage.</u>

## Requirements
- Node.js ≥ 18
- A TikTok account
- Browser with Developer Tools (Chrome, Brave, or Firefox)
- Access to TikData project files

## Installation
1. Clone the repository:
    ```
    git clone https://github.com/sakuti/tikdata.git
    cd tikdata
    ```

2. Copy environment example:
    ```
    cp env.example .env
    ```

3. Follow [Setup Instructions](./SETUP.md) to fill in the required TikTok values:
    - sid_guard_value
    - secuid_value
    - mstoken_value

## Test command
Run `npm run test` and expect the following outputs

If everything is working:
```
Everything is working correctly. Your latest liked video was from creator called <user> and it was posted <amount> days ago.
```

If there is an error:
```
Something is wrong and we couldn't retrieve data correctly.
```

## Project structure
```
tikdata/
├── scripts/
│   ├── parser.js       # Main fetch logics
│   └── test.js         # Test script for verification
│
├── utilities/
│   └── datetime.js     # Datetime utility functions
│
├── .env                # Environment variables (after setup)
├── env.example         # Template for .env
│
├── SETUP.md            # Setup instructions
├── README.md           # Project documentation
│
├── .gitignore
└── package.json
```

## Things to consider
- Tokens (`sid_guard`, `secUid`, `msToken`) expire periodically; you may need to repeat the setup.
- Do not share your .env publicly.
- TikData relies on your own TikTok account session; only fetches your accessible data.

