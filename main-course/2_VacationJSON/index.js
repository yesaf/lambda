const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

function groupVacations(data) {
    const usersVacations = [];
    for (const vacation of data) {
        if (!usersVacations.some((user, index) => {
            if (user.userId === vacation.user._id) {
                usersVacations[index].vacationDates.push({
                    startDate: vacation.startDate,
                    endDate: vacation.endDate,
                });
            }
            return user.userId === vacation.user._id;
        })) {
            usersVacations.push({
                userId: vacation.user._id,
                name: vacation.user.name,
                vacationDates: [{
                    startDate: vacation.startDate,
                    endDate: vacation.endDate,
                }],
            });
        }
    }

    return usersVacations;
}

fs.writeFileSync('./output.json', JSON.stringify(groupVacations(data)));

console.log(groupVacations(data));
