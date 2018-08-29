/** Global definitions for development **/

declare module '*.css' {
    const styles: any;
    export = styles;
}

declare module "*.svg" {
    const content: any;
    export = content;
}

interface ApiObject {
    url: string,
    name: string
}
