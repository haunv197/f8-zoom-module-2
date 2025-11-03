import { renderYourLibrary } from "../main.js";
import { PLACEHOLDER_IMAGE } from "../utils/constants.js";
import httpRequest from "../utils/httpRequest.js";

class Playlist {
  constructor() {
    this._btnCreatePlayList = document.querySelector("#create-play-list");
  }

  createPlayList() {
    this._btnCreatePlayList.addEventListener("click", async () => {
      try {
        await httpRequest.post("playlists", {
          name: "My New Playlist",
          description: "Playlist description",
          is_public: true,
          image_url: PLACEHOLDER_IMAGE,
        });

        renderYourLibrary();
      } catch (err) {
        console.error("Create play list error", err);
      }
    });
  }

  init() {
    this.createPlayList();
  }
}

export default Playlist;
