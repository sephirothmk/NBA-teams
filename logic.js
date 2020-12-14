const teamEnum = {
    home: "home",
    away: "away"
}

const appState = {
    teamList: [],
    gameList: [],
    selectedGame: {
        home: null,
        away: null
    }
}

async function getTeamsFromAPI() {
    var cachedTeams = localStorage.getItem("team-list");
    if (cachedTeams) {
        return appState.teamList = JSON.parse(cachedTeams);
    }
    var result = null;
    try {
        var response = await fetch("https://www.balldontlie.io/api/v1/teams");
        result = await response.json();
        appState.teamList = result.data;
        saveTeamList();
    } catch (error) {
        console.log(error);
    }
}

function getFilteredTeams(id = "") {
    return appState.teamList.filter(t => t.id.toString() !== id.toString());
}

function saveGameList() {
    localStorage.setItem("game-list", JSON.stringify(appState.gameList));
}

function saveTeamList() {
    localStorage.setItem("team-list", JSON.stringify(appState.teamList));
}

function clearData() {
    localStorage.removeItem("game-list");
}

function addGameToList() {
    appState.selectedGame.gameId = appState.gameList[appState.gameList.length - 1] ? appState.gameList[appState.gameList.length - 1].gameId + 1 : 1;
    appState.gameList.push(Object.assign({}, appState.selectedGame));
    saveGameList();
}

function loadGameList() {
    var cachedGames = localStorage.getItem("game-list");
    if (cachedGames) {
        return appState.gameList = JSON.parse(cachedGames);
    }
}

function deleteGameFromList(deleteId) {
    appState.gameList = appState.gameList.filter((g) => g.gameId.toString() !== deleteId.toString());
    saveGameList();
}

function selectTeam(team, type) {
    team.players = [];
    appState.selectedGame[type] = team;
}

function clearSelectedGame() {
    appState.selectedGame = {
        home: null,
        away: null
    }
}

function addPlayer(player, type) {
    const addPlayer = {
        name: player
    }
    addPlayer.playerId = appState.selectedGame[type].players[appState.selectedGame[type].players.length - 1] ? 
        appState.selectedGame[type].players[appState.selectedGame[type].players.length - 1].playerId + 1 : 1;
    appState.selectedGame[type].players.push(addPlayer);
}

function removePlayer(deleteId, type) {
    appState.selectedGame[type].players = appState.selectedGame[type].players.filter((p) => p.playerId.toString() !== deleteId.toString());
    saveGameList();
}


function removeGameFromList(id) {
    appState.gameList = appState.gameList.filter(t => t.id.toString() !== id.toString());
    saveGameList();
}

async function initLogic() {
    await getTeamsFromAPI();
    loadGameList();
}
