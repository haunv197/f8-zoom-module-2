import httpRequest from "./utils/httpRequest.js";

const STATUS = {
    SUCCESS: "success",
    WARNING: "warning"
}

// handleXSS
function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// formatNumber
function formatNumberComma(number) {
    let newNumber = number;
    if (!newNumber || newNumber < 1000) {
        return newNumber ?? 0;
    }
    const numbers = [];
    while (newNumber > 1000) {
        numbers.unshift(Math.floor(number % 1000))
        newNumber = newNumber / 1000;
    }
    numbers.unshift(Math.floor(newNumber))
    newNumber = numbers.join(",")
    return newNumber;
}

function formatTimeBySecond(timer) {
    if (!timer || timer < 60) {
        return timer ?? '0'
    }

    let newTimer = [];
    let hour = 0;
    let minute = Math.floor(timer / 60);
    let second = Math.floor(timer % 60);

    if (minute >= 60) {
        hour = Math.floor(minute / 60);
        minute = Math.floor(minute % 60)
        newTimer.push(hour)
    }

    const newSecond = second >= 10 ? second : ('0' + second);
    newTimer.push(minute)
    newTimer.push(newSecond)
    return newTimer.join(":")
}


function closeModal() {
    const authModal = document.getElementById("authModal");
    authModal.classList.remove("show");
    document.body.style.overflow = "auto"; // Restore scrolling
}


function logout() {
    const mainHeader = document.querySelector(".main-header");
    const userMenu = mainHeader.querySelector(".user-menu");
    const authorButtons = mainHeader.querySelector(".auth-buttons");

    userMenu.classList.remove("show");
    authorButtons.classList.add("show");

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userCurrent");
    location.href = "/f8-zoom-module-2";

    return;
}


// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const signupBtn = document.querySelector(".signup-btn");
    const loginBtn = document.querySelector(".login-btn");
    const authModal = document.getElementById("authModal");
    const modalClose = document.getElementById("modalClose");
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const showLoginBtn = document.getElementById("showLogin");
    const showSignupBtn = document.getElementById("showSignup");

    // Function to show signup form
    function showSignupForm() {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    }

    // Function to show login form
    function showLoginForm() {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    }

    // Function to open modal
    function openModal() {
        authModal.classList.add("show");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    // Open modal with Sign Up form when clicking Sign Up button
    signupBtn.addEventListener("click", function () {
        showSignupForm();
        openModal();
    });

    // Open modal with Login form when clicking Login button
    loginBtn.addEventListener("click", function () {
        showLoginForm();
        openModal();
    });

    // Close modal function
    function closeModal() {
        authModal.classList.remove("show");
        document.body.style.overflow = "auto"; // Restore scrolling
    }

    // Close modal when clicking close button
    modalClose.addEventListener("click", closeModal);

    // Close modal when clicking overlay (outside modal container)
    authModal.addEventListener("click", function (e) {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authModal.classList.contains("show")) {
            closeModal();
        }
    });

    // Switch to Login form
    showLoginBtn.addEventListener("click", function () {
        showLoginForm();
    });

    // Switch to Signup form
    showSignupBtn.addEventListener("click", function () {
        showSignupForm();
    });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    // Toggle dropdown when clicking avatar
    userAvatar.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        // console.log('e.target', e.target)
        if (
            !userAvatar.contains(e.target) &&
            !userDropdown.contains(e.target)
        ) {
            userDropdown.classList.remove("show");
        }
    });

    // Close dropdown when pressing Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && userDropdown.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
    });

    // Handle logout button click
    logoutBtn.addEventListener("click", function () {
        // Close dropdown first
        userDropdown.classList.remove("show");
        logout();
        console.log("Logout clicked");
        // TODO: Students will implement logout logic here
    });
});


//---------------------------------- Start All logic register and login ----------------------------------------

// Register Functionality
function register() {
    const signupForm = document.querySelector("#signupForm");
    const signupEmail = document.querySelector("#signupEmail");
    const signupPassword = document.querySelector("#signupPassword");
    const validEmail = signupForm.querySelector(".valid-email");
    const validPassword = signupForm.querySelector(".valid-password");
    const formGroupEmail = signupForm.querySelector(".form-group-email");
    const formGroupPassword = signupForm.querySelector(".form-group-password");

    signupForm
        .querySelector(".auth-form-content")
        .addEventListener("submit", async function (e) {
            e.preventDefault();
            formGroupPassword.classList.remove("invalid")

            const credentials = {
                email: signupEmail.value,
                password: signupPassword.value,
            }

            try {
                const { user, access_token, refresh_token } = await httpRequest.post(
                    "auth/register",
                    credentials
                )

                localStorage.setItem("access_token", access_token)
                localStorage.setItem("refresh_token", refresh_token)
                localStorage.setItem("userCurrent", JSON.stringify(user))
                loginAndRegisterSuccess(user, "Đăng kí thành công");
                closeModal();

            } catch (err) {
                const { error } = err.response;
                const detailsError = error.details?.[0];
                switch (error.code) {
                    case 'VALIDATION_ERROR':
                        if (detailsError && detailsError.field === 'email') {
                            formGroupEmail.classList.add("invalid")
                            validEmail.textContent = detailsError.message;
                        } else {
                            formGroupPassword.classList.add("invalid")
                            validPassword.textContent = detailsError.message;
                        }
                        break;
                    case 'EMAIL_EXISTS':
                        formGroupEmail.classList.add("invalid")
                        validEmail.textContent = error.message;
                        break;
                }
            }
        })
}

// Login Functionality
function login() {
    const loginForm = document.querySelector("#loginForm");
    const loginEmail = document.querySelector("#loginEmail");
    const loginPassword = document.querySelector("#loginPassword");
    const formGroupEmail = loginForm.querySelector(".form-group-email");
    const formGroupPassword = loginForm.querySelector(".form-group-password");
    const validEmail = loginForm.querySelector(".valid-email");
    const validPassword = loginForm.querySelector(".valid-password");


    loginForm
        .querySelector(".auth-form-content")
        .addEventListener("submit", async function (e) {
            e.preventDefault();

            formGroupEmail.classList.remove("invalid");
            formGroupPassword.classList.remove("invalid");

            const credentials = {
                "email": loginEmail.value,
                "password": loginPassword.value,
            };

            try {
                const { access_token, user, refresh_token } = await httpRequest.post("auth/login", credentials);
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                localStorage.setItem("userCurrent", JSON.stringify(user));

                loginAndRegisterSuccess(user, "Đăng nhập thành công")
                closeModal();

            } catch (err) {
                const { error } = err.response
                switch (error.code) {
                    case 'INVALID_CREDENTIALS':
                        formGroupEmail.classList.add("invalid");
                        formGroupPassword.classList.add("invalid");
                        validEmail.textContent = error.message
                        validPassword.textContent = error.message
                        break;
                    case 'VALIDATION_ERROR':
                        error?.details.forEach(detail => {
                            if (detail.field === 'email') {
                                formGroupEmail.classList.add("invalid");
                                validEmail.textContent = detail.message
                            } else {
                                formGroupPassword.classList.add("invalid");
                                validPassword.textContent = detail.message
                            }
                        });
                        break;
                }
            }

        })
}

// Show Toast
function showToast(message, status = "success") {
    if (!message) {
        return;
    }
    const toastMessage = document.querySelector("#toastMessage")
    const toastMessageDetail = toastMessage.querySelector(".toast-message-detail")

    switch (status) {
        case "warning":
            toastMessage.classList.add("warning");
            break;
        default:
            toastMessage.classList.remove("warning");
            break;
    }

    toastMessage.classList.add("show")
    toastMessageDetail.textContent = message;


    setTimeout(() => {
        toastMessage.classList.remove("show")
    }, 2000);
    return;
}

async function loginAndRegisterSuccess(user, message) {
    const mainHeader = document.querySelector(".main-header");
    const userMenu = mainHeader.querySelector(".user-menu");
    const userAvatarImg = mainHeader.querySelector(".user-avatar img");

    // remove author (login, register)
    const authorButtons = mainHeader.querySelector(".auth-buttons");
    authorButtons.classList.remove("show");

    // show user
    userMenu.classList.add("show");
    if (user.avatar_url) {
        userAvatarImg.src = user.avatar_url;
    }

    // Show Toast
    if (message) {
        showToast(message);
    }

    //render Sidebar
    await renderYourLibrary();
}

function loginSuccess(user) {
    loginAndRegisterSuccess(user)
    return;
}

//---------------------------------- End All logic register and login ----------------------------------------


//---------------------------------- Start All logic Common Playlists and Artist --------------------------------------------------
function hideHitsAndArtists() {
    const hitsSection = document.querySelector("#hitsSection");
    const artistsSection = document.querySelector("#artistsSection");

    hitsSection.classList.add("hide");
    artistsSection.classList.add("hide");
    return;
}

function showHitsAndArtists() {
    const hitsSection = document.querySelector("#hitsSection");
    const artistsSection = document.querySelector("#artistsSection");

    hitsSection.classList.remove("hide");
    artistsSection.classList.remove("hide");
    return;
}

function hideDetailPlaylistsAndArtist() {
    const artistHero = document.querySelector("#artistHero");
    const artistControls = document.querySelector("#artistControls");
    const artistPopular = document.querySelector("#artistPopular");

    artistHero.classList.add("hide");
    artistControls.classList.add("hide");
    artistPopular.classList.add("hide");
    return;
}


function showDetailPlaylistsAndArtist() {
    const artistHero = document.querySelector("#artistHero");
    const artistControls = document.querySelector("#artistControls");
    const artistPopular = document.querySelector("#artistPopular");

    artistHero.classList.remove("hide");
    artistControls.classList.remove("hide");
    artistPopular.classList.remove("hide");
    return;
}


function showAllTracksById(artistHeroData, tracksData) {
    const artistHero = document.querySelector("#artistHero");
    const artistControls = document.querySelector("#artistControls");
    const artistPopular = document.querySelector("#artistPopular");
    const trackList = artistPopular.querySelector(".track-list");
    const btnFollow = artistControls.querySelector(".btnFollow");

    hideHitsAndArtists();
    showDetailPlaylistsAndArtist();

    if (artistHeroData) {
        const {
            name,
            imageUrl,
            monthlyListeners,
            isVerified,
            is_following
        } = artistHeroData;

        btnFollow.textContent = is_following ? "Unfollow" : "Follow";
        btnFollow.setAttribute("data-va", is_following)

        artistHero.innerHTML = ` 
        <div class="hero-background">
            <img src="${imageUrl}" alt="${name}" class="hero-image">
            <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
            <div class="verified-badge">
            <i class="fas fa-check-circle"></i>
            <span>Verified Artist</span>
            </div>
            <h1 class="artist-name">${name}</h1>
            <p class="monthly-listeners">
                ${monthlyListeners} monthly listeners
            </p>
        </div>`;
    }


    if (tracksData?.length) {
        trackList.innerHTML = tracksData.map(track => {
            const {
                position,
                imageUrl,
                title,
                playCount,
                duration,
            } = track;
            return (
                `<div class="track-item">
              <div class="track-number">${position}</div>
              <div class="track-image">
                <img src="${imageUrl}?height=40&amp;width=40" alt="${title}">
              </div>
              <div class="track-info">
                <div class="track-name">
                  ${title}
                </div>
              </div>
              <div class="track-plays">${playCount}</div>
              <div class="track-duration">${duration}</div>
              <button class="track-menu-btn">
                <i class="fas fa-ellipsis-h"></i>
              </button>
            </div>`
            );
        }).join("");
    } else {
        trackList.innerHTML = '';
    }

    return;
}

//---------------------------------- End  All logic Common Playlists and Artist  --------------------------------------------------



//---------------------------------- Start All logic Playlists  --------------------------------------------------

// Load Get “Today’s biggest hits”:
async function getPlaylists() {
    const hitsSection = document.querySelector("#hitsSection");
    const hitsGrid = hitsSection.querySelector(".hits-grid");
    try {
        const { playlists } = await httpRequest.get('playlists?limit=20&offset=0');
        if (playlists?.length) {
            hitsGrid.innerHTML = playlists.map(playlist => {
                const { id, image_url, name, user_display_name } = playlist
                return `
                    <div class="hit-card" data-id=${id}>
                        <div class="hit-card-cover">
                            <img src=${image_url} alt=${name} />
                            <button class="hit-play-btn">
                            <i class="fas fa-play"></i>
                            </button>
                        </div>
                        <div class="hit-card-info">
                            <h3 class="hit-card-title">${name}</h3>
                            <p class="hit-card-artist">${user_display_name}</p>
                        </div>
                        </div>
                `;
            }).join("");

            handleShowDetailPlayList();

        }
    } catch (err) {
        console.log('Error - Get Today’s biggest hits: ', err)
    }
    return;
}

// Playlist: GET API Playlists/Get Playlist by ID
async function getPlaylistByID(id) {
    if (!id) {
        return null;
    }
    try {
        const response = await httpRequest.get(`playlists/${id}`);
        return response;

    } catch (err) {
        console.error('Error - GET API Playlists/Get Playlist by ID', err)
        return null;
    }
}

// Get All Tracks by Id (Playlists)
async function getAllTracksByIdPlaylist(id) {
    if (!id) {
        return null;
    }
    try {
        return await httpRequest.get(`playlists/${id}/tracks`);

    } catch (err) {
        console.error('Error - Get All Tracks by Id (Playlists)', err)
        return null;
    }
}

// Show Detail PlayList
async function handleShowDetailPlayListLoaded() {
    const id = new URLSearchParams(window.location.search).get("idPlayList");
    if (id) {
        await renderDetailPlayList(id)
    }
    return;
}

function handleShowDetailPlayList() {
    const hitsSection = document.querySelector("#hitsSection");
    hitsSection.querySelectorAll(".hit-card")
        .forEach(hit => {
            hit.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");

                const newUrl = `${location.pathname}?idPlayList=${id}`;
                history.replaceState({}, '', newUrl);

                await renderDetailPlayList(id);
            });
        });
    return;
}

async function renderDetailPlayList(id) {
    const playlistDetail = await getPlaylistByID(id)
    const { tracks } = await getAllTracksByIdPlaylist(id)
    console.log('tracks', tracks)

    if (playlistDetail) {
        const artistHeroData = {
            name: playlistDetail.name,
            imageUrl: playlistDetail.image_url,
            monthlyListeners: formatNumberComma(playlistDetail.monthly_listeners) ?? '',
            isVerified: playlistDetail.is_verified ?? false,
            is_following: playlistDetail.is_following,
        }
        const tracksData = tracks && tracks.map(track => ({
            position: track.position,
            imageUrl: track.artist_image_url,
            title: track.track_title,
            playCount: formatNumberComma(track.track_play_count),
            duration: formatTimeBySecond(track.track_duration)
        }));
        showAllTracksById(artistHeroData, tracksData, id);
    }
}
//---------------------------------- End All logic PlayList  --------------------------------------------------



//---------------------------------- Start All logic Artists  --------------------------------------------------

// Load Get Data “Popular artists”:
async function getArtists() {
    const artistsSection = document.querySelector("#artistsSection");
    const artistsGrid = artistsSection.querySelector(".artists-grid");
    try {
        const { artists } = await httpRequest.get("artists?limit=20&offset=0");
        if (artists?.length) {
            artistsGrid.innerHTML = artists.map(artist => {
                const { id, image_url, name, } = artist;
                return (
                    `<div class="artist-card" data-id=${id}>
                        <div class="artist-card-cover">
                            <img src=${image_url} alt=${name} />
                            <button class="artist-play-btn">
                            <i class="fas fa-play"></i>
                            </button>
                        </div>
                        <div class="artist-card-info">
                            <h3 class="artist-card-name">${name}</h3>
                            <p class="artist-card-type">Artist</p>
                        </div>
                    </div>`
                );
            }).join("");

            handleShowDetailArtist();
        }
    } catch (err) {
        console.log("Error - Get Data Popular artists", err)
    }
}

// Show Detail Artist
async function handleShowDetailArtistLoaded() {
    const id = new URLSearchParams(window.location.search).get("idArtist");
    if (id) {
        await renderDetailArtist(id)
    }
    return;
}

function handleShowDetailArtist() {
    const artistsSection = document.querySelector("#artistsSection");
    const artistsGrid = artistsSection.querySelector('.artists-grid');
    const artistCards = artistsGrid?.querySelectorAll(".artist-card");

    const libraryContent = document.querySelector("#libraryContent");
    const libraryItems = libraryContent.querySelectorAll(".library-item");

    const artistElements = [
        ...(artistCards || []),
        ...(libraryItems || [])
    ];

    artistElements
        .forEach(artist => {
            artist.addEventListener("click", async function () {
                const id = artist.getAttribute("data-id");

                const newUrl = `${location.pathname}?idArtist=${id}`;
                history.replaceState({}, '', newUrl);
                if (id) {
                    await renderDetailArtist(id)
                }

            })
        })
    return;
}

async function renderDetailArtist(id) {
    const artistDetail = await getArtistByID(id)
    const { tracks } = await getAllTracksByIdArtist(id)

    if (artistDetail) {
        const artistHeroData = {
            name: artistDetail.name,
            imageUrl: artistDetail.image_url,
            monthlyListeners: formatNumberComma(artistDetail.monthly_listeners),
            isVerified: artistDetail.is_verified,
            is_following: artistDetail.is_following,
        }

        const tracksData = tracks && tracks.map(track => ({
            position: track.track_number,
            imageUrl: track.image_url,
            title: track.title,
            playCount: formatNumberComma(track.track_play_count),
            duration: formatTimeBySecond(track.duration)
        }));

        showAllTracksById(artistHeroData, tracksData);
        handleFollowArtist();
    }
}


//Artist: API Artists/Get Artist by ID
async function getArtistByID(id) {
    if (!id) {
        return null;
    }
    try {
        const response = await httpRequest.get(`artists/${id}`);
        return response;
    } catch (err) {
        console.error('Get Artist by ID: ', err)
        return null;
    }
}

// Get All Tracks by Id (Artists)
async function getAllTracksByIdArtist(id) {
    if (!id) {
        return null;
    }
    try {
        return await httpRequest.get(`artists/${id}/tracks/popular`)
    } catch (err) {
        console.error("Error - Get All Tracks by Id (Artists)", err)
    }
}

// Follow Artist
function handleFollowArtist() {
    const artistControls = document.querySelector("#artistControls")
    const btnFollow = artistControls.querySelector(".btnFollow");
    const dataValue = btnFollow.getAttribute("data-va")

    btnFollow.addEventListener("click", async function (e) {
        e.target.setAttribute("disabled", true);
        const idArtist = new URLSearchParams(window.location.search).get("idArtist");
        const auth = localStorage.getItem("access_token")
        if (!auth) {
            showToast("Bạn cần đăng nhập để sử dụng chức năng này!", STATUS.WARNING)
            return;
        }

        try {
            if (dataValue === "false") {
                e.target.setAttribute("data-va", "true")
                e.target.textContent = "Unfollow";
                await httpRequest.post(`artists/${idArtist}/follow`);
            } else if (dataValue === "true") {
                e.target.textContent = "Follow";
                e.target.setAttribute("data-va", "false")

                await httpRequest.del(`artists/${idArtist}/follow`);
            }
            e.target.removeAttribute("disabled");


            // const response = await httpRequest.del(`artists/${id}/follow`);
            // renderDetailArtist(idArtist)
            await renderYourLibrary()
            return;

        } catch (err) {
            console.error('Error - Follow Artist: ', err)
        }
    })
}

//---------------------------------- End All logic Artists  --------------------------------------------------


//---------------------------------- Start All logic Sidebar  --------------------------------------------------

async function renderYourLibrary() {
    const libraryContent = document.querySelector("#libraryContent");
    try {
        const { artists } = await httpRequest.get("me/following?limit=20&offset=0");
        if (artists?.length) {
            libraryContent.innerHTML = artists.map(artist => {
                const { id, name, image_url } = artist;
                return (
                    `<div class="library-item" data-id=${id}>
                        <img src="${image_url}" alt="${name}" class="item-image" />
                        <div class="item-info">
                        <div class="item-title">${name}</div>
                        <div class="item-subtitle">Artist</div>
                        </div>
                    </div>`
                );
            }).join("");
        }
    } catch (err) {
        console.error("Error - Render Your Library:", err)
    }

    handleShowDetailArtist();
}


//---------------------------------- End All logic Sidebar  --------------------------------------------------


// Back to Home

function renderHomePage() {
    showHitsAndArtists();
    hideDetailPlaylistsAndArtist();
    return;
}

function handleBackToHome() {
    const btnBackToHome = document.querySelectorAll(".js-back-home");
    btnBackToHome.forEach(btn => {
        btn.addEventListener("click", function (e) {
            console.log("btn home", e.target)
            const { origin, pathname } = location;
            const url = `${origin}${pathname}`
            history.replaceState({}, '', url);
            renderHomePage();
        })
    })
    return;
}

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {
    // TODO: Implement other functionality here

    //Sidebar luôn chạy đầu
    await renderYourLibrary()

    register();

    login();

    getPlaylists();

    getArtists();

    handleBackToHome();

    handleShowDetailPlayListLoaded();

    handleShowDetailArtistLoaded();

    // handleShowDetailArtist();

    // handleFollowArtist();
})


// Get User Functionality
document.addEventListener("DOMContentLoaded", async function () {
    const mainHeader = document.querySelector(".main-header");
    const authorButtons = mainHeader.querySelector(".auth-buttons");
    try {
        const auth = localStorage.getItem("access_token");
        if (!auth) {
            authorButtons.classList.add("show");
            return;
        }
        const { user } = await httpRequest.get("users/me");
        loginSuccess(user);

    } catch (err) {
        console.log('err', err)
        authorButtons.classList.add("show");
    }
})