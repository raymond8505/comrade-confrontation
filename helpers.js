const IDLength = 4;
/**
 * Takes an array of items and generates a unique ID 
 * @param {Object[]} existingItems an array of objects, each with a property named ID
 * @returns String an ID string that's unique withing the context of the given array
 */
const generateID = (existingItems = []) => {

    let id = '';

    for(let i = 0; i < IDLength; i++)
    {
        let charCode = Math.round((Math.random() * 25) + 97);

        id += String.fromCharCode(charCode).toUpperCase();
    }

    return IDExists(id,existingItems) ? generateID(existingItems) : id;
}

/**
 * Checks if an id exists in an array of objects with an ID field
 * @param {String} id the id to check
 * @param {Object} items a collection of objects with an ID field for 
 *                      which id must be unique
 */
const IDExists = (id,items) => {

    return items.find(item => item.id === id) !== undefined;
}

const nbsp = '\u00A0';

module.exports = {
    generateID,
    IDExists,
    nbsp
}