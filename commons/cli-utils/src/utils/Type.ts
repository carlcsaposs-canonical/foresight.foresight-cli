export const isPrimitive = (type: string): boolean => {
    return (
      type === 'undefined' ||
      type === 'boolean' ||
      type === 'number' ||
      type === 'string' ||
      type === 'symbol'
    );
}

export const castToType = (value: any, type: string) => {
    if (!isPrimitive(type) || value == '') {
        return value;
    }

    let result = value; 
    try {
        switch(type) {
            case 'number':
                result = (typeof value == 'string' || typeof value == 'boolean')
                    ? Number(value): value;
                break;
            case 'boolean':
                result = typeof value == 'string' ? value === 'true': value;
                break;
       }
    } finally {
        return result;
    }
}

export const isContentStringify = (content: any) => {
    return !(content instanceof String 
        || content instanceof Buffer 
        || content instanceof Uint8Array);
};