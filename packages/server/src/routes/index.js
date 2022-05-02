"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.get('/createNewRoom', (req, res) => {
    res.send((0, uuid_1.v4)());
});
router.get('/:roomId', (req, res, next) => {
    next();
});
router.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../../public/index.html'));
});
exports.default = router;
