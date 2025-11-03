import { renderYourLibrary } from "../main.js";
import { PLAY_LIST } from "../utils/constants.js";
import httpRequest from "../utils/httpRequest.js";

class PlayListDetail {
  constructor() {
    this._btnPlaylistFollow = document.querySelector("#btn-playlist-follow");
  }

  handleFollowAndUnfollowPlaylist() {
    if (!this._btnPlaylistFollow) return;
    this._btnPlaylistFollow.onclick = async () => {
      this._btnPlaylistFollow.dataset.disabled = true;
      const id = this._btnPlaylistFollow.dataset.id;
      const isFollowing = this._btnPlaylistFollow.dataset.va;
      if (!id || !isFollowing) return;

      if (isFollowing === "false") {
        try {
          await httpRequest.post(`playlists/${id}/follow`);
          renderYourLibrary();
          this._btnPlaylistFollow.dataset.va = true;
          this._btnPlaylistFollow.textContent =
            PLAY_LIST.REMOVE_FROM_YOUR_LIBRARY;
        } catch (err) {
          console.error("Follow playlist error", err);
        } finally {
          this._btnPlaylistFollow.dataset.disabled = false;
        }
      } else if (isFollowing === "true") {
        try {
          await httpRequest.del(`playlists/${id}/follow`);
          renderYourLibrary();
          this._btnPlaylistFollow.dataset.va = false;
          this._btnPlaylistFollow.textContent = PLAY_LIST.ADD_FROM_YOUR_LIBRARY;
        } catch (err) {
          console.error("Follow playlist error", err);
        } finally {
          this._btnPlaylistFollow.dataset.disabled = false;
        }
      }
    };
  }

  init() {
    this.handleFollowAndUnfollowPlaylist();
  }
}

export default PlayListDetail;
