const longestStreakCheck = (now, lastDate) => {

    actualNextDate = new Date(lastDate.getFullYear(),lastDate.getMonth(),lastDate.getDate()+1)

    isNextDayBool = now.getFullYear() === actualNextDate.getFullYear() 
        && now.getMonth() === actualNextDate.getMonth() 
        && now.getDate() === actualNextDate.getDate()

    return isNextDayBool       
}

module.exports = {
    longestStreakCheck
}