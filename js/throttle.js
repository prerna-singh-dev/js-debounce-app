export function init() {
  const postBlock = document.getElementById("postData");
  const throttlePanel = document.getElementById('throttle')

  let dataGap = 0;

  async function fetchPost() {
    try {
      const result = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=10&_start=" + dataGap
      );

      if (!result.ok) throw new Error("Network issue");
      const data = await result.json();
      populatePostData(data);
      if (dataGap <= 100) dataGap += 10;
    } catch (err) {
      console.log("error::", err);
    }
  }

  function populatePostData(data) {
    for (let i = 0; i < data.length; i++) {
      const createLi = document.createElement("li");
      const createText = `<div><h4>${data[i].title}</h4><p>${data[i].body}</p></div>`;
      createLi.innerHTML = createText;
      postBlock.append(createLi);
    }
  }
  //initial call
  
  fetchPost();

  const throttleFun = throttle(fetchPost, 1500);

  
  function throttle(runFunc, limit) {
    let lastCallTime = 0;
    

    return function (...args) {
      if(!throttlePanel ||throttlePanel.classList.contains('none')) return;
      const now = Date.now();
     
      if (now - lastCallTime >= limit) {
        console.log("throttle allowed");
        lastCallTime = now;
        runFunc.apply(this, args);
      }
    };
  }

  
  window.addEventListener("scroll", throttleFun);
   
}
