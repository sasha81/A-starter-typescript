type TDataAndErrorContainer<R, E> = {
    data: R;
    error: E;
}


export type TDataUploadContainer<K extends string, R, E> = TDataAndErrorContainer<R, E> & {
    [key in K]: boolean;
}

