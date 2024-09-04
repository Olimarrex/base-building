/**
 * @template {any} T
 * @param {T} item - Item you want to strip nullable from.
 * @returns {NonNullable<T>}
 */
function nonNull(item) {
return /** @type {NonNullable<T>} */(item)
}