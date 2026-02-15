declare module 'hpp' {
    import { RequestHandler } from 'express';
    interface Options {
        checkBody?: boolean;
        checkQuery?: boolean;
        whitelist?: string[] | string;
    }
    function hpp(options?: Options): RequestHandler;
    export = hpp;
}
