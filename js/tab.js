const tab = document.querySelector(".tabs");
const tabPanel = document.querySelectorAll(".tab-panel");


const loadedModules = {};

tab.addEventListener("click", async function (e) {
  const clickedId = e.target.closest("[data-tab]")?.dataset.tab;
  if (!clickedId) return;
  tab.closest("section").classList.add("has-active-tab");
  tabPanel.forEach((panel) => panel.classList.add("none"));
  tab.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  e.target.closest("[data-tab]")?.classList.add("active");

  document.getElementById(clickedId).classList.remove("none");

  //load script according to clicked tab
  // module load logic
  if (!loadedModules[clickedId]) {
    const module = await import(`./${clickedId}.js`);
    module.init();
    loadedModules[clickedId] = true;
  }
});
