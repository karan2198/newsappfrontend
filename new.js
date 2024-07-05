let currentQuery = "sports";
let currentPage = 1;
let currentDate = getYesterdayDate(); // Initial date is yesterday

// Function to get yesterday's date in YYYY-MM-DD format
function getYesterdayDate() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday.toISOString().slice(0, 10);
}

// Function to fetch news based on page, query, and optional date
const fetchNews = async (page, q, date) => {
    console.log("Fetching News...");

    let url = `https://newsappbackend-789w.onrender.com/news?q=${q}&page=${page}`;
    if (date) {
        url += `&date=${date}`;
    }
    console.log(url);

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        let data = await response.json();
        console.log(JSON.stringify(data));

        // Update UI with fetched news
        updateNewsUI(data);

        // Update pagination
        updatePagination(page, data.totalPages);
    } catch (error) {
        console.error('Error fetching news data:', error);
        document.querySelector(".content").innerHTML = `<p>Error fetching news data</p>`;
    }
};

// Function to update UI with news articles
const updateNewsUI = (data) => {
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
};

// Function to update pagination based on current page and total pages
const updatePagination = (currentPage, totalPages) => {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    // Calculate the range of page numbers to display
    let startPage = currentPage - 2;
    if (startPage < 1) {
        startPage = 1;
    }
    let endPage = startPage + 4;
    if (endPage > totalPages) {
        endPage = totalPages;
    }

    // Add 'Previous' button
    let previousBtn = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Previous" onclick="fetchNews(${currentPage - 1}, '${currentQuery}', '${currentDate}')">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
    paginationContainer.insertAdjacentHTML('beforeend', previousBtn);

    // Add page numbers with ellipses
    if (startPage > 1) {
        let ellipsisStart = `
            <li class="page-item disabled">
                <span class="page-link">...</span>
            </li>
        `;
        paginationContainer.insertAdjacentHTML('beforeend', ellipsisStart);
    }

    for (let i = startPage; i <= endPage; i++) {
        let pageItem = `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="fetchNews(${i}, '${currentQuery}', '${currentDate}')">${i}</a>
            </li>
        `;
        paginationContainer.insertAdjacentHTML('beforeend', pageItem);
    }

    if (endPage < totalPages) {
        let ellipsisEnd = `
            <li class="page-item disabled">
                <span class="page-link">...</span>
            </li>
        `;
        paginationContainer.insertAdjacentHTML('beforeend', ellipsisEnd);
    }

    // Add 'Next' button
    let nextBtn = `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Next" onclick="fetchNews(${currentPage + 1}, '${currentQuery}', '${currentDate}')">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
    paginationContainer.insertAdjacentHTML('beforeend', nextBtn);
};

// Initial fetch on page load
fetchNews(currentPage, currentQuery, currentDate);

// Event listener for search button
document.getElementById('search').addEventListener("click", (e) => {
    e.preventDefault();
    let query = document.getElementById('searchInput').value;
    currentQuery = query;
    currentDate = document.getElementById('dateInput').value;
    fetchNews(1, currentQuery, currentDate);
});

// Event listener for category links
const categories = ['Tech', 'sports', 'business', 'weather', 'health'];
categories.forEach(category => {
    document.getElementById(category).addEventListener("click", (e) => {
        e.preventDefault();
        currentQuery = category;
        currentDate = document.getElementById('dateInput').value;
        fetchNews(1, currentQuery, currentDate);
    });
});

// Event listener for date input change
const dateInput = document.getElementById('dateInput');
dateInput.addEventListener('change', (event) => {
    currentDate = event.target.value;
    fetchNews(1, currentQuery, currentDate);
});
