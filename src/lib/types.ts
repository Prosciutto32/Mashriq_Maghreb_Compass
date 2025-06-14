export type Post = {
    id: string;
    title: any;
    createdAt: any;
    description: any;
    photo: any;
};

export  type ContactCard = {
    contact_type: string;
    contact_phone?: string;
    contact_email?: string;
    contact_adress?: string;
};

export type Contact = {
    id: string;
    type: string;
    value: string;
};

export type Request = {
    id: string;
    projectTitle: string;
    status: string;
    createdAt: string;
};