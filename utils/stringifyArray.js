const stringifyArray=(array)=>{
    const result = array.reduce((arr,value)=>{
        arr.push(String(value))
        return arr
    },[])
    return result
}


module.exports = stringifyArray