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
            callback: (func, fName) => {
                return [
                    `type lookup_${fName}<NewError> = {`, () => {
                        return [
                            `unknown: ErrorFunction<NewError>`,
                            `known: {`,
                            () => {
                                return func["expected errors"].getAlphabeticalOrdering({}).map({
                                    callback: (_, err) => {
                                        return [
                                            `"${err}": ErrorFunction<NewError>`,
                                        ]
                                    },
                                })
                            },
                            `}`,
                        ]
                    }, `}`,
                    ``,
                    `export function handleError_${fName}<NewError>(error: NodeJS.ErrnoException, lookup: lookup_${fName}<NewError>) {`, () => {
                        return [
                            `if (error.code === undefined) { return lookup.unknown(error) }`,
                            `switch (error.code) {`,
                            () => {
                                return func["expected errors"].getAlphabeticalOrdering({}).map({
                                    callback: (_, err) => {
                                        return [
                                            `case "${err}" : return lookup.known.${err}(error)`,
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
                    `export const api_${fName} = {`, () => {
                        return [
                            `func: util.promisify(fs.${fName}),`,
                            `wrap: <T, ErrorType>(promise: Promise<T>, lookup: lookup_${fName}<ErrorType>) => {`, () => {
                                return [
                                    `return wrapUnsafeFunction<T, ErrorType>((onError, onSuccess) => promise.then(`, () => {
                                        return [
                                            `success => onSuccess(success),`,
                                            `error => onError(handleError_${fName}<ErrorType>(error as NodeJS.ErrnoException, lookup))`,
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
                    callback: (_, fName) => {
                        //const func = functions[fName]
                        return [
                            `${fName} : api_${fName},`,
                        ]
                    },
                }),
            ]
        }, `}`,
        ``,
    ]
}
