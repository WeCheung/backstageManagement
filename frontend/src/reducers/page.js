

export default function (state = {currentPage: 1}, action) {
    // console.log(action);
    const page = action.data
    switch (action.type) {
        case 'CHANGE_PAGE':
            return {currentPage: page}
        default:
            return state
    }
}