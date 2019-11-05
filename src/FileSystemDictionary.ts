import { Dirent } from "fs"
import {
    IInUnsafePromise,
    IInUnsafeStrictDictionary,
    IStream,
    IUnsafePromise,
    result,
    StaticStream,
    UnsafeEntryAlreadyExistsError,
    UnsafeEntryDoesNotExistError,
    UnsafeTwoWayError,
    wrap,
} from "pareto"
import * as Path from "path"
import { functions as pfs } from "./generated/fsErrors"

export class FileSystemDictionary<CreateData, OpenData, CustomErrorType> implements IInUnsafeStrictDictionary<CreateData, OpenData, CustomErrorType> {
    private readonly path: string
    private readonly extension: string
    private readonly createCustomError: (fsError: NodeJS.ErrnoException) => CustomErrorType
    private readonly opener: (storedData: Buffer) => OpenData
    private readonly creator: (createData: CreateData) => IInUnsafePromise<Buffer, CustomErrorType>
    constructor(
        path: string,
        extension: string,
        customErrorCreator: () => CustomErrorType,
        opener: (storedData: Buffer) => OpenData,
        creator: (createData: CreateData) => IInUnsafePromise<Buffer, CustomErrorType>,
    ) {
        this.path = path
        this.extension = extension
        this.createCustomError = customErrorCreator
        this.opener = opener
        this.creator = creator
    }
    public copyEntry(sourceName: string, destinationName: string): IUnsafePromise<null, UnsafeTwoWayError<CustomErrorType>> {
        return pfs.copyFile.wrap<void, UnsafeTwoWayError<CustomErrorType>>(
            pfs.copyFile.func(
                this.createPath(sourceName),
                this.createPath(destinationName)
            ),
            {
                unknown: error => ["custom", this.createCustomError(error)],
                known: {
                    ENOENT: () => ["twoway", { entryDoesNotExist: true, entryAlreadyExists: null }],
                    EXIST: () => ["twoway", { entryDoesNotExist: false, entryAlreadyExists: true }], //it is not sure if entry really does not exist
                },
            }
        ).mapResult(() =>
            result(null)
        )
    }
    public deleteEntry(dbName: string): IUnsafePromise<null, UnsafeEntryDoesNotExistError<CustomErrorType>> {
        return pfs.unlink.wrap<void, UnsafeEntryDoesNotExistError<CustomErrorType>>(
            pfs.unlink.func(
                this.createPath(dbName)
            ),
            {
                unknown: error => ["custom", this.createCustomError(error)],
                known: {
                    ENOENT: () => ["entry does not exist"],
                },
            }
        ).mapResult(() =>
            result(null)
        )
    }
    public getKeys(): IUnsafePromise<IStream<string>, CustomErrorType> {
        return pfs.readdir.wrap<Dirent[], CustomErrorType>(
            pfs.readdir.func(
                this.createPath(this.path),
                { withFileTypes: true }
            ),
            {
                unknown: error => this.createCustomError(error),
                known: {
                    ENOENT: error => this.createCustomError(error),
                },
            }
        ).mapResult(files =>
            result(new StaticStream(files.filter(dir => dir.isDirectory() && dir.name.endsWith(this.extension))).mapDataRaw(
                file => file.name
            ))
        )
    }
    public createEntry(dbName: string, createData: CreateData): IUnsafePromise<null, UnsafeEntryAlreadyExistsError<CustomErrorType>> {
        return wrap.UnsafePromise(this.creator(createData)
        ).mapErrorRaw<UnsafeEntryAlreadyExistsError<CustomErrorType>>(error =>
            ["custom", error]
        ).try(buffer => {
            return pfs.writeFile.wrap<void, UnsafeEntryAlreadyExistsError<CustomErrorType>>(
                pfs.writeFile.func(
                    this.createPath(dbName),
                    buffer
                ),
                {
                    unknown: error => ["custom", this.createCustomError(error)],
                    known: {
                        EXIST: () => ["entry already exists"],
                    },
                }

            ).mapResult(() =>
                result(null)
            )
        })
    }
    public renameEntry(oldName: string, newName: string): IUnsafePromise<null, UnsafeTwoWayError<CustomErrorType>> {
        return pfs.rename.wrap<void, UnsafeTwoWayError<CustomErrorType>>(
            pfs.rename.func(
                this.createPath(oldName),
                this.createPath(newName)
            ),
            {
                unknown: error => ["custom", this.createCustomError(error)],
                known: {
                    ENOENT: () => ["twoway", { entryDoesNotExist: true, entryAlreadyExists: null }],
                    EXIST: () => ["twoway", { entryDoesNotExist: false, entryAlreadyExists: true }], //it is not sure if entry really does not exist
                },
            }

        ).mapResult(() =>
            result(null)
        )
    }
    public getEntry(dbName: string): IUnsafePromise<OpenData, UnsafeEntryDoesNotExistError<CustomErrorType>> {
        return pfs.readFile.wrap<Buffer, UnsafeEntryDoesNotExistError<CustomErrorType>>(
            pfs.readFile.func(
                this.createPath(dbName)
            ),
            {
                unknown: error => ["custom", this.createCustomError(error)],
                known: {
                    ENOENT: () => ["entry does not exist"],
                },
            }
        ).mapResult(data =>
            result(this.opener(data))
        )
    }
    private createPath(dbName: string) {
        return Path.join(this.path, dbName + this.extension)
    }
}
