"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guacamole_lite_1 = __importDefault(require("guacamole-lite"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const guacdOptions = {
    port: 4822,
};
const clientOptions = {
    crypt: {
        cypher: 'AES-256-CBC',
        key: 'MySuperSecretKeyForParamsToken12',
    },
    log: {
        level: 'DEBUG',
    },
};
const serverOptions = {
    server,
    path: '/guac',
};
new guacamole_lite_1.default(serverOptions, guacdOptions, clientOptions);
server.listen(3000);
