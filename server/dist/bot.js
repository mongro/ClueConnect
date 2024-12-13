"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGptGuesser = exports.BotGuesser = void 0;
const gpt_1 = __importDefault(require("./gpt"));
class BotGuesser {
    game;
    onGameChange;
    constructor(game, onGameChange) {
        this.game = game;
        if (onGameChange) {
            this.onGameChange = onGameChange;
        }
    }
    validateGuess(guess) {
        console.log('index-filter', this.game.board.filter((card) => !card.revealed));
        console.log('guess', 'X' + guess + 'X');
        return this.game.board.filter((card) => !card.revealed).findIndex((card) => card.word == guess);
    }
    async doNextTurn() {
        if (!this.game.currentClue)
            return;
        let failedResponses = 0;
        while (failedResponses < 5 &&
            this.game.currentClue &&
            this.game.currentGuesses <= this.game.currentClue.number) {
            const response = await this.createGuess(this.game.board, this.game.currentClue);
            console.log('openAIRes', response);
            if (response === null) {
                this.game.endGuessing();
                if (this.onGameChange) {
                    this.onGameChange();
                }
                continue;
            }
            const index = this.validateGuess(response);
            console.log('index', index);
            console.log('index', this.game.board);
            if (index == -1) {
                failedResponses++;
                continue;
            }
            this.game.makeGuess('bot', index);
            if (this.onGameChange) {
                this.onGameChange();
            }
        }
    }
}
exports.BotGuesser = BotGuesser;
const gameRules = `Codenames is a game of language understanding and communication.
The Codemaster and Guesser are both on the Red team, and their goal is to discover their words as quickly as possible, while minimizing the number of incorrect guesses.
At the start of the game, the board consists of 25 English words.
The Codemaster has access to a hidden map that tells them the identity of all of the words (Red, Blue, Civilian or Assassin).
The Codemaster then supplies a clue and a number (the number of guesses the Guesser is obligated to make)
The clue must:
- Be semantically related to what the Codemaster wants their guesser to guess.
- Be a single English word.
- NOT be derived from or derive one of the words on the board.
It is important for the guesser to correctly order their guesses, as ordering is important.
If a guesser guesses an invalid clue , their turn is forfeit.
Play proceeds, passing back and forth, until one of 3 outcomes is achieved:
All of the Red tiles have been found -- Red Team wins.
All of the Blue tiles have been found -- Blue Team wins.
The single Assassin tile is found -- Opponent Team wins
 `;
class ChatGptGuesser extends BotGuesser {
    history;
    constructor(game, onGameChange) {
        super(game, onGameChange);
        this.history = [
            { role: 'system', content: gameRules },
            {
                role: 'system',
                content: "You are playing the association game 'Codenames' as the red guesser"
            }
        ];
    }
    createRemainingWords(board) {
        return board
            .filter((card) => !card.revealed)
            .map((card) => card.word)
            .join(',');
    }
    async createGuess(board, clue) {
        console.log(this.createRemainingWords(board));
        let prompt = 'The remaining words are: ' + this.createRemainingWords(board) + '. \n';
        prompt += "The following is the codemaster's clue: " + `(${clue.clue},${clue.number}` + '. \n';
        prompt += 'Provide a guess for one of the remaining words associated with this clue. \n';
        prompt +=
            'If you absolutely cant find a word that creates an associatiton with the clue, answer in the format "STOPGUESSING-your reason here"\n';
        prompt += 'Provide no additional text. \n';
        prompt += 'Provide your answer in the format "your guess here-your reason here" \n';
        this.history.push({ role: 'user', content: prompt });
        const response = await gpt_1.default.chat.completions.create({
            messages: this.history,
            model: 'gpt-3.5-turbo'
        });
        const content = response.choices[0].message.content;
        if (!content)
            return null;
        console.log('content', content);
        this.history.push({ role: 'assistant', content });
        return content == 'STOPGUESSING' ? null : content?.split('-')[0].trim();
    }
}
exports.ChatGptGuesser = ChatGptGuesser;
