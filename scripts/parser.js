/**
 * Required environment variables
 */
const {
    secuid_value: SEC_UID,
    mstoken_value: MS_TOKEN,
    sid_guard_value: SID_GUARD
} = process.env;


/**
 * Validate environment configuration early
 */
function validateEnv() {
    const missing = [];

    if (!SEC_UID) missing.push("secuid_value");
    if (!MS_TOKEN) missing.push("mstoken_value");
    if (!SID_GUARD) missing.push("sid_guard_value");

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}. ` +
            `Please read SETUP.md`
        );
    }
}

validateEnv();


/**
 * Static TikTok request parameters
 */
const BASE_URL = "https://www.tiktok.com/api/favorite/item_list/";

const DEFAULT_PARAMS = {
    WebIdLastTime: "1767736788",
    aid: "1988",
    count: "16"
};


/**
 * Build query string safely
 */
function buildQueryParams(extraParams = {}) {
    const params = {
        ...DEFAULT_PARAMS,
        secUid: SEC_UID,
        msToken: MS_TOKEN,
        ...extraParams
    };

    return new URLSearchParams(params).toString();
}


/**
 * Fetch liked videos
 */
async function fetchLikedVideos(cursor = 0) {
    const query = buildQueryParams({ cursor });

    const response = await fetch(`${BASE_URL}?${query}`, {
        headers: {
            accept: "*/*",
            cookie: `sid_guard=${SID_GUARD}`
        }
    });

    if (!response.ok) {
        throw new Error(
            `TikTok API request failed: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    if (!data || typeof data !== "object") {
        throw new Error("Invalid response received from TikTok API");
    }

    return data;
}

export {
    fetchLikedVideos
};
