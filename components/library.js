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

    this._librarySearchInput = document.querySelector("#library-search-input");
    this._searchLibraryBtn = document.querySelector("#search-library-btn");

    this._libraryNavTabs = document.querySelector("#library-nav-tabs");
  }

  getArtistsFollowing() {
    return JSON.parse(localStorage.getItem("libraryArtistsFollowing"));
  }

  getPlaylistsFollowing() {
    return JSON.parse(localStorage.getItem("libraryPlaylistsFollowing"));
  }

  getAllFollowing() {
    return JSON.parse(localStorage.getItem("libraryAllFollowing"));
  }

  renderYourLibrary = async (libraries) => {
    const libraryContent = document.querySelector("#libraryContent");
    if (libraries?.length) {
      libraryContent.innerHTML = libraries
        .map((library) => {
          const { id, name, image_url, type } = library;
          return `<div class="library-item" data-id=${id} data-type=${type}>
                        <img src="${image_url ?? "https://placehold.co/600x400?text=Image"}" alt="${name}" class="item-image" />
                        <div class="item-info">
                        <div class="item-title">${name}</div>
                        <div class="item-subtitle">Artist</div>
                        </div>
                    </div>`;
        })
        .join("");
    } else {
      libraryContent.innerHTML = "";
    }
  };

  init() {
    // Show Popup (Sort Option)
    this._sortBtn.addEventListener("click", () => {
      if (!this._filterSort) return;
      this._filterSort.classList.toggle("show");
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

    // Search
    this._searchLibraryBtn.addEventListener("click", () => {
      this._librarySearchInput.classList.add("show");
      this._sortBtn.querySelector(".sort-btn-text").classList.add("hide");
    });

    this._librarySearchInput.addEventListener("keyup", (e) => {
      const value = e.target.value;
      const libraryAllFollowing = this.getAllFollowing();

      const result = libraryAllFollowing.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      this.renderYourLibrary(result);
    });

    document.addEventListener("click", (e) => {
      // Hide Filter Sort
      if (
        !this._sortBtn.contains(e.target) &&
        !this._filterSort.contains(e.target)
      ) {
        this._filterSort.classList.remove("show");
      }

      // Hide Search
      if (
        !this._librarySearchInput.contains(e.target) &&
        !this._searchLibraryBtn.contains(e.target)
      ) {
        this._librarySearchInput.classList.remove("show");
        this._sortBtn.querySelector(".sort-btn-text").classList.remove("hide");
      }
    });

    // Filter Playlists vs Artist
    this._libraryNavTabs.addEventListener("click", (e) => {
      const btnTab = e.target.closest(".nav-tab");
      if (!btnTab) return;

      this._libraryNavTabs
        .querySelectorAll(".nav-tab.active")
        .forEach((item) => {
          if (!item.contains(btnTab)) {
            item.classList.remove("active");
          }
        });

      btnTab.classList.toggle("active");

      let dataTab = "all";
      if (btnTab.classList.contains("active")) {
        dataTab = btnTab.dataset.tab;
      }

      let result = this.getAllFollowing();
      switch (dataTab) {
        case "playlist":
          result = this.getPlaylistsFollowing();
          break;
        case "artist":
          result = this.getArtistsFollowing();
          break;
        default:
          break;
      }

      this.renderYourLibrary(result);
    });
  }
}

export default Library;
