// tslint:disable: variable-name
import * as fs from "fs"
import { wrapUnsafeFunction } from "pareto-20"
import * as util from "util"
type ErrorFunction<ErrorType> = (error: NodeJS.ErrnoException) => ErrorType

type lookup_access<NewError> = {
    unknown: ErrorFunction<NewError>
    known: {
        "ENOENT": ErrorFunction<NewError>
    }
}

export function handleError_access<NewError>(error: NodeJS.ErrnoException, lookup: lookup_access<NewError>) {
    if (error.code === undefined) { return lookup.unknown(error) }
    switch (error.code) {
        case "ENOENT" : return lookup.known.ENOENT(error)
    }
    return lookup.unknown(error)
}

export const api_access = {
    func: util.promisify(fs.access),
    wrap: <T, ErrorType>(promise: Promise<T>, lookup: lookup_access<ErrorType>) => {
        return wrapUnsafeFunction<T, ErrorType>((onError, onSuccess) => promise.then(
            success => onSuccess(success),
            error => onError(handleError_access<ErrorType>(error as NodeJS.ErrnoException, lookup))
        ))
    },
}

type lookup_copyFile<NewError> = {
    unknown: ErrorFunction<NewError>
    known: {
        "ENOENT": ErrorFunction<NewError>
        "EXIST": ErrorFunction<NewError>
    }
}

export function handleError_copyFile<NewError>(error: NodeJS.ErrnoException, lookup: lookup_copyFile<NewError>) {
    if (error.code === undefined) { return lookup.unknown(error) }
    switch (error.code) {
        case "ENOENT" : return lookup.known.ENOENT(error)
        case "EXIST" : return lookup.known.EXIST(error)
    }
    return lookup.unknown(error)
}

export const api_copyFile = {
    func: util.promisify(fs.copyFile),
    wrap: <T, ErrorType>(promise: Promise<T>, lookup: lookup_copyFile<ErrorType>) => {
        return wrapUnsafeFunction<T, ErrorType>((onError, onSuccess) => promise.then(
            success => onSuccess(success),
            error => onError(handleError_copyFile<ErrorType>(error as NodeJS.ErrnoException, lookup))
        ))
    },
}

type lookup_readdir<NewError> = {
    unknown: ErrorFunction<NewError>
    known: {
        "ENOENT": ErrorFunction<NewError>
    }
}

export function handleError_readdir<NewError>(error: NodeJS.ErrnoException, lookup: lookup_readdir<NewError>) {
    if (error.code === undefined) { return lookup.unknown(error) }
    switch (error.code) {
        case "ENOENT" : return lookup.known.ENOENT(error)
    }
    return lookup.unknown(error)
}

export const api_readdir = {
    func: util.promisify(fs.readdir),
    wrap: <T, ErrorType>(promise: Promise<T>, lookup: lookup_readdir<ErrorType>) => {
        return wrapUnsafeFunction<T, ErrorType>((onError, onSuccess) => promise.then(
            success => onSuccess(success),
            error => onError(handleError_readdir<ErrorType>(error as NodeJS.ErrnoException, lookup))
        ))
    },
}

type lookup_readFile<NewError> = {
    unknown: ErrorFunction<NewError>
    known: {
        "ENOENT": ErrorFunction<NewError>
    }
}

export function handleError_readFile<NewError>(error: NodeJS.ErrnoException, lookup: lookup_readFile<NewError>) {
    if (error.code === undefined) { return lookup.unknown(error) }
    switch (error.code) {
        case "ENOENT" : return lookup.known.ENOENT(error)
    }
    return lookup.unknown(error)
}

export const api_readFile = {
    func: util.promisify(fs.readFile),
    wrap: <T, ErrorType>(promise: Promise<T>, lookup: lookup_readFile<ErrorType>) => {
        return wrapUnsafeFunction<T, ErrorType>((onError, onSuccess) => promise.then(
            success => onSuccess(success),
            error => onError(handleError_readFile<ErrorType>(error as NodeJS.ErrnoException, lookup))
        ))
    },
}

type lookup_rename<NewError> = {
    unknown: ErrorFunction<NewError>
    known: {
        "ENOENT": ErrorFunction<NewError>
        "EXIST": ErrorFunction<NewError>
    }
}

export function handleError_rename<NewError>(error: NodeJS.ErrnoException, lookup: lookup_rename<NewError>) {
    if (error.code === undefined) { return lookup.unknown(error) }
    switch (error.code) {
        case "ENOENT" : return lookup.known.ENOENT(error)
        case "EXIST" : return lookup.known.EXIST(error)
    }
    return lookup.unknown(error)
}

export const api_rename = {
    func: util.promisify(fs.rename),
    wrap: <T, ErrorType>(promise: Promise<T>, lookup: lookup_rename<ErrorType>) => {
        return wrapUnsafeFunction<T, ErrorType>((onError, onSuccess) => promise.then(
            success => onSuccess(success),
            error => onError(handleError_rename<ErrorType>(error as NodeJS.ErrnoException, lookup))
        ))
    },
}

type lookup_unlink<NewError> = {
    unknown: ErrorFunction<NewError>
    known: {
        "ENOENT": ErrorFunction<NewError>
    }
}

export function handleError_unlink<NewError>(error: NodeJS.ErrnoException, lookup: lookup_unlink<NewError>) {
    if (error.code === undefined) { return lookup.unknown(error) }
    switch (error.code) {
        case "ENOENT" : return lookup.known.ENOENT(error)
    }
    return lookup.unknown(error)
}

export const api_unlink = {
    func: util.promisify(fs.unlink),
    wrap: <T, ErrorType>(promise: Promise<T>, lookup: lookup_unlink<ErrorType>) => {
        return wrapUnsafeFunction<T, ErrorType>((onError, onSuccess) => promise.then(
            success => onSuccess(success),
            error => onError(handleError_unlink<ErrorType>(error as NodeJS.ErrnoException, lookup))
        ))
    },
}

type lookup_writeFile<NewError> = {
    unknown: ErrorFunction<NewError>
    known: {
        "EXIST": ErrorFunction<NewError>
    }
}

export function handleError_writeFile<NewError>(error: NodeJS.ErrnoException, lookup: lookup_writeFile<NewError>) {
    if (error.code === undefined) { return lookup.unknown(error) }
    switch (error.code) {
        case "EXIST" : return lookup.known.EXIST(error)
    }
    return lookup.unknown(error)
}

export const api_writeFile = {
    func: util.promisify(fs.writeFile),
    wrap: <T, ErrorType>(promise: Promise<T>, lookup: lookup_writeFile<ErrorType>) => {
        return wrapUnsafeFunction<T, ErrorType>((onError, onSuccess) => promise.then(
            success => onSuccess(success),
            error => onError(handleError_writeFile<ErrorType>(error as NodeJS.ErrnoException, lookup))
        ))
    },
}

export const functions = {
    constants : fs.constants,
    access : api_access,
    copyFile : api_copyFile,
    readdir : api_readdir,
    readFile : api_readFile,
    rename : api_rename,
    unlink : api_unlink,
    writeFile : api_writeFile,
}
