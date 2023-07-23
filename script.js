let currentQuery = "sports"
let currentPage = 1;
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
let currentDate = yesterday.toISOString().slice(0, 10);
const fetchNews = async (page, q, date) => {
    console.log("Fetching News...");

    let url;
    if (date) {
        url = `http://lavender-butterfly-hem.cyclic.app/news?q=${q}&page=${page}&date=${date}`;
    } else {
        url = `http://lavender-butterfly-hem.cyclic.app/news?q=${q}&page=${page}`;
    }
    console.log(url);
    var req = new Request(url);
    let a = await fetch(req)
    let response = await a.json()
    console.log(JSON.stringify(response))

    console.log(response);
    let str = ""
    resultCount.innerHTML = response.totalResults;
    for (let item of response.articles) {
        str = str + `<div class="card my-4 mx-2" style="width: 18rem">
                <img src="${item.urlToImage}" class="card-img-top" alt="..." />
                <div class="card-body">
                    <h5 class="card-title">${item.title.slice(0,45)}...</h5>
                    <p class="card-text">
                      ${item.description.slice(0,88)}...
                    </p>
                    <p className="card-text"><small class="text-muted">By ${item.author || "unknown"} on ${item.publishedAt}</small></p>
                    <a href="${item.url}" target="_blank" class="btn btn-primary">Read Article</a>
                </div>
            </div>`
    }
    document.querySelector(".content").innerHTML = str
};

fetchNews(1, currentQuery, currentDate)
document.getElementById('search').addEventListener("click", (e) => {
    e.preventDefault();
    let query = document.getElementById('searchInput').value;
    currentQuery = query;
    let currentDate = document.getElementById('dateInput').value;
    fetchNews(1, currentQuery, currentDate)
})
document.getElementById('previous').addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage = currentPage - 1
        let currentDate = document.getElementById('dateInput').value;
        fetchNews(currentPage, currentQuery, currentDate)
    }
})
document.getElementById('next').addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = currentPage + 1;
    let currentDate = document.getElementById('dateInput').value;
    fetchNews(currentPage, currentQuery, currentDate)
})
document.getElementById('Tech').addEventListener("click", (e) => {
    e.preventDefault();
    currentQuery = "Technology"
    let currentDate = document.getElementById('dateInput').value;
    fetchNews(1, currentQuery, currentDate);
})
document.getElementById('sports').addEventListener("click", (e) => {
    e.preventDefault();
    currentQuery = "sports"
    let currentDate = document.getElementById('dateInput').value;
    fetchNews(1, currentQuery, currentDate);
})
document.getElementById('business').addEventListener("click", (e) => {
    e.preventDefault();
    currentQuery = "Business"
    let currentDate = document.getElementById('dateInput').value;
    fetchNews(1, currentQuery, currentDate);
})
document.getElementById('weather').addEventListener("click", (e) => {
    e.preventDefault();
    currentQuery = "weather"
    let currentDate = document.getElementById('dateInput').value;
    fetchNews(1, currentQuery, currentDate);
})
document.getElementById('health').addEventListener("click", (e) => {
    e.preventDefault();
    currentQuery = "health"
    let currentDate = document.getElementById('dateInput').value;
    fetchNews(1, currentQuery, currentDate);
})
const dateInput = document.getElementById('dateInput');
dateInput.addEventListener('change', (event) => {
    let currentDate = event.target.value; 
    fetchNews(1, currentQuery, currentDate);
});