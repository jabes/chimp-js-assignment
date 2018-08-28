/** Global definitions for development **/

declare module '*.css' {
    const styles: any;
    export = styles;
}

interface ApiObject {
    url: string,
    name: string
}
