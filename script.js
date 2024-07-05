let currentQuery = "sports";
let currentPage = 1;
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
let currentDate = yesterday.toISOString().slice(0, 10);

const fetchNews = async (page, q, date) => {
    console.log("Fetching News...");

    let url;
    if (date) {
        url = `http://localhost:8000/news?q=${q}&page=${page}&date=${date}`;
    } else {
        url = `http://localhost:8000/news?q=${q}&page=${page}`;
    }
    console.log(url);

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        let data = await response.json();
        console.log(JSON.stringify(data));

        let str = "";
        document.getElementById('resultCount').innerHTML = data.totalResults;
        for (let item of data.articles) {
            str += `<div class="card my-4 mx-2" style="width: 19rem">
                    <img src="${item.urlToImage || 'default.jpg'}" class="card-img-top" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title">${item.title ? item.title.slice(0, 45) : 'No title'}...</h5>
                        <p class="card-text">
                          ${item.description ? item.description.slice(0, 88) : 'No description'}...
                        </p>
                        <p class="card-text"><small class="text-muted">By ${item.author || "unknown"} on ${item.publishedAt}</small></p>
                        <a href="${item.url}" target="_blank" class="btn btn-primary" style="background-color: #2b3035; border: none; outline: none">Read Article</a>
                    </div>
                </div>`;
        }
        document.querySelector(".content").innerHTML = str;
    } catch (error) {
        console.error('Error fetching news data:', error);
        document.querySelector(".content").innerHTML = `<p>Error fetching news data</p>`;
    }
};

fetchNews(1, currentQuery, currentDate);

document.getElementById('search').addEventListener("click", (e) => {
    e.preventDefault();
    let query = document.getElementById('searchInput').value;
    currentQuery = query;
    let currentDate = document.getElementById('dateInput').value;
    fetchNews(1, currentQuery, currentDate);
});

document.getElementById('previous').addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage -= 1;
        let currentDate = document.getElementById('dateInput').value;
        fetchNews(currentPage, currentQuery, currentDate);
    }
});

document.getElementById('next').addEventListener("click", (e) => {
    e.preventDefault();
    currentPage += 1;
    let currentDate = document.getElementById('dateInput').value;
    fetchNews(currentPage, currentQuery, currentDate);
});

const categories = ['Tech', 'sports', 'business', 'weather', 'health'];
categories.forEach(category => {
    document.getElementById(category).addEventListener("click", (e) => {
        e.preventDefault();
        currentQuery = category;
        let currentDate = document.getElementById('dateInput').value;
        fetchNews(1, currentQuery, currentDate);
    });
});

const dateInput = document.getElementById('dateInput');
dateInput.addEventListener('change', (event) => {
    let currentDate = event.target.value;
    fetchNews(1, currentQuery, currentDate);
});
