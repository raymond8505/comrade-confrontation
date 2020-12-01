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