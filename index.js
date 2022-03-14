"use strict";
exports.__esModule = true;
var SystemDirectory = /** @class */ (function () {
    function SystemDirectory(name) {
        var _this = this;
        this.currentDirectory = {
            nameDirectory: "root",
            folder: new Array(),
            file: new Array(),
            parentFolder: null
        };
        this.pwd = function (text, parentFolder) {
            console.log(text);
            if (parentFolder.currentDirectory.nameDirectory == "root") {
                text = "/root" + text;
                return text;
            }
            text = "/" + parentFolder.currentDirectory.nameDirectory + text;
            return _this.pwd(text, parentFolder.currentDirectory.parentFolder);
        };
        this.cdPrompt = function (name) {
            var directory = new SystemDirectory(_this.currentDirectory.nameDirectory);
            directory.currentDirectory.file = _this.currentDirectory.file;
            directory.currentDirectory.folder = _this.currentDirectory.folder;
            directory.currentDirectory.parentFolder = _this.currentDirectory.parentFolder;
            if (name == "..") {
                if (_this.currentDirectory.parentFolder != null) {
                    return _this.currentDirectory.parentFolder;
                }
                var _parent = new SystemDirectory(_this.currentDirectory.nameDirectory);
                _parent.currentDirectory.file = _this.currentDirectory.file;
                _parent.currentDirectory.folder = _this.currentDirectory.folder;
                _parent.currentDirectory.parentFolder = _this.currentDirectory.parentFolder;
                return _parent;
            }
            if (_this.currentDirectory.folder.length < 0) {
                console.log("Entro");
                return directory;
            }
            var nextFolder = directory;
            for (var index = 0; index < _this.currentDirectory.folder.length; index++) {
                if (_this.currentDirectory.folder[index].currentDirectory.nameDirectory == name) {
                    nextFolder = _this.currentDirectory.folder[index];
                }
            }
            console.log(nextFolder);
            return nextFolder;
        };
        this.mkdir = function (name) {
            var newDirectory = new SystemDirectory(name);
            _this.currentDirectory.folder.push(newDirectory);
            var index = _this.currentDirectory.folder.indexOf(newDirectory);
            var _parent = new SystemDirectory(_this.currentDirectory.nameDirectory);
            _parent.currentDirectory.file = _this.currentDirectory.file;
            _parent.currentDirectory.folder = _this.currentDirectory.folder;
            _parent.currentDirectory.parentFolder = _this.currentDirectory.parentFolder;
            _this.currentDirectory.folder[index].currentDirectory.parentFolder = _parent;
        };
        this.touch = function (name) {
            _this.currentDirectory.file.push(name);
        };
        this.ls = function () {
            var text = "";
            if (_this.currentDirectory.file.length != 0) {
                _this.currentDirectory.file.forEach(function (element) {
                    text = text + "\n" + element;
                });
            }
            if (_this.currentDirectory.folder.length != 0) {
                _this.currentDirectory.folder.forEach(function (Element) {
                    text = text + "\n" + Element.currentDirectory.nameDirectory;
                });
            }
            return text;
        };
        this.currentDirectory.nameDirectory = name;
    }
    return SystemDirectory;
}());
var Directorio = /** @class */ (function () {
    function Directorio() {
        this.directorio = new SystemDirectory("root");
    }
    Directorio.prototype.change = function (prompt) {
        if (prompt == "quit") {
            return "quit";
        }
        if (prompt == "pwd") {
            var text = this.directorio.pwd("", this.directorio);
            console.log(text);
            return;
        }
        if (prompt.slice(0, 2) == "cd") {
            this.directorio = this.directorio.cdPrompt(prompt.slice(2, prompt.length).trim());
            return;
        }
        if (prompt.slice(0, 2) == "ls") {
            console.log(this.directorio.ls());
            return;
        }
        if (prompt.slice(0, 5) == "mkdir") {
            this.directorio.mkdir(prompt.slice(6, prompt.length));
            return;
        }
        if (prompt.slice(0, 5) == "touch") {
            this.directorio.touch(prompt.slice(6, prompt.length));
            return;
        }
        console.log("Unrecognized command");
        return;
    };
    return Directorio;
}());
var readline = require("readline-sync");
var userinput = "";
var directorio = new Directorio();
while (userinput != "quit") {
    userinput = readline.question("");
    userinput = directorio.change(userinput);
}
