export const AddUserToArr = (UserArr, NewUser) => {
    let Check = false;
    UserArr?.forEach((value, Index) =>
        value?.forEach((ChildValue, ChildIndex) => {
            let { userId, socketId } = ChildValue;
            if (NewUser.userId === userId && NewUser?.socketId !== socketId) {
                UserArr[Index].push(NewUser)
                Check = true;
            } else if (NewUser.userId === userId && NewUser?.socketId === socketId)
                Check = true;

        })
    )
    if (!Check) {
        UserArr.push([NewUser])
    }

    return UserArr
}

export const geUserByUserId = (UserArr, GivenUserId) => {
    let User
    UserArr.forEach((value, Index) => {
        value.forEach((ChildValue, ChildIndex) => {
            const { socketId: SavedSocketId, userId } = ChildValue
            if (GivenUserId === userId) {
                User = ChildValue
            }
        })
    })

    return User
}