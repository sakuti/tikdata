/**
 * Convert Unix timestamp (seconds) to natural language time
 */
function timeAgoFromUnix(unixSeconds) {
    const now = Date.now();
    const then = unixSeconds * 1000;
    const diffMs = now - then;

    if (diffMs < 0) return "just now";

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years !== 1 ? "s" : ""}`;
    if (months > 0) return `${months} month${months !== 1 ? "s" : ""}`;
    if (days > 0) return `${days} day${days !== 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
}

export {
    timeAgoFromUnix
}