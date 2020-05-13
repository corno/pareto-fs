import * as fp from "fountain-pen"
import * as S from "./schema"

export function generate(data: S.Data): fp.IParagraph {
    return [
        `// tslint:disable: variable-name`,
        `import * as fs from "fs"`,
        `import { wrapUnsafeFunction } from "pareto-20"`,
        `import * as util from "util"`,
        `type ErrorFunction<ErrorType> = (error: NodeJS.ErrnoException) => ErrorType`,
        ``,
        data.functions.getAlphabeticalOrdering({}).map({
            callback: p => {
                return [
                    `type lookup_${p.key}<NewError> = {`, () => {
                        return [
                            `unknown: ErrorFunction<NewError>`,
                            `known: {`,
                            () => {
                                return p.element["expected errors"].getAlphabeticalOrdering({}).map({
                                    callback: p => {
                                        return [
                                            `"${p.key}": ErrorFunction<NewError>`,
                                        ]
                                    },
                                })
                            },
                            `}`,
                        ]
                    }, `}`,
                    ``,
                    `export function handleError_${p.key}<NewError>(error: NodeJS.ErrnoException, lookup: lookup_${p.key}<NewError>) {`, () => {
                        return [
                            `if (error.code === undefined) { return lookup.unknown(error) }`,
                            `switch (error.code) {`,
                            () => {
                                return p.element["expected errors"].getAlphabeticalOrdering({}).map({
                                    callback: p => {
                                        return [
                                            `case "${p.key}" : return lookup.known.${p.key}(error)`,
                                        ]
                                    },
                                })
                            },
                            `}`,
                            `return lookup.unknown(error)`,
                        ]
                    }, `}`,
                    ``,
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
                    `export const api_${p.key} = {`, () => {
                        return [
                            `func: util.promisify(fs.${p.key}),`,
                            `wrap: <T, ErrorType>(promise: Promise<T>, lookup: lookup_${p.key}<ErrorType>) => {`, () => {
                                return [
                                    `return wrapUnsafeFunction<T, ErrorType>((onError, onSuccess) => promise.then(`, () => {
                                        return [
                                            `success => onSuccess(success),`,
                                            `error => onError(handleError_${p.key}<ErrorType>(error as NodeJS.ErrnoException, lookup))`,
                                        ]
                                    }, `))`,
                                ]
                            }, `},`,
                        ]

                    }, `}`,
                    ``,
                ]
            },
        }),
        `export const functions = {`, () => {
            return [
                `constants : fs.constants,`,
                data.functions.getAlphabeticalOrdering({}).map({
                    callback: p => {
                        //const func = functions[p.key]
                        return [
                            `${p.key} : api_${p.key},`,
                        ]
                    },
                }),
            ]
        }, `}`,
        ``,
    ]
}
