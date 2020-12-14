const testSleep = m => new Promise(r => setTimeout(r, m));

async function automationTest() {
    // reset app state
    appState.teamList = [];
    appState.gameList = [];
    appState.selectedGame = {
        home: null,
        away: null
    }
    clearData();


    // reinitialize the UI
    await initAll();

    const dropdownContainer = document.getElementById("dropdown-container");
    // select home team
    const homeDropdown = dropdownContainer.children[0].children[0];
    homeDropdown.click();
    await testSleep(1000);
    const homeTeam = dropdownContainer.children[0].children[0].nextElementSibling.children[5];
    homeTeam.click();
    await testSleep(1000);
    // select away team
    const awayDropdown = dropdownContainer.children[1].children[0];
    awayDropdown.click();
    await testSleep(1000);
    const awayTeam = dropdownContainer.children[1].children[0].nextElementSibling.children[9];
    awayTeam.click();
    await testSleep(1000);
    // select home players
    const homeInput = document.getElementById("home-player-input");
    const homePlayerAdd = homeInput.nextElementSibling;
    for (let index = 0; index < 5; index++) {
        homeInput.value = `home-player-${index}`;
        homePlayerAdd.click();
    }
    await testSleep(1000);
    // select away players
    const awayInput = document.getElementById("away-player-input");
    const awayPlayerAdd = awayInput.nextElementSibling;
    for (let index = 0; index < 5; index++) {
        awayInput.value = `home-player-${index}`;
        awayPlayerAdd.click();
    }
    await testSleep(1000);
    // save game
    let saveGame = document.getElementsByClassName("save");
    saveGame = saveGame[0];
    saveGame.click();
    await testSleep(1000);
    // validate end result (game list entry)
    let result = "";
    if (appState.teamList.length === 30) {
        result = `${result}Teams loaded succesfully from API. `;
    }

    if (!validateGame(appState.selectedGame)) {
        result = `${result}Selected game was reset successfully. `;
    }

    if (validateGame(appState.gameList[0])) {
        result = `${result}Game list populated Successfully. `;
    }

    alert(result);
}
