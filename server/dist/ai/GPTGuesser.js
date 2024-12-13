"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGptGuesser = void 0;
const gpt_1 = __importStar(require("./gpt"));
const BotGuesser_1 = require("./BotGuesser");
const zod_1 = require("openai/helpers/zod");
const zod_2 = require("zod");
const guessObject = zod_2.z.object({
    guess: zod_2.z.string(),
    endGuessing: zod_2.z.boolean(),
    reason: zod_2.z.string()
});
class ChatGptGuesser extends BotGuesser_1.BotGuesser {
    history;
    constructor(game, onGameChange) {
        super(game, onGameChange);
        this.history = [
            { role: 'system', content: gpt_1.gameRules },
            {
                role: 'system',
                content: `You are playing the association game 'Codenames' as the ${game.currentTeam} guesser`
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
            'If you absolutely cant find a word that creates an associatiton with the clue, answer by setting endGuessing in the JSON response to false\n';
        prompt += 'Provide a reason for your desicion in the reason field of the JSON response" \n';
        this.history.push({ role: 'user', content: prompt });
        const response = await gpt_1.default.beta.chat.completions.parse({
            messages: this.history,
            model: 'gpt-4o-mini',
            response_format: (0, zod_1.zodResponseFormat)(guessObject, 'guess')
        });
        const content = response.choices[0].message.parsed;
        if (!content)
            return null;
        console.log('content', content.guess, content.reason);
        this.history.push({ role: 'assistant', content: content.guess });
        return content;
    }
}
exports.ChatGptGuesser = ChatGptGuesser;
