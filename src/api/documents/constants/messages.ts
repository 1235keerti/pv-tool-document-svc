export const errorMessages = {
  fileTypeError: (types: string): string =>
    `please provide File-Type among : ${types}`,
  objectType: "Invalid object type",
  emptyFilesList: "Files list cannot be empty",
  maxFilesExceeded: (max: number): string =>
    `Cannot zip more than ${max} files at once`,
};
