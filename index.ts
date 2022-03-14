interface Command {
    execute(): any;
    undo(): any;
}

class SystemDirectory {

    public currentDirectory = {
        nameDirectory: "root",
        folder: new Array<SystemDirectory>(),
        file: new Array(),
        parentFolder: <SystemDirectory>null,
    };



    constructor(name?: string) {
        this.currentDirectory.nameDirectory = name;
    }

    public pwd = (text: string, parentFolder: SystemDirectory) => {
        if (parentFolder.currentDirectory.nameDirectory == "root") {
            text = "/root" + text;
            return text;
        }
        text = text + "/" + parentFolder.currentDirectory.nameDirectory;
        return this.pwd(text, this.currentDirectory.parentFolder);
    }

    public cdPrompt = (name: string) => {
        const directory = new SystemDirectory(this.currentDirectory.nameDirectory);
        directory.currentDirectory.file = this.currentDirectory.file;
        directory.currentDirectory.folder = this.currentDirectory.folder;
        directory.currentDirectory.parentFolder = this.currentDirectory.parentFolder;
        if (name == "..") {
            if (this.currentDirectory.parentFolder != null) {
                return this.currentDirectory.parentFolder
            }
            const _parent = new SystemDirectory(this.currentDirectory.nameDirectory);
            _parent.currentDirectory.file = this.currentDirectory.file;
            _parent.currentDirectory.folder = this.currentDirectory.folder;
            _parent.currentDirectory.parentFolder = this.currentDirectory.parentFolder;
            return _parent;
        }
        if (this.currentDirectory.folder.length == 0) {
            console.log("Entro")

            return directory;
        }
        let nextFolder = directory;
        for (let index = 0; index < this.currentDirectory.folder.length; index++) {
            if (this.currentDirectory.folder[index].currentDirectory.nameDirectory == name) {
                nextFolder = this.currentDirectory.folder[index];
            }
        }
        return nextFolder;
    }
    public mkdir = (name: string) => {
        const newDirectory = new SystemDirectory(name);
        this.currentDirectory.folder.push(newDirectory);
        let index = this.currentDirectory.folder.indexOf(newDirectory);
        const _parent = new SystemDirectory(this.currentDirectory.nameDirectory);
        _parent.currentDirectory.file = this.currentDirectory.file;
        _parent.currentDirectory.folder = this.currentDirectory.folder;
        _parent.currentDirectory.parentFolder = this.currentDirectory.parentFolder;
        this.currentDirectory.folder[index].currentDirectory.parentFolder = _parent;
    }

    public touch = (name: string) => {
        this.currentDirectory.file.push(name);
    }
    public ls = () => {
        let text = "";
        if (this.currentDirectory.file.length != 0) {
            this.currentDirectory.file.forEach(element => {
                text = text + "\n" + element;
            });
        }
        if (this.currentDirectory.folder.length != 0) {
            this.currentDirectory.folder.forEach(Element => {
                text = text + "\n" + Element.currentDirectory.nameDirectory;
            })
        }
        console.log(text);
        return text;
    }
}

class Directorio {
    private directorio = new SystemDirectory("root");


    change(prompt: String) {

        if (prompt == "quit") {
            return "quit"
        }
        if (prompt == "pwd") {
            var text = this.directorio.pwd("", this.directorio);
            return text;
        }
        if (prompt.slice(0, 2) == "cd") {
            this.directorio = this.directorio.cdPrompt(prompt.slice(2, prompt.length).trim());
            return
        }
        if (prompt.slice(0, 2) == "ls") {
            return this.directorio.ls();
        }
        if (prompt.slice(0, 5) == "mkdir") {
            this.directorio.mkdir(prompt.slice(6, prompt.length));
            return
        }
        if (prompt.slice(0, 5) == "touch") {
            this.directorio.touch(prompt.slice(6, prompt.length));
            return
        }
        return "Unrecognized command"

    }
}



import readline = require('readline-sync');
var userinput = "";
let directorio = new Directorio();
while (userinput != "quit") {
    userinput = readline.question("");
    userinput = directorio.change(userinput);
    console.log(userinput);
}