"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sanitizer(key) {
    return key;
}
function generate(data, writer) {
    writer.write(`// tslint:disable: variable-name`, `import * as fs from "fs"`, `import { wrapUnsafeFunction } from "pareto-20"`, `import * as util from "util"`, `type ErrorFunction<ErrorType> = (error: NodeJS.ErrnoException) => ErrorType`, ``);
    data.functions.forEachAlphabeticallyWithKey(sanitizer, (func, fName) => {
        writer.write(`type lookup_${fName}<NewError> = {`, () => {
            writer.write(`unknown: ErrorFunction<NewError>`, `known: {`, () => {
                func["expected errors"].forEachAlphabeticallyWithKey(sanitizer, (_, err) => {
                    writer.write(`"${err}": ErrorFunction<NewError>`);
                });
            }, `}`);
        }, `}`, ``, `export function handleError_${fName}<NewError>(error: NodeJS.ErrnoException, lookup: lookup_${fName}<NewError>) {`, () => {
            writer.write(`if (error.code === undefined) { return lookup.unknown(error) }`, `switch (error.code) {`, () => {
                func["expected errors"].forEachAlphabeticallyWithKey(sanitizer, (_, err) => {
                    writer.write(`case "${err}" : return lookup.known.${err}(error)`);
                });
            }, `}`, `return lookup.unknown(error)`);
        }, `}`, ``, 
        // `export function createHandler_${fName}<NewError, DataType>(lookup: lookup_${fName}<NewError>) {`, () => {
        //     writer.write(
        //         `return ((err: NodeJS.ErrnoException, data: DataType) => void) => {`, () => {
        //             writer.write(
        //                 `if (err !== null) { on}`
        //             )
        //         }, `}`
        //     )
        // }, `}`,
        // ``,
        `export const api_${fName} = {`, () => {
            writer.write(`func: util.promisify(fs.${fName}),`, `wrap: <T, ErrorType>(promise: Promise<T>, lookup: lookup_${fName}<ErrorType>) => {`, () => {
                writer.write(`return wrapUnsafeFunction<T, ErrorType>((onError, onSuccess) => promise.then(`, () => {
                    writer.write(`success => onSuccess(success),`, `error => onError(handleError_${fName}<ErrorType>(error as NodeJS.ErrnoException, lookup))`);
                }, `))`);
            }, `},`);
        }, `}`, ``);
    });
    writer.write(`export const functions = {`, () => {
        writer.write(`constants : fs.constants,`);
        data.functions.forEachAlphabeticallyWithKey(sanitizer, (_, fName) => {
            //const func = functions[fName]
            writer.write(`${fName} : api_${fName},`);
        });
    }, `}`, ``);
}
exports.generate = generate;
