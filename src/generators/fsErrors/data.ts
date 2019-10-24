
import * as Writer from "steroid-template-utils"
import * as generator from "./generator"

const data: generator.FSFunctions = {
    access: {
        errors: ["ENOENT"],
    },
    copyFile: {
        errors: ["ENOENT", "EXIST"],
    },
    readdir: {
        errors: ["ENOENT"],
    },
    readFile: {
        errors: ["ENOENT"],
    },
    rename: {
        errors: ["ENOENT", "EXIST"],
    },
    unlink: {
        errors: ["ENOENT"],
    },
    writeFile: {
        errors: ["EXIST"],
    },
}

import * as fs from "fs"

const out: string[] = []
generator.generate(data, Writer.createWriter("    ", true, string => out.push(string)))

fs.writeFileSync("./src/wrappers/fs/generated/fsErrors.ts", out.join("\n"))
