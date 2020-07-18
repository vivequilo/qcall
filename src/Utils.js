/**
 * It is a Utils Class
 *
 * It has different purposes. Will bring some functions to use instead of a library
 *
 * @author Augusto Alonso.
 */


export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16)
    });
}