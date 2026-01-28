import { fetchLikedVideos } from "./parser.js";
import { timeAgoFromUnix } from "../utilities/datetime.js"


async function runTest() {
    try {
        const likedVideos = await fetchLikedVideos(0);

        if (
            !likedVideos ||
            !Array.isArray(likedVideos.itemList) ||
            likedVideos.itemList.length === 0
        ) {
            throw new Error("Empty or invalid itemList received");
        }

        const latestVideo = likedVideos.itemList[0];
        const authorNickname = latestVideo?.author?.nickname;
        const createTime = latestVideo?.createTime;

        if (!authorNickname || !createTime) {
            throw new Error("Missing expected video fields");
        }

        const timeAgo = timeAgoFromUnix(createTime);

        console.log(
            `Everything is working correctly. Your latest liked video was from creator called ` +
            `${authorNickname} and it was posted ${timeAgo} ago.`
        );
    } catch (error) {
        console.error(
            "Something is wrong and we couldn't retrieve data correctly."
        );
        console.error("Error details:", error.message);
    }
}


runTest();