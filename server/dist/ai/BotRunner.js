"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotRunner = void 0;
const createBot_1 = require("./createBot");
class BotRunner {
    bots;
    game;
    onGameChange;
    delay;
    batchUpdates;
    constructor(game, config) {
        this.bots = {
            red: { operative: null, spymaster: null },
            blue: { operative: null, spymaster: null }
        };
        this.game = game;
        this.onGameChange = config.onGameChange;
        this.delay = config.delay ?? 0;
        this.batchUpdates = config.batchUpdates ?? true;
    }
    getActiveBot() {
        return this.bots[this.game.currentTeam][this.game.currentClue ? 'operative' : 'spymaster'];
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    addBot(team, role, name) {
        this.bots[team][role] = { team, role, name };
    }
    deleteBot(role, team) {
        this.bots[team][role] = null;
    }
    async run() {
        console.log('bot run');
        console.log('bots', this.bots);
        console.log('activeBots', this.getActiveBot());
        let safeGuard = 20;
        let activeBot = this.getActiveBot();
        while (!this.game.gameover && activeBot && safeGuard > 0) {
            console.log('play turn', this.getActiveBot());
            this.getActiveBot();
            if (activeBot.role == 'spymaster') {
                const bot = (0, createBot_1.createBotSpymaster)(this.game, activeBot.type);
                await bot.playTurn();
            }
            else if (activeBot.role == 'operative') {
                const bot = (0, createBot_1.createBotGuesser)(this.game, activeBot.type, this.onGameChange);
                console.log('bot created');
                console.log('bot created');
                await bot.playTurn();
            }
            safeGuard--;
            //sending gameUpdates between ai turns with delay to simulate human game flow
            if (!this.batchUpdates && this.onGameChange) {
                this.onGameChange();
                await this.sleep(this.delay);
            }
            activeBot = this.getActiveBot();
        }
        if (this.onGameChange) {
            this.onGameChange();
        }
    }
}
exports.BotRunner = BotRunner;
