const containerEnum = {
    dropdown: "dropdown",
    team: "team"
}

function TeamDTO(teamData) {
    this.abv = teamData.abbreviation;
    this.name = teamData.full_name;
    this.city = teamData.city;
    this.conference = teamData.conference;
}


function renderContainer(type) {
    const renderfunctions = {
        dropdown: renderDropdown,
        team: renderSelectedTeam
    }
    let container = document.getElementById(`${type}-container`);
    if (!container) {
        container = document.createElement("div");
        container.id = `${type}-container`;
    }
    container.innerHTML = "";

    const homeSide = renderfunctions[type](teamEnum.home);
    const awaySide = renderfunctions[type](teamEnum.away);
    container.appendChild(homeSide);
    container.appendChild(awaySide);

    return container;
}

function renderDropdown(type) {
    const dropWrapper = document.createElement("div");
    const dropButton = document.createElement("div");
    const dropdown = document.createElement("div");

    dropWrapper.classList.add("drop-wrapper");
    dropButton.classList.add("drop-button");
    dropButton.innerHTML = `Select a ${type} team`;
    dropButton.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
    })

    dropdown.classList.add("dropdown", "hidden");
    if (type === teamEnum.away) {
        dropdown.classList.add("right");
    }
    appState.teamList.forEach((team) => {
        const teamSelect = document.createElement("div");
        teamSelect.innerHTML = team.name;
        teamSelect.classList.add("team-select");
        teamSelect.addEventListener("click", () => {
            selectTeam(team, type);
            dropdown.classList.add("hidden");
            renderContainer(containerEnum.team);
            renderButtons();
        })
        dropdown.appendChild(teamSelect);
    })

    dropWrapper.appendChild(dropButton);
    dropWrapper.appendChild(dropdown);
    if (!!appState.selectedGame[type]) {
        dropWrapper.classList.add("not-visible");
    }

    return dropWrapper;
}


function renderSelectedTeam(type) {
    const teamContainer = document.createElement("div");
    teamContainer.classList.add(`${type}-team`, "team-wrapper");
    if (!appState.selectedGame[type]) {
        return teamContainer;
    }

    const teamType = document.createElement("h1");
    teamType.innerHTML = type;
    teamContainer.appendChild(teamType);

    const team = new TeamDTO(appState.selectedGame[type]);
    Object.keys(team).forEach((key) => {
        const value = team[key];
        const gameinfo = document.createElement("p"); 
        gameinfo.classList.add("game-info");
        gameinfo.innerHTML = `${key}: ${value}`;
        teamContainer.appendChild(gameinfo);
    });

    if (appState.selectedGame[type].players.length < 5) {
        const addPlayerWrapper = document.createElement("div");
        addPlayerWrapper.classList.add("add-player-wrapper");
        const addPlayerInput = document.createElement("input");
        addPlayerInput.classList.add("add-player-input");
        addPlayerInput.id = `${type}-player-input`;
        addPlayerWrapper.appendChild(addPlayerInput);
        const addPlayerButton = document.createElement("div");
        addPlayerButton.classList.add("add-player-button");
        addPlayerButton.innerHTML = "Add";
        addPlayerButton.addEventListener("click", () => {
            addPlayer(addPlayerInput.value, type);
            renderContainer(containerEnum.team);
            renderButtons();
        });
        addPlayerWrapper.appendChild(addPlayerButton);
    
        teamContainer.appendChild(addPlayerWrapper);
    }

    const playerContainer = document.createElement("div");
    playerContainer.classList.add("player-container");
    appState.selectedGame[type].players.forEach((player) => {
        const playerWrapper = document.createElement("div");
        playerWrapper.classList.add("player-wrapper");
        const playerData = document.createElement("p");
        playerData.classList.add("add-player-data");
        playerData.innerHTML = player.name;
        const playerDelete = document.createElement("div");
        playerDelete.innerHTML = "X";
        playerDelete.classList.add("player-delete");
        playerDelete.addEventListener("click", () => {
            removePlayer(player.playerId, type);
            renderContainer(containerEnum.team);
            renderButtons();
        });

        playerWrapper.appendChild(playerData);
        playerWrapper.appendChild(playerDelete);
        playerContainer.appendChild(playerWrapper);
    })
    teamContainer.appendChild(playerContainer);

    return teamContainer;
}

function renderButtons() {
    let buttonWrapper = document.getElementById("btn-wrapper");
    if (!buttonWrapper) {
        buttonWrapper = document.createElement("div");
        buttonWrapper.id = "btn-wrapper";
    }
    buttonWrapper.innerHTML = "";
   
    const reset = document.createElement("div");
    reset.classList.add("btn", "reset");
    reset.innerHTML = "Reset";
    const save = document.createElement("div");
    save.classList.add("btn", "save");
    save.innerHTML = "Save";

    if (!validateGame(appState.selectedGame)) {
        save.classList.add("disabled");
    }

    if (!appState.selectedGame[teamEnum.home] && !appState.selectedGame[teamEnum.away]) {
        buttonWrapper.classList.add("hidden");
    } else {
        buttonWrapper.classList.remove("hidden");
    }

    reset.addEventListener("click", () => {
        clearSelectedGame();
        renderContainer(containerEnum.team);
        renderButtons();
    });

    save.addEventListener("click", () => {
        addGameToList();
        clearSelectedGame();
        renderContainer(containerEnum.team);
        renderButtons();
        renderGameList();
    });

    buttonWrapper.appendChild(reset);
    buttonWrapper.appendChild(save);

    return buttonWrapper;
}


function renderGameList() {
    let gameList = document.getElementById("game-list");
    if (!gameList) {
        gameList = document.createElement("div");
        gameList.id = "game-list";
    }
    gameList.innerHTML = "";

    appState.gameList.forEach((game) => {
        const gameWrapper = document.createElement("div");
        gameWrapper.classList.add("game-wrapper");

        const gameData = document.createElement("div");
        gameData.classList.add("game-data");
        gameData.innerHTML = `${game[teamEnum.home].full_name} VS ${game[teamEnum.away].full_name}`;
        gameWrapper.appendChild(gameData);

        const playerData = document.createElement("div");
        playerData.classList.add("player-data");
       
        let homePlayers = "";
        game[teamEnum.home].players.forEach((player) => {
            homePlayers = `${homePlayers}/${player.name}`;
        });
        let awayPlayers = "";
        game[teamEnum.home].players.forEach((player) => {
            awayPlayers = `${awayPlayers}/${player.name}`;
        });
        playerData.innerHTML = `Roster: Home - ${homePlayers} VS Away - ${awayPlayers}`;
        gameWrapper.appendChild(playerData);

        const deleteBtn = document.createElement("div");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.addEventListener("click", () => {
            deleteGameFromList(game.gameId);
            renderGameList();
        });
        gameWrapper.appendChild(deleteBtn);

        gameList.appendChild(gameWrapper);
    });

    return gameList;
}


function validateGame(selectedGame) {
    if (!selectedGame[teamEnum.home] || selectedGame[teamEnum.home].players.length < 5) {
        return false;
    }
    if (!selectedGame[teamEnum.away] || selectedGame[teamEnum.away].players.length < 5) {
        return false;
    }

    return true;
}


async function initAll() {
    const main = document.getElementById("main-window");
    main.innerHTML = "";
    await initLogic();
    const dropdownComponent = renderContainer(containerEnum.dropdown);
    const gameComponent = renderContainer(containerEnum.team);
    const buttonComponent = renderButtons();
    const gameList = renderGameList();


    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    wrapper.appendChild(dropdownComponent);
    wrapper.appendChild(gameComponent);
    wrapper.appendChild(buttonComponent);
    wrapper.appendChild(gameList);

    main.appendChild(wrapper);
}

initAll();