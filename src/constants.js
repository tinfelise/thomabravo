export const constants = {
    million: 1000000,
    return_date (format, date_string) {
        var date = moment(date_string, format);
        var year = moment(date).format('YYYY');
        var month = moment(date).format('MM');
        var day = moment(date).format('DD');
        return new Date(year, month, day);
    },
    order_events (events, format) {
        events = events.sort(function (a, b) {
            return moment(a.date, format).format('x')
                .localeCompare(
                    moment(b.date, format).format('x')
                );
        });
    },
    addToArray(array, newItem) {
        return [...array, newItem];
    },
    percentage_change (current, previous) {
        const diff = current - previous;
        return diff/previous;
    }
};