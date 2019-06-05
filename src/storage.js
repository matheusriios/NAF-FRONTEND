const Storage = () => {

    const set = (data) => {
        if (data) {
            for (var key in data) {
                window.localStorage.setItem(key, data[key])
            }
        }
    }

    const get = (data) => {
        if (data) {
            if (typeof data == "string")
                return window.localStorage.getItem(data)
            else
                for (var key in data)
                    return window.localStorage.getItem(data[key])
        }
    }

    const remove = (data) => {
        if (data) {
            if (typeof data == "string")
                return window.localStorage.removeItem(data)
            else
                for (var key in data)
                    return window.localStorage.removeItem(data[key])
        }
    }

    return {
        set,
        get,
        remove
    }
}

export default Storage;