/*
1. Update UI
+ Show Compact list
+ Show list default
+ Show compact grid
+ Show grid default
*/

class Library {
  // Get DOM element
  constructor() {
    this._sortBtn = document.querySelector("#library-sort-btn");
    this._filterSort = document.querySelector("#library-filter-sort");

    this._librarySorts = document.querySelector("#library-sorts");
    this._libraryContent = document.querySelector("#libraryContent");
  }

  init() {
    // Show Popup (Sort Option)
    this._sortBtn.addEventListener("click", () => {
      if (!this._filterSort) return;
      this._filterSort.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (
        !this._sortBtn.contains(e.target) &&
        !this._filterSort.contains(e.target)
      ) {
        this._filterSort.classList.remove("show");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this._filterSort.classList.contains("show")) {
        this._filterSort.classList.remove("show");
      }
    });

    // Update UI (Show sort)
    this._librarySorts.addEventListener("click", (e) => {
      const sortItem = e.target.closest(".sort-item");
      if (!sortItem) return;

      this._librarySorts
        .querySelectorAll(".sort-item.active")
        .forEach((item) => {
          item.classList.remove("active");
        });

      sortItem.classList.add("active");

      const dataType = sortItem.dataset.type;
      const libraryContent = this._libraryContent;
      if (!libraryContent) return;
      libraryContent.dataset.value = dataType;
    });
  }
}

export default Library;
