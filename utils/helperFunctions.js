const longestStreakCheck = (now, lastDate) => {
    console.log(lastDate)
    actualNextDate = new Date(lastDate.getFullYear(),lastDate.getMonth(),lastDate.getDay()+1)
    return ([now.getFullYear(), now.getMonth(), now.getDay()] === 
        [actualNextDate.getFullYear(), actualNextDate.getMonth(), actualNextDate.getDay()]
    )        
}

module.exports = {
    longestStreakCheck
}