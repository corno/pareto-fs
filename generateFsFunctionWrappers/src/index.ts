// tslint:disable: no-console
import * as fs from "fs"
import * as lf from "lingua-franca"
import * as fp from "fountain-pen"
import { DataBuilder } from "./generator/builder"
import {generate } from "./generator/generator"
import { createData } from "./source"

let errorCount = 0

function reportError(dependent: boolean, message: string) {
    if (dependent && errorCount === 0) {
        console.error("Unexpected state, found dependent error, but not a source error")
        //throw new Error("Unexpected state, found dependent error, but not a source error")
    }
    //if (!dependent) {
    console.error(message)
    //}
    errorCount++
}

const rr = lf.createSimpleConflictingEntryReporter({
    typeInfo: "X",
    reportError: reportError,
})
const cub = new DataBuilder(rr)
const data = createData(cub)
console.error("" + errorCount + " errors")

function doIt(path: string, callback: () => fp.IParagraph) {
    const lines: string[] = []
    const paragraph = callback()
    fp.serialize(paragraph, "    ", true, line => {
        lines.push(line)
    })
    fs.writeFileSync(path, lines.join("\n"))
}

doIt("./src/fsFunctionWrappers.ts", () => {
    return generate(data)
})
