async function loadStatistics() {
    const res = await fetch("/api/statistics");
    const stats = await res.json();

    // Author stats
    document.getElementById("most-followed").textContent = `${stats.authorStats.mostFollowed.nickname} (${stats.authorStats.mostFollowed.followerCount})`;
    document.getElementById("least-followed").textContent = `${stats.authorStats.leastFollowed.nickname} (${stats.authorStats.leastFollowed.followerCount})`;
    document.getElementById("avg-followers").textContent = stats.authorStats.avgFollowerCount;

    // Ads
    document.getElementById("ad-total").textContent = stats.ads.total;
    document.getElementById("ad-percentage").textContent = stats.ads.percentage;

    // Monthly likes chart
    const monthlyCtx = document.getElementById("monthlyChart").getContext("2d");
    new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(stats.monthlyLikes),
            datasets: [{
                label: 'Liked Videos',
                data: Object.values(stats.monthlyLikes),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
        }
    });

    // Hashtags chart (top 20)
    const hashtags = Object.entries(stats.hashtags)
        .sort((a,b) => b[1]-a[1])
        .slice(0,20);

    const hashtagsCtx = document.getElementById("hashtagsChart").getContext("2d");
    new Chart(hashtagsCtx, {
        type: 'bar',
        data: {
            labels: hashtags.map(h => h[0]),
            datasets: [{
                label: 'Hashtag Frequency',
                data: hashtags.map(h => h[1]),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
        }
    });
}

loadStatistics();
