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
exports.ChatGptSpymaster = void 0;
const gpt_1 = __importStar(require("./gpt"));
const zod_1 = require("zod");
const zod_2 = require("openai/helpers/zod");
const BotSpymaster_1 = require("./BotSpymaster");
const clueObject = zod_1.z.object({
    clue: zod_1.z.string(),
    number: zod_1.z.number()
});
class ChatGptSpymaster extends BotSpymaster_1.BotSpymaster {
    history;
    constructor(game) {
        super(game);
        this.history = [
            { role: 'system', content: gpt_1.gameRules },
            {
                role: 'system',
                content: `You are playing the association game "Codenames" as the ${game.currentTeam} spymaster`
            }
        ];
    }
    createRemainingWords() {
        return this.game.board
            .filter((card) => !card.revealed)
            .map((card) => `${card.word}(${card.type})`)
            .join(',');
    }
    async createClue() {
        console.log(this.createRemainingWords());
        let prompt = 'The remaining words are: ' + this.createRemainingWords() + '. \n';
        prompt += 'Provide a single word clue and number for the guesser.';
        prompt += 'Stick to this format exactly and provide no additional text. ';
        this.history.push({ role: 'user', content: prompt });
        const response = await gpt_1.default.beta.chat.completions.parse({
            messages: this.history,
            model: 'gpt-4o-mini',
            response_format: (0, zod_2.zodResponseFormat)(clueObject, 'clue')
        });
        const content = response.choices[0].message.parsed;
        if (!content)
            return null;
        console.log('content', content);
        this.history.push({ role: 'assistant', content: content.clue });
        return content;
    }
}
exports.ChatGptSpymaster = ChatGptSpymaster;
