const fs = require("fs");

class Serializer {
    constructor(delimiter = "|") {
        this.delimiter = delimiter;
    }

    toCSV(fileName, objects) {
        const csv = objects.map((obj) => obj.toCSV()).join("\n");
        fs.writeFileSync(fileName, csv, "utf-8");
    }

    fromCSV(fileName, type) {
        const lines = fs.readFileSync(fileName, "utf-8").split("\n");
        return lines
            .filter((line) => line.trim() !== "")
            .map((line) => type.fromCSV(line));
    }
}

module.exports = Serializer;
