async function loadStatistics() {
    const res = await fetch("/api/statistics");
    const stats = await res.json();

    // Author stats
    document.getElementById("total-authors").textContent = `${stats.authorStats.totalAuthors}`;

    document.getElementById("most-followed").textContent = `${stats.authorStats.mostFollowed.nickname} (${stats.authorStats.mostFollowed.followers})`;
    document.getElementById("least-followed").textContent = `${stats.authorStats.leastFollowed.nickname} (${stats.authorStats.leastFollowed.followers})`;
}

loadStatistics();
