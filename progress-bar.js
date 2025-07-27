const currentExp = 498;
const expToNextLevel = 1000;
const currentLevel = 7;

const fillPercent = Math.round((currentExp / expToNextLevel) * 100);

document.getElementById("progress-fill").style.width = fillPercent + "%";
document.getElementById("exp-left").innerText = expToNextLevel - currentExp;
document.getElementById("level").innerText = currentLevel;
