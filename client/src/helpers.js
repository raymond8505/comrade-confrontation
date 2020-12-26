export const between = (min, max) => Math.floor(Math.random() * (max - min) + min);

const pushArrayUnique = (min,max,arr,except = []) => {

    const num = between(min,max);

    if(arr.includes(num) || except.includes(num))
    {
        pushArrayUnique(min,max,arr);
    }
    else
    {
        arr.push(num);
        return arr;
    }
}
/**
 * Fills an array with unique random numbers between the 2 given values, to the length given in num
 * @param {Int} min 
 * @param {Int} max 
 * @param {Int} num 
 * @returns {Int[]}
 */
export const fillArrayUnique = (min,max,num,except = []) => {
    
    try
    {
        const arr = [];

        for(let i = 0; i < num; i++)
        {
            pushArrayUnique(min,max,arr,except);
        }

        return arr;
    }
    catch(e)
    {
        console.log(except);
    }
};

/**
 * Takes a collection of fast money player answers and returns their total based on their state
 * @param {Object[]} answers 
 * @returns {Int}
 */
export const calculateFastMoneyTotal = (answers,currentUserIsHost) => {

    if(answers.length > 0)
    {
        const tot = answers.reduce((runningTot,a)=>{

            return a.revealed || currentUserIsHost() ? a.points + runningTot : runningTot;
        },0);

        return tot;
    }
    
    return nbsp;
}

/**
 * Takes an array and picks a random item from it, with an optional second array for items to skip
 * @param {Any[]} items items to choose from 
 * @param {Any[]} except items not to choose
 * @returns Any
 */
export const randomItem = (items,except = []) => {

    const name = items[between(0,items.length - 1)];

    return except.includes(name) ? randomItem(except) : name;
}

/**
 * For making words gramatically correct based on variable data like team names. Returns 's' if the modifier does NOT end it s. Returns '' otherwise
 */
export const maybePlural = modifier => modifier.search(/s$/) === -1 ? 's' : '';

/**
 * Whether or not we're currently on localhost
 * @returns {Boolean}
 */
export const isLocal = () => window.location.host.indexOf('localhost') > -1;

export const nbsp = '\u00A0';