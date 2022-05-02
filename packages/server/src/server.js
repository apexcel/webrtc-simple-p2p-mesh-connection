"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_1 = __importDefault(require("./socket"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(routes_1.default);
const server = (0, http_1.createServer)(app);
(0, socket_1.default)(server, app);
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
