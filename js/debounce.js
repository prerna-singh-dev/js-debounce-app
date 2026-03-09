export function init() {
  const inputText = document.getElementById("searchText");
  const showResults = document.getElementById("searchResult");

  let abortController;

  const debounceFun = debounceSearch(fetchData, 600);

  function debounceSearch(runFun, delay) {
    let timer;

    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => runFun(...args), delay);
    };
  }

  async function fetchData(value) {
    if (!value.trim()) {
      showResults.innerHTML = "";
      return;
    }

    if (abortController) {
      console.log("Aborting previous request");
      abortController.abort();
    }

    abortController = new AbortController();

    try {
      const resp = await fetch(
        "https://dummyjson.com/products/search?q=" + value,
        {
          signal: abortController.signal,
        }
      );
      if (!resp.ok) throw new Error("Network issue");
      const data = await resp.json();
      if (data.products.length > 0) {
        populateData(data.products);
      } else {
        showResults.innerHTML = "<li class='no-result'>No result found!</li>";
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("request aborted");
      } else {
        console.log("error::", err);
      }
    }
  }

  function populateData(searchData) {
    showResults.innerHTML = "";
    for (let i = 0; i < searchData.length; i++) {
      const newLi = document.createElement("li");
      const newtext = `<div>
    <h4>${searchData[i].title}</h4>
    <p>${searchData[i].description}</p>
    <p>Price : $${searchData[i].price}</p>
    </div>`;
      newLi.innerHTML = newtext;
      showResults.appendChild(newLi);
    }
  }

  inputText.addEventListener("input", function (e) {
    debounceFun(e.target.value);
  });
}
