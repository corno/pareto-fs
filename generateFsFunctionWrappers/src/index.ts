// tslint:disable: no-console
import * as fs from "fs"
import { ResolveReporter } from "lingua-franca-building"
import { createWriter, IWriter } from "steroid-template-utils"
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

const rr = new ResolveReporter(reportError)
const cub = new DataBuilder(rr)
const data = createData(cub)
console.error("" + errorCount + " errors")

function doIt(path: string, cb: (w: IWriter) => void) {
    const lines: string[] = []
    const writer = createWriter("    ", true, str => lines.push(str))
    cb(writer)
    fs.writeFileSync(path, lines.join("\n"))
}

doIt("./src/lib/generated/fsFunctionWrappers.ts", w => {
    generate(data, w)
})
