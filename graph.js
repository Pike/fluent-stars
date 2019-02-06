const REPOS = new Set([
    "fluent",
    "fluent.js",
    "python-fluent",
    "fluent-rs",
]);
const START_DATE = new Date(2018, 6);
var data = null, date_data = [];
async function load_data() {
    let all_data = (
        await fetch("fluent-stars-result.json").then(r => r.json())
    ).data.search.edges;
    data = all_data.map(n => n.node).filter(n => REPOS.has(n.name));
}

function transform() {
    let totalCount = 0;
    let starredAt = [];
    for (let d of data) {
        totalCount += d.stargazers.totalCount;
        starredAt = starredAt.concat(d.stargazers.edges.map(e => e.starredAt));
    }
    console.log(totalCount);
    return starredAt
        .sort().reverse()
        .map(d => ({date:new Date(d), c:totalCount--}))
        .filter(d => d.date > START_DATE)
        .reverse();
}

function render() {
    let ctx = document.getElementById("graph").getContext('2d');
    let maxdate = Math.max(date_data[date_data.length-1].date, new Date(2019, 3));
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: "Stars",
                data: date_data.map(d => ({x: d.date, y: d.c})),
            }]
        },
        options: {
            steppedLine: 'after',
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        max: maxdate,
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 1000,
                    },
                }],
            }
        },
    });
}

async function boot() {
    await load_data();
    date_data = transform();
    render();
}
boot();
