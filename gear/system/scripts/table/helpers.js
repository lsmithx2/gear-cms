const chunk = (arr, size) => {
    if(!size) {
        size = arr.length
    }
    let result = []
    for(let i = 0, len = arr.length; i < len; i += size) {
        result.push(arr.slice(i, i + size))
    }
    return result
}

export const orderBy = (arr, field, order) => {
    if(!arr || !arr.length) {
        return []
    }
    const GREATER = order === 'desc' ? -1 : 1
    const SMALLER = -GREATER
    return arr.sort((a, b) => {
        let first = dotGet(a, field)
        let second = dotGet(b, field)
        if(!first && !second) {
            return 0
        }
        if(!first && first !== 0) {
            return SMALLER
        }
        if(!second && second !== 0) {
            return GREATER
        }
        if(typeof first === 'number' && typeof second === 'number') {
            if(first === second) {
                return 0
            }
            if(first > second) {
                return GREATER
            }
            return SMALLER
        }
        if(typeof first === 'string' && typeof second === 'string') {
            let cmp = first.localeCompare(second)
            if(cmp === 0) {
                return 0
            }
            if(cmp > 0) {
                return GREATER
            }
            return SMALLER
        }
        if(first > second) {
            return GREATER
        }
        if(first < second) {
            return SMALLER
        }
        return 0
    })
}

const filter = (items, filtering) => {
    return items.filter(item => {
        for(let i = 0; i < filtering.fields.length; i++) {
            let field = filtering.fields[i]
            let value = dotGet(item, field)
            if(!value) {
                continue
            }
            if(`${value}`.toLowerCase().indexOf(filtering.query) === -1) {
                continue
            }
            return true
        }
        return false
    })
}

export const load = (data, filtering, sorting, paging) => {
    let filtered = (!filtering || !filtering.query) ? data : filter(data, filtering)
    if(!filtered || !filtered.length) {
        return {
            items: [],
            total: 0
        }
    }
    let ordered = orderBy(filtered, sorting.by, sorting.order)
    let chunked = chunk(ordered, paging.perPage)
    let items = chunked[paging.page - 1]
    if(!items) {
        return {
            items: [],
            total: filtered.length
        }
    }
    return {
        items,
        total: filtered.length
    }
}

export const defaultProps = (options, data) => {
    let props = {}
    for(let key in options) {
        if(data[key] !== undefined) {
            props[key] = data[key]
            continue
        }
        if(typeof options[key].default === 'function') {
            props[key] = options[key].default()
            continue
        }
        props[key] = options[key].default
    }
    return props
}

export const dotGet = (obj, path) => {
    return path.split('.').reduce((o, i) => o[i], obj)
}

export const dotSet = (obj, path, val) => {
    let parts = path.split('.')
    return parts.reduce((o, i, idx) => {
        if(idx === parts.length - 1) {
            o[i] = val
            return o[i]
        }
        if(!o.hasOwnProperty(i)) {
            o[i] = {}
        }
        return o[i]
    }, obj)
}

const uniqArr = arr => {
    return arr.filter(function (item, pos) {
        return arr.indexOf(item) === pos
    })
}

const range = n => {
    let a = []
    for(var i = 0; i < n; i++) {
        a[i] = i + 1
    }
    return a
}

export const paginate = (currentPage, total) => {
    let showing = 3
    let eachSide = 2
    if(total <= showing + eachSide) {
        return paginationValueOrThreeDots(range(total))
    }
    let pages = []
    for(let i = 0; i < eachSide; i++) {
        pages.push(i + 1)
        pages.push(total - i)
    }
    for(let i = 0; i < Math.ceil(showing / 2); i++) {
        if(currentPage - i > 1) {
            pages.push(currentPage - i)
        }
        if(currentPage + i < total) {
            pages.push(currentPage + i)
        }
    }
    return paginationValueOrThreeDots(uniqArr(pages).sort((a, b) => a - b))
}

const paginationValueOrThreeDots = pages => {
    const dots = '...'
    for(let i = 0; i < pages.length - 1; i++) {
        if(pages[i + 1] - pages[i] > 1) {
            pages.splice(i + 1, 0, dots)
        }
    }
    pages = pages.map(page => {
        return {
            value: page,
            disabled: page === dots
        }
    })
    return pages
}
