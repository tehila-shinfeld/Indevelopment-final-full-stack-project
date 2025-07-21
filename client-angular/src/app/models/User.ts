
export class User
{
    constructor
    (
        public username : string,
        public email: string,
        public passwordHash : string,
        public company : string, 
        public role?: string, 
        public id?: number,

    )
    {}

    
}