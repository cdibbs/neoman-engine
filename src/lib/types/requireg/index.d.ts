declare function requireg(moduleName: string): any;

declare namespace requireg {
    function resolve(moduleName: string): any;
}

export = requireg;